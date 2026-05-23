import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HistoriaClinica } from './entities/historia-clinica.entity';
import { CreateHistoriaClinicaDto, UpdateHistoriaClinicaDto } from './dto/historia-clinica.dto';

@Injectable()
export class HistoriaClinicaService {
  constructor(
    @InjectRepository(HistoriaClinica)
    private readonly historiaRepository: Repository<HistoriaClinica>,
  ) {}

  async create(createDto: CreateHistoriaClinicaDto): Promise<HistoriaClinica> {
    const historia = this.historiaRepository.create(createDto);
    return await this.historiaRepository.save(historia);
  }

  async findAll(): Promise<HistoriaClinica[]> {
    return await this.historiaRepository.find({
      relations: ['mascota'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<HistoriaClinica> {
    const historia = await this.historiaRepository.findOne({
      where: { id },
      relations: ['mascota'],
    });
    if (!historia) {
      throw new NotFoundException(
        `Historia clínica con ID ${id} no encontrada`,
      );
    }
    return historia;
  }

  async findByMascota(mascotaId: string): Promise<HistoriaClinica[]> {
    return await this.historiaRepository.find({
      where: { mascotaId },
      relations: ['mascota'],
      order: { fecha: 'DESC' },
    });
  }

  async update(
    id: string,
    updateDto: UpdateHistoriaClinicaDto,
  ): Promise<HistoriaClinica> {
    const historia = await this.findOne(id);
    Object.assign(historia, updateDto);
    return await this.historiaRepository.save(historia);
  }

  async remove(id: string): Promise<void> {
    const historia = await this.findOne(id);
    await this.historiaRepository.remove(historia);
  }
}