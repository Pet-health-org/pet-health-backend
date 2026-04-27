import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notificacion } from './entities/notificacion.entity';
import { CreateNotificacionDto, UpdateNotificacionDto } from './dto/notificacion.dto';

@Injectable()
export class NotificacionService {
  constructor(
    @InjectRepository(Notificacion)
    private readonly notificacionRepository: Repository<Notificacion>,
  ) {}

  async create(createDto: CreateNotificacionDto): Promise<Notificacion> {
    const notificacion = this.notificacionRepository.create(createDto);
    return await this.notificacionRepository.save(notificacion);
  }

  async findAll(): Promise<Notificacion[]> {
    return await this.notificacionRepository.find({
      relations: ['usuario'],
      order: { fechaCreacion: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Notificacion> {
    const notificacion = await this.notificacionRepository.findOne({
      where: { id },
      relations: ['usuario'],
    });
    if (!notificacion) {
      throw new NotFoundException(`Notificacion con ID ${id} no encontrada`);
    }
    return notificacion;
  }

  async findByUsuario(usuarioId: string): Promise<Notificacion[]> {
    return await this.notificacionRepository.find({
      where: { usuarioId },
      order: { fechaCreacion: 'DESC' },
    });
  }

  async findByEstado(estado: string): Promise<Notificacion[]> {
    return await this.notificacionRepository.find({
      where: { estado },
      order: { fechaCreacion: 'DESC' },
    });
  }

  async update(id: string, updateDto: UpdateNotificacionDto): Promise<Notificacion> {
    const notificacion = await this.findOne(id);
    Object.assign(notificacion, updateDto);
    return await this.notificacionRepository.save(notificacion);
  }

  async remove(id: string): Promise<void> {
    const notificacion = await this.findOne(id);
    await this.notificacionRepository.remove(notificacion);
  }
}