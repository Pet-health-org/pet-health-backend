import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Proveedor } from './entities/proveedor.entity';
import { CreateProveedorDto, UpdateProveedorDto } from './dto/proveedor.dto';

@Injectable()
export class ProveedorService {
  constructor(
    @InjectRepository(Proveedor)
    private readonly proveedorRepository: Repository<Proveedor>,
  ) {}

  async create(createDto: CreateProveedorDto): Promise<Proveedor> {
    const proveedor = this.proveedorRepository.create(createDto);
    return await this.proveedorRepository.save(proveedor);
  }

  async findAll(): Promise<Proveedor[]> {
    return await this.proveedorRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Proveedor> {
    const proveedor = await this.proveedorRepository.findOne({ where: { id } });
    if (!proveedor) {
      throw new NotFoundException(`Proveedor con ID ${id} no encontrado`);
    }
    return proveedor;
  }

  async update(id: string, updateDto: UpdateProveedorDto): Promise<Proveedor> {
    const proveedor = await this.findOne(id);
    Object.assign(proveedor, updateDto);
    return await this.proveedorRepository.save(proveedor);
  }

  async remove(id: string): Promise<void> {
    const proveedor = await this.findOne(id);
    await this.proveedorRepository.remove(proveedor);
  }
}