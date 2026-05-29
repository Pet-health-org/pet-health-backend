import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Mascota } from './entities/mascota.entity';
import { CreateMascotaDto, UpdateMascotaDto } from './dto/mascota.dto';
import { PropietarioService } from '../propietario/propietario.service';

function calcularEdad(birthDate: string): number {
  const nacimiento = new Date(birthDate);
  if (isNaN(nacimiento.getTime())) {
    throw new BadRequestException('La fecha de nacimiento no es válida');
  }
  if (nacimiento > new Date()) {
    throw new BadRequestException(
      'La fecha de nacimiento no puede ser posterior a la fecha actual',
    );
  }
  const hoy = new Date();
  let edad = hoy.getFullYear() - nacimiento.getFullYear();
  const mesDiff = hoy.getMonth() - nacimiento.getMonth();
  if (mesDiff < 0 || (mesDiff === 0 && hoy.getDate() < nacimiento.getDate())) {
    edad--;
  }
  return edad;
}

@Injectable()
export class MascotaService {
  constructor(
    @InjectRepository(Mascota)
    private readonly mascotaRepository: Repository<Mascota>,
    private readonly propietarioService: PropietarioService,
  ) {}

  async create(createDto: CreateMascotaDto): Promise<Mascota> {
    const propietarioExists = await this.propietarioService.exists(
      createDto.propietarioId,
    );
    if (!propietarioExists) {
      throw new NotFoundException(
        `Propietario con ID ${createDto.propietarioId} no encontrado`,
      );
    }

    const edad = calcularEdad(createDto.birthDate);
    const mascota = this.mascotaRepository.create({
      ...createDto,
      edad,
    });
    return await this.mascotaRepository.save(mascota);
  }

  async findAll(): Promise<Mascota[]> {
    return await this.mascotaRepository.find({
      relations: ['propietario', 'raza'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Mascota> {
    const mascota = await this.mascotaRepository.findOne({
      where: { id },
      relations: ['propietario', 'raza'],
    });
    if (!mascota) {
      throw new NotFoundException(`Mascota con ID ${id} no encontrada`);
    }
    return mascota;
  }

  async findByPropietario(propietarioId: string): Promise<Mascota[]> {
    return await this.mascotaRepository.find({
      where: { propietarioId },
      relations: ['propietario', 'raza'],
    });
  }

  async update(id: string, updateDto: UpdateMascotaDto): Promise<Mascota> {
    const mascota = await this.findOne(id);
    if (updateDto.propietarioId) {
      const propietarioExists = await this.propietarioService.exists(
        updateDto.propietarioId,
      );
      if (!propietarioExists) {
        throw new NotFoundException(
          `Propietario con ID ${updateDto.propietarioId} no encontrado`,
        );
      }
    }

    if (updateDto.birthDate) {
      updateDto['edad'] = calcularEdad(updateDto.birthDate);
    }

    Object.assign(mascota, updateDto);
    return await this.mascotaRepository.save(mascota);
  }

  async remove(id: string): Promise<void> {
    const mascota = await this.findOne(id);
    await this.mascotaRepository.remove(mascota);
  }
}
