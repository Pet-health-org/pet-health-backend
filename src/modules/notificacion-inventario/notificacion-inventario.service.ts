import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotificacionInventario } from './entities/notificacion-inventario.entity';
import {
  CreateNotificacionInventarioDto,
  UpdateNotificacionInventarioDto,
} from '../notificacion/dto/notificacion.dto';

@Injectable()
export class NotificacionInventarioService {
  constructor(
    @InjectRepository(NotificacionInventario)
    private readonly repo: Repository<NotificacionInventario>,
  ) {}

  async create(createDto: CreateNotificacionInventarioDto): Promise<NotificacionInventario> {
    const entity = this.repo.create(createDto);
    return await this.repo.save(entity);
  }

  async findAll(): Promise<NotificacionInventario[]> {
    return await this.repo.find({
      relations: ['inventario', 'notificacion'],
      order: { id: 'DESC' },
    });
  }

  async findOne(id: string): Promise<NotificacionInventario> {
    const entity = await this.repo.findOne({
      where: { id },
      relations: ['inventario', 'notificacion'],
    });
    if (!entity) {
      throw new NotFoundException(`Notificacion inventario con ID ${id} no encontrada`);
    }
    return entity;
  }

  async update(
    id: string,
    updateDto: UpdateNotificacionInventarioDto,
  ): Promise<NotificacionInventario> {
    const entity = await this.findOne(id);
    Object.assign(entity, updateDto);
    return await this.repo.save(entity);
  }

  async remove(id: string): Promise<void> {
    const entity = await this.findOne(id);
    await this.repo.remove(entity);
  }
}