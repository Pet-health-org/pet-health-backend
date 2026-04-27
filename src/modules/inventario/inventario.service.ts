import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Inventario } from './entities/inventario.entity';
import { CreateInventarioDto, UpdateInventarioDto } from './dto/inventario.dto';

@Injectable()
export class InventarioService {
  constructor(
    @InjectRepository(Inventario)
    private readonly inventarioRepository: Repository<Inventario>,
  ) {}

  async create(createDto: CreateInventarioDto): Promise<Inventario> {
    const inventario = this.inventarioRepository.create(createDto);
    return await this.inventarioRepository.save(inventario);
  }

  async findAll(): Promise<Inventario[]> {
    return await this.inventarioRepository.find({
      relations: ['proveedor'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Inventario> {
    const inventario = await this.inventarioRepository.findOne({
      where: { id },
      relations: ['proveedor'],
    });
    if (!inventario) {
      throw new NotFoundException(`Inventario con ID ${id} no encontrado`);
    }
    return inventario;
  }

  async findByProveedor(proveedorId: string): Promise<Inventario[]> {
    return await this.inventarioRepository.find({
      where: { proveedorId },
      relations: ['proveedor'],
    });
  }

  async findByTipo(tipo: string): Promise<Inventario[]> {
    return await this.inventarioRepository.find({
      where: { tipo },
      relations: ['proveedor'],
    });
  }

  async findBajoStock(): Promise<Inventario[]> {
    return await this.inventarioRepository
      .createQueryBuilder('inventario')
      .where('inventario.stockActual <= inventario.stockMinimo')
      .getMany();
  }

  async update(id: string, updateDto: UpdateInventarioDto): Promise<Inventario> {
    const inventario = await this.findOne(id);
    Object.assign(inventario, updateDto);
    return await this.inventarioRepository.save(inventario);
  }

  async remove(id: string): Promise<void> {
    const inventario = await this.findOne(id);
    await this.inventarioRepository.remove(inventario);
  }

  async updateStock(id: string, stockActual: number): Promise<Inventario> {
    const inventario = await this.findOne(id);
    inventario.stockActual = stockActual;
    return await this.inventarioRepository.save(inventario);
  }
}