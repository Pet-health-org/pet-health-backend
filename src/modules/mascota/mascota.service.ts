import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Mascota } from './entities/mascota.entity';
import { CreateMascotaDto, UpdateMascotaDto } from './dto/mascota.dto';
import { PropietarioService } from '../propietario/propietario.service';

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

    const mascota = this.mascotaRepository.create(createDto);
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

    Object.assign(mascota, updateDto);
    return await this.mascotaRepository.save(mascota);
  }

  async remove(id: string): Promise<void> {
    const mascota = await this.findOne(id);
    await this.mascotaRepository.remove(mascota);
  }
}
