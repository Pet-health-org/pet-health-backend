import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cita } from './entities/cita.entity';
import { CreateCitaDto, UpdateCitaDto } from './dto/cita.dto';
import { MascotaService } from '../mascota/mascota.service';
import { NotificacionService } from '../notificacion/notificacion.service';
import { HorarioService } from '../horario/horario.service';

@Injectable()
export class CitaService {
  constructor(
    @InjectRepository(Cita)
    private readonly citaRepository: Repository<Cita>,
    private readonly mascotaService: MascotaService,
    private readonly notificacionService: NotificacionService,
    private readonly horarioService: HorarioService,
  ) {}

  async create(createDto: CreateCitaDto): Promise<Cita> {
    const fechaHora = new Date(createDto.fechaHora);
    this.horarioService.validarHorarioLaboral(fechaHora);

    await this.horarioService.validarSinConflicto(
      createDto.veterinarioId,
      fechaHora,
    );

    const cita = this.citaRepository.create({
      ...createDto,
      fechaHora,
    });
    const saved = await this.citaRepository.save(cita);

    await this.enviarNotificacionPropietario(saved);

    return saved;
  }

  private async enviarNotificacionPropietario(cita: Cita): Promise<void> {
    try {
      const mascota = await this.mascotaService.findOne(cita.mascotaId);

      const propietario = mascota.propietario;

      if (!propietario?.user?.email) return;

      const fecha = new Date(cita.fechaHora).toLocaleDateString('es-CO', {
        dateStyle: 'long',
      });
      const hora = new Date(cita.fechaHora).toLocaleTimeString('es-CO', {
        timeStyle: 'short',
      });

      await this.notificacionService.enviarCorreo({
        usuarioId: propietario.user.id,
        emailDestino: propietario.user.email,
        tipoPlantilla: 'confirmacion_cita',
        datos: {
          nombrePropietario: propietario.user.nombreCompleto || '',
          nombreMascota: mascota.nombre,
          fecha,
          hora,
          motivo: cita.motivo,
        },
      });
    } catch {
      console.warn(`No se pudo enviar notificación para la cita ${cita.id}`);
    }
  }

  async findAll(): Promise<Cita[]> {
    return await this.citaRepository.find({
      relations: ['mascota', 'veterinario'],
      order: { fechaHora: 'ASC' },
    });
  }

  async findOne(id: string): Promise<Cita> {
    const cita = await this.citaRepository.findOne({
      where: { id },
      relations: ['mascota', 'veterinario'],
    });
    if (!cita) {
      throw new NotFoundException(`Cita con ID ${id} no encontrada`);
    }
    return cita;
  }

  async findByMascota(mascotaId: string): Promise<Cita[]> {
    return await this.citaRepository.find({
      where: { mascotaId },
      relations: ['mascota', 'veterinario'],
      order: { fechaHora: 'DESC' },
    });
  }

  async findByVeterinario(veterinarioId: string): Promise<Cita[]> {
    return await this.citaRepository.find({
      where: { veterinarioId },
      relations: ['mascota', 'veterinario'],
      order: { fechaHora: 'ASC' },
    });
  }

  async update(id: string, updateDto: UpdateCitaDto): Promise<Cita> {
    const cita = await this.findOne(id);
    Object.assign(cita, updateDto);
    return await this.citaRepository.save(cita);
  }

  async remove(id: string): Promise<void> {
    const cita = await this.findOne(id);
    await this.citaRepository.remove(cita);
  }
}
