import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Reporte } from './entities/reporte.entity';
import { CreateReporteDto, UpdateReporteDto } from './dto/reporte.dto';

@Injectable()
export class ReporteService {
  constructor(
    @InjectRepository(Reporte)
    private readonly reporteRepository: Repository<Reporte>,
  ) {}

  async create(createDto: CreateReporteDto): Promise<Reporte> {
    const reporte = this.reporteRepository.create(createDto);
    return await this.reporteRepository.save(reporte);
  }

  async findAll(): Promise<Reporte[]> {
    return await this.reporteRepository.find({
      relations: ['admin'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Reporte> {
    const reporte = await this.reporteRepository.findOne({
      where: { id },
      relations: ['admin'],
    });
    if (!reporte) {
      throw new NotFoundException(`Reporte con ID ${id} no encontrado`);
    }
    return reporte;
  }

  async findByTipo(tipoReporte: string): Promise<Reporte[]> {
    return await this.reporteRepository.find({
      where: { tipoReporte },
      relations: ['admin'],
      order: { createdAt: 'DESC' },
    });
  }

  async findByAdmin(adminId: string): Promise<Reporte[]> {
    return await this.reporteRepository.find({
      where: { adminId },
      relations: ['admin'],
      order: { createdAt: 'DESC' },
    });
  }

  async update(id: string, updateDto: UpdateReporteDto): Promise<Reporte> {
    const reporte = await this.findOne(id);
    Object.assign(reporte, updateDto);
    return await this.reporteRepository.save(reporte);
  }

  async remove(id: string): Promise<void> {
    const reporte = await this.findOne(id);
    await this.reporteRepository.remove(reporte);
  }
}
