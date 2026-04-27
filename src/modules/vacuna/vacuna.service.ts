import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Vacuna } from './entities/vacuna.entity';
import { CreateVacunaDto, UpdateVacunaDto } from './dto/vacuna.dto';

@Injectable()
export class VacunaService {
  constructor(
    @InjectRepository(Vacuna)
    private readonly vacunaRepository: Repository<Vacuna>,
  ) {}

  async create(createDto: CreateVacunaDto): Promise<Vacuna> {
    const vacuna = this.vacunaRepository.create(createDto);
    return await this.vacunaRepository.save(vacuna);
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