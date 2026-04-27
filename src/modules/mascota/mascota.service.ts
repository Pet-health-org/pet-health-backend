import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Mascota } from './entities/mascota.entity';
import { CreateMascotaDto, UpdateMascotaDto } from './dto/mascota.dto';

@Injectable()
export class MascotaService {
  constructor(
    @InjectRepository(Mascota)
    private readonly mascotaRepository: Repository<Mascota>,
  ) {}

  async create(createDto: CreateMascotaDto): Promise<Mascota> {
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
    Object.assign(mascota, updateDto);
    return await this.mascotaRepository.save(mascota);
  }

  async remove(id: string): Promise<void> {
    const mascota = await this.findOne(id);
    await this.mascotaRepository.remove(mascota);
  }
}