import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Especie } from './entities/especie.entity';
import { CreateEspecieDto, UpdateEspecieDto } from './dto/especie.dto';

@Injectable()
export class EspecieService {
  constructor(
    @InjectRepository(Especie)
    private readonly especieRepository: Repository<Especie>,
  ) {}

  async create(createDto: CreateEspecieDto): Promise<Especie> {
    const existing = await this.especieRepository.findOne({
      where: { nombre: createDto.nombre },
    });
    if (existing) {
      throw new ConflictException('La especie ya existe');
    }
    const especie = this.especieRepository.create(createDto);
    return await this.especieRepository.save(especie);
  }

  async findAll(): Promise<Especie[]> {
    return await this.especieRepository.find({
      order: { nombre: 'ASC' },
    });
  }

  async findOne(id: string): Promise<Especie> {
    const especie = await this.especieRepository.findOne({ where: { id } });
    if (!especie) {
      throw new NotFoundException(`Especie con ID ${id} no encontrada`);
    }
    return especie;
  }

  async update(id: string, updateDto: UpdateEspecieDto): Promise<Especie> {
    const especie = await this.findOne(id);
    if (updateDto.nombre && updateDto.nombre !== especie.nombre) {
      const existing = await this.especieRepository.findOne({
        where: { nombre: updateDto.nombre },
      });
      if (existing) {
        throw new ConflictException('El nombre de especie ya está en uso');
      }
    }
    Object.assign(especie, updateDto);
    return await this.especieRepository.save(especie);
  }

  async remove(id: string): Promise<void> {
    const especie = await this.findOne(id);
    await this.especieRepository.remove(especie);
  }
}