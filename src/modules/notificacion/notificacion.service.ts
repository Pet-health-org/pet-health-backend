import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notificacion } from './entities/notificacion.entity';
import { NotificacionCita } from './entities/notificacion-cita.entity';
import { NotificacionInventario } from './entities/notificacion-inventario.entity';
import {
  CreateNotificacionDto,
  UpdateNotificacionDto,
  CreateNotificacionCitaDto,
  UpdateNotificacionCitaDto,
  CreateNotificacionInventarioDto,
  UpdateNotificacionInventarioDto,
} from './dto/notificacion.dto';

@Injectable()
export class NotificacionService {
  constructor(
    @InjectRepository(Notificacion)
    private readonly notificacionRepository: Repository<Notificacion>,
    @InjectRepository(NotificacionCita)
    private readonly notificacionCitaRepository: Repository<NotificacionCita>,
    @InjectRepository(NotificacionInventario)
    private readonly notificacionInventarioRepository: Repository<NotificacionInventario>,
  ) {}

  async createNotificacion(
    createDto: CreateNotificacionDto,
  ): Promise<Notificacion> {
    const notificacion = this.notificacionRepository.create(createDto);
    return await this.notificacionRepository.save(notificacion);
  }

  async findAllNotificaciones(): Promise<Notificacion[]> {
    return await this.notificacionRepository.find({
      relations: ['usuario'],
      order: { fechaCreacion: 'DESC' },
    });
  }

  async findOneNotificacion(id: string): Promise<Notificacion> {
    const notificacion = await this.notificacionRepository.findOne({
      where: { id },
      relations: ['usuario'],
    });
    if (!notificacion) {
      throw new NotFoundException(`Notificacion con ID ${id} no encontrada`);
    }
    return notificacion;
  }

  async findNotificacionesByUsuario(
    usuarioId: string,
  ): Promise<Notificacion[]> {
    return await this.notificacionRepository.find({
      where: { usuarioId },
      order: { fechaCreacion: 'DESC' },
    });
  }

  async findNotificacionesByEstado(estado: string): Promise<Notificacion[]> {
    return await this.notificacionRepository.find({
      where: { estado },
      order: { fechaCreacion: 'DESC' },
    });
  }

  async updateNotificacion(
    id: string,
    updateDto: UpdateNotificacionDto,
  ): Promise<Notificacion> {
    const notificacion = await this.findOneNotificacion(id);
    Object.assign(notificacion, updateDto);
    return await this.notificacionRepository.save(notificacion);
  }

  async removeNotificacion(id: string): Promise<void> {
    const notificacion = await this.findOneNotificacion(id);
    await this.notificacionRepository.remove(notificacion);
  }

  async createNotificacionCita(
    createDto: CreateNotificacionCitaDto,
  ): Promise<NotificacionCita> {
    const notificacion = this.notificacionCitaRepository.create(createDto);
    return await this.notificacionCitaRepository.save(notificacion);
  }

  async findAllNotificacionesCita(): Promise<NotificacionCita[]> {
    return await this.notificacionCitaRepository.find({
      relations: ['cita'],
      order: { fechaRecordatorio: 'ASC' },
    });
  }

  async findOneNotificacionCita(id: string): Promise<NotificacionCita> {
    const notificacion = await this.notificacionCitaRepository.findOne({
      where: { id },
      relations: ['cita'],
    });
    if (!notificacion) {
      throw new NotFoundException(
        `Notificacion cita con ID ${id} no encontrada`,
      );
    }
    return notificacion;
  }

  async updateNotificacionCita(
    id: string,
    updateDto: UpdateNotificacionCitaDto,
  ): Promise<NotificacionCita> {
    const notificacion = await this.findOneNotificacionCita(id);
    Object.assign(notificacion, updateDto);
    return await this.notificacionCitaRepository.save(notificacion);
  }

  async removeNotificacionCita(id: string): Promise<void> {
    const notificacion = await this.findOneNotificacionCita(id);
    await this.notificacionCitaRepository.remove(notificacion);
  }

  async createNotificacionInventario(
    createDto: CreateNotificacionInventarioDto,
  ): Promise<NotificacionInventario> {
    const notificacion =
      this.notificacionInventarioRepository.create(createDto);
    return await this.notificacionInventarioRepository.save(notificacion);
  }

  async findAllNotificacionesInventario(): Promise<NotificacionInventario[]> {
    return await this.notificacionInventarioRepository.find({
      relations: ['inventario'],
      order: { id: 'DESC' },
    });
  }

  async findOneNotificacionInventario(
    id: string,
  ): Promise<NotificacionInventario> {
    const notificacion = await this.notificacionInventarioRepository.findOne({
      where: { id },
      relations: ['inventario', 'notificacion'],
    });
    if (!notificacion) {
      throw new NotFoundException(
        `Notificacion inventario con ID ${id} no encontrada`,
      );
    }
    return notificacion;
  }

  async updateNotificacionInventario(
    id: string,
    updateDto: UpdateNotificacionInventarioDto,
  ): Promise<NotificacionInventario> {
    const notificacion = await this.findOneNotificacionInventario(id);
    Object.assign(notificacion, updateDto);
    return await this.notificacionInventarioRepository.save(notificacion);
  }

  async removeNotificacionInventario(id: string): Promise<void> {
    const notificacion = await this.findOneNotificacionInventario(id);
    await this.notificacionInventarioRepository.remove(notificacion);
  }
}
