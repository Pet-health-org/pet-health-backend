import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Raza } from './entities/raza.entity';
import { CreateRazaDto, UpdateRazaDto } from './dto/raza.dto';

@Injectable()
export class RazaService {
  constructor(
    @InjectRepository(Raza)
    private readonly razaRepository: Repository<Raza>,
  ) {}

  async create(createDto: CreateRazaDto): Promise<Raza> {
    const raza = this.razaRepository.create(createDto);
    return await this.razaRepository.save(raza);
  }

  async findAll(): Promise<Raza[]> {
    return await this.razaRepository.find({
      relations: ['especie'],
      order: { nombre: 'ASC' },
    });
  }

  async findOne(id: string): Promise<Raza> {
    const raza = await this.razaRepository.findOne({
      where: { id },
      relations: ['especie'],
    });
    if (!raza) {
      throw new NotFoundException(`Raza con ID ${id} no encontrada`);
    }
    return raza;
  }

  async findByEspecie(especieId: string): Promise<Raza[]> {
    return await this.razaRepository.find({
      where: { especieId },
      relations: ['especie'],
      order: { nombre: 'ASC' },
    });
  }

  async update(id: string, updateDto: UpdateRazaDto): Promise<Raza> {
    const raza = await this.findOne(id);
    Object.assign(raza, updateDto);
    return await this.razaRepository.save(raza);
  }

  async remove(id: string): Promise<void> {
    const raza = await this.findOne(id);
    await this.razaRepository.remove(raza);
  }
}