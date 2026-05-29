import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notificacion } from './entities/notificacion.entity';
import { User } from '../user/entities/user.entity';
import {
  EmailService,
  TipoPlantilla,
  DatosPlantilla,
} from '../email/email.service';
import {
  CreateNotificacionDto,
  UpdateNotificacionDto,
  CreateNotificacionPropietarioDto,
} from './dto/notificacion.dto';
import { QueryNotificacionDto } from './dto/query-notificacion.dto';

@Injectable()
export class NotificacionService {
  constructor(
    @InjectRepository(Notificacion)
    private readonly notificacionRepository: Repository<Notificacion>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly emailService: EmailService,
  ) {}

  async create(createDto: CreateNotificacionDto): Promise<Notificacion> {
    const notificacion = this.notificacionRepository.create(createDto);
    return await this.notificacionRepository.save(notificacion);
  }

  async notificarPropietario(
    dto: CreateNotificacionPropietarioDto,
  ): Promise<Notificacion> {
    const propietario = await this.userRepository.findOne({
      where: { id: dto.propietarioId },
      relations: ['rol'],
    });

    if (!propietario) {
      throw new NotFoundException(
        `Propietario con ID ${dto.propietarioId} no encontrado`,
      );
    }

    return this.enviarCorreo({
      usuarioId: propietario.id,
      emailDestino: propietario.email,
      tipoPlantilla:
        (dto.tipoPlantilla as TipoPlantilla) || 'recordatorio_cita',
      datos: {
        nombrePropietario: propietario.nombreCompleto || propietario.email,
        nombreMascota: '',
        fecha: '',
        hora: '',
        motivo: dto.mensaje,
      },
    });
  }

  async enviarCorreo(params: {
    usuarioId: string;
    emailDestino: string;
    tipoPlantilla: TipoPlantilla;
    datos: DatosPlantilla;
  }): Promise<Notificacion> {
    const notificacion = this.notificacionRepository.create({
      usuarioId: params.usuarioId,
      mensaje: `${params.tipoPlantilla} para ${params.datos.nombreMascota}`,
      emailDestino: params.emailDestino,
      tipoEnvio: 'email',
      tipoPlantilla: params.tipoPlantilla,
      fechaEnvio: new Date(),
      estado: 'pendiente',
      errorMsg: null,
    });

    try {
      await this.emailService.enviarCorreo(
        params.emailDestino,
        params.tipoPlantilla,
        params.datos,
      );
      notificacion.estado = 'enviado';
      notificacion.fechaEnvio = new Date();
    } catch (error: any) {
      notificacion.estado = 'fallido';
      notificacion.errorMsg = error.message;
    }

    return await this.notificacionRepository.save(notificacion);
  }

  async findAll(query: QueryNotificacionDto) {
    const page = query.page ?? 1;
    const limit = Math.min(query.limit ?? 50, 50);
    const skip = (page - 1) * limit;

    const where: any = {};

    if (query.propietarioId) {
      const propietario = await this.userRepository.findOne({
        where: { id: query.propietarioId },
      });
      if (propietario) {
        where.usuarioId = propietario.id;
      }
    }
    if (query.tipo) {
      where.tipoPlantilla = query.tipo;
    }
    if (query.estado) {
      where.estado = query.estado;
    }

    const [data, total] = await this.notificacionRepository.findAndCount({
      where,
      relations: ['usuario'],
      order: { fechaCreacion: 'DESC' },
      skip,
      take: limit,
    });

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
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

  async reenviar(id: string): Promise<Notificacion> {
    const notificacion = await this.findOne(id);

    if (notificacion.estado !== 'fallido') {
      throw new BadRequestException(
        'Solo se pueden reenviar notificaciones con estado fallido',
      );
    }

    try {
      const tipoPlantilla = (notificacion.tipoPlantilla ||
        'confirmacion_cita') as TipoPlantilla;
      const datos: DatosPlantilla = {
        nombrePropietario: notificacion.usuario?.nombreCompleto || '',
        nombreMascota: '',
        fecha: '',
        hora: '',
        motivo: '',
      };
      await this.emailService.enviarCorreo(
        notificacion.emailDestino,
        tipoPlantilla,
        datos,
      );
      notificacion.estado = 'enviado';
      notificacion.errorMsg = null;
    } catch (error: any) {
      notificacion.estado = 'fallido';
      notificacion.errorMsg = error.message;
    }

    notificacion.fechaEnvio = new Date();
    return await this.notificacionRepository.save(notificacion);
  }

  async update(
    id: string,
    updateDto: UpdateNotificacionDto,
  ): Promise<Notificacion> {
    const notificacion = await this.findOne(id);
    Object.assign(notificacion, updateDto);
    return await this.notificacionRepository.save(notificacion);
  }

  async remove(id: string): Promise<void> {
    const notificacion = await this.findOne(id);
    await this.notificacionRepository.remove(notificacion);
  }
}
