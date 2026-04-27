import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Medicamento } from './entities/medicamento.entity';
import { CreateMedicamentoDto, UpdateMedicamentoDto } from './dto/medicamento.dto';

@Injectable()
export class MedicamentoService {
  constructor(
    @InjectRepository(Medicamento)
    private readonly medicamentoRepository: Repository<Medicamento>,
  ) {}

  async create(createDto: CreateMedicamentoDto): Promise<Medicamento> {
    const medicamento = this.medicamentoRepository.create(createDto);
    return await this.medicamentoRepository.save(medicamento);
  }

  async findAll(): Promise<Medicamento[]> {
    return await this.medicamentoRepository.find({
      relations: ['historiaClinica', 'inventario'],
      order: { id: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Medicamento> {
    const medicamento = await this.medicamentoRepository.findOne({
      where: { id },
      relations: ['historiaClinica', 'inventario'],
    });
    if (!medicamento) {
      throw new NotFoundException(`Medicamento con ID ${id} no encontrado`);
    }
    return medicamento;
  }

  async findByHistoriaClinica(historiaClinicaId: string): Promise<Medicamento[]> {
    return await this.medicamentoRepository.find({
      where: { historiaClinicaId },
      relations: ['historiaClinica', 'inventario'],
    });
  }

  async update(
    id: string,
    updateDto: UpdateMedicamentoDto,
  ): Promise<Medicamento> {
    const medicamento = await this.findOne(id);
    Object.assign(medicamento, updateDto);
    return await this.medicamentoRepository.save(medicamento);
  }

  async remove(id: string): Promise<void> {
    const medicamento = await this.findOne(id);
    await this.medicamentoRepository.remove(medicamento);
  }
}