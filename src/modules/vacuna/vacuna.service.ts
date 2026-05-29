import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Vacuna } from './entities/vacuna.entity';
import { CreateVacunaDto, UpdateVacunaDto } from './dto/vacuna.dto';
import { HistoriaClinicaService } from '../historia-clinica/historia-clinica.service';
import { VacunacionService } from '../vacunacion/vacunacion.service';
import { InventarioService } from '../inventario/inventario.service';

@Injectable()
export class VacunaService {
  constructor(
    @InjectRepository(Vacuna)
    private readonly vacunaRepository: Repository<Vacuna>,
    private readonly historiaClinicaService: HistoriaClinicaService,
    private readonly vacunacionService: VacunacionService,
    private readonly inventarioService: InventarioService,
  ) {}

  async create(createDto: CreateVacunaDto): Promise<Vacuna> {
    if (!createDto.fechaProximoRefuerzo) {
      const historia = await this.historiaClinicaService.findOne(
        createDto.historiaClinicaId,
      );
      const proximoRefuerzo =
        await this.vacunacionService.calcularProximoRefuerzo(
          historia.mascota.especie,
          createDto.nombre,
          new Date(createDto.fechaAplicacion),
          historia.mascota.edad,
        );

      if (proximoRefuerzo) {
        createDto.fechaProximoRefuerzo = proximoRefuerzo.toISOString();
      }
    }

    const inventario = await this.inventarioService.findOne(
      createDto.inventarioId,
    );
    if (inventario.stockActual < 1) {
      throw new BadRequestException(
        `Stock insuficiente para ${inventario.nombreProducto}. Disponible: ${inventario.stockActual}`,
      );
    }

    const vacuna = this.vacunaRepository.create(createDto);
    const saved = await this.vacunaRepository.save(vacuna);

    await this.inventarioService.updateStock(
      createDto.inventarioId,
      inventario.stockActual - 1,
    );

    return saved;
  }

  async findAll(): Promise<Vacuna[]> {
    return await this.vacunaRepository.find({
      relations: ['historiaClinica', 'inventario'],
      order: { fechaAplicacion: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Vacuna> {
    const vacuna = await this.vacunaRepository.findOne({
      where: { id },
      relations: ['historiaClinica', 'inventario'],
    });
    if (!vacuna) {
      throw new NotFoundException(`Vacuna con ID ${id} no encontrada`);
    }
    return vacuna;
  }

  async findByHistoriaClinica(historiaClinicaId: string): Promise<Vacuna[]> {
    return await this.vacunaRepository.find({
      where: { historiaClinicaId },
      relations: ['historiaClinica', 'inventario'],
    });
  }

  async findByMascota(mascotaId: string): Promise<Vacuna[]> {
    return await this.vacunaRepository
      .createQueryBuilder('vacuna')
      .innerJoinAndSelect('vacuna.historiaClinica', 'historiaClinica')
      .innerJoinAndSelect('vacuna.inventario', 'inventario')
      .where('historiaClinica.mascotaId = :mascotaId', { mascotaId })
      .orderBy('vacuna.fechaAplicacion', 'DESC')
      .getMany();
  }

  async update(id: string, updateDto: UpdateVacunaDto): Promise<Vacuna> {
    const vacuna = await this.findOne(id);
    Object.assign(vacuna, updateDto);
    return await this.vacunaRepository.save(vacuna);
  }

  async remove(id: string): Promise<void> {
    const vacuna = await this.findOne(id);
    await this.vacunaRepository.remove(vacuna);
  }
}
