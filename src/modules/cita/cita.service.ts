import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cita } from './entities/cita.entity';
import { CreateCitaDto, UpdateCitaDto } from './dto/cita.dto';

@Injectable()
export class CitaService {
  constructor(
    @InjectRepository(Cita)
    private readonly citaRepository: Repository<Cita>,
  ) {}

  async create(createDto: CreateCitaDto): Promise<Cita> {
    const cita = this.citaRepository.create(createDto);
    return await this.citaRepository.save(cita);
  }

  async findAll(): Promise<Cita[]> {
    return await this.citaRepository.find({
      relations: ['mascota', 'veterinario'],
      order: { fechaHora: 'ASC' },
    });
  }

  async findOne(id: string): Promise<Cita> {
    const cita = await this.citaRepository.findOne({
      where: { id },
      relations: ['mascota', 'veterinario'],
    });
    if (!cita) {
      throw new NotFoundException(`Cita con ID ${id} no encontrada`);
    }
    return cita;
  }

  async findByMascota(mascotaId: string): Promise<Cita[]> {
    return await this.citaRepository.find({
      where: { mascotaId },
      relations: ['mascota', 'veterinario'],
      order: { fechaHora: 'DESC' },
    });
  }

  async findByVeterinario(veterinarioId: string): Promise<Cita[]> {
    return await this.citaRepository.find({
      where: { veterinarioId },
      relations: ['mascota', 'veterinario'],
      order: { fechaHora: 'ASC' },
    });
  }

  async update(id: string, updateDto: UpdateCitaDto): Promise<Cita> {
    const cita = await this.findOne(id);
    Object.assign(cita, updateDto);
    return await this.citaRepository.save(cita);
  }

  async remove(id: string): Promise<void> {
    const cita = await this.findOne(id);
    await this.citaRepository.remove(cita);
  }
}