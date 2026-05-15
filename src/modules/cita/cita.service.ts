import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Cita } from './entities/cita.entity';
import { CreateCitaDto, UpdateCitaDto } from './dto/cita.dto';
import { MascotaService } from '../mascota/mascota.service';
import { NotificacionService } from '../notificacion/notificacion.service';

const DURACION_MINUTOS = 30;
const HORA_INICIO = 7;
const HORA_FIN = 19;

@Injectable()
export class CitaService {
  constructor(
    @InjectRepository(Cita)
    private readonly citaRepository: Repository<Cita>,
    private readonly mascotaService: MascotaService,
    private readonly notificacionService: NotificacionService,
  ) {}

  async create(createDto: CreateCitaDto): Promise<Cita> {
    const fechaHora = new Date(createDto.fechaHora);
    this.validarHorarioLaboral(fechaHora);

    await this.validarSinConflicto(
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

  async findCitasPorVeterinarioYFecha(
    veterinarioId: string,
    fecha: Date,
  ): Promise<Cita[]> {
    const inicio = new Date(fecha);
    inicio.setHours(0, 0, 0, 0);
    const fin = new Date(fecha);
    fin.setHours(23, 59, 59, 999);

    return await this.citaRepository.find({
      where: {
        veterinarioId,
        fechaHora: Between(inicio, fin),
      },
      relations: ['mascota', 'veterinario'],
      order: { fechaHora: 'ASC' },
    });
  }

  async obtenerBloquesOcupados(
    veterinarioId: string,
    fecha: Date,
  ): Promise<{ inicio: Date; fin: Date }[]> {
    const citas = await this.findCitasPorVeterinarioYFecha(
      veterinarioId,
      fecha,
    );
    return citas.map((c) => {
      const inicio = new Date(c.fechaHora);
      const fin = new Date(inicio.getTime() + DURACION_MINUTOS * 60 * 1000);
      return { inicio, fin };
    });
  }

  async obtenerHorariosAlternativos(
    veterinarioId: string,
    fecha: Date,
    limite = 3,
  ): Promise<string[]> {
    const ocupados = await this.obtenerBloquesOcupados(veterinarioId, fecha);
    const alternativos: string[] = [];

    const inicioJornada = new Date(fecha);
    inicioJornada.setHours(HORA_INICIO, 0, 0, 0);
    const finJornada = new Date(fecha);
    finJornada.setHours(HORA_FIN, 0, 0, 0);

    let candidato = new Date(inicioJornada);

    while (candidato < finJornada && alternativos.length < limite) {
      const finCandidato = new Date(
        candidato.getTime() + DURACION_MINUTOS * 60 * 1000,
      );

      const disponible = !ocupados.some((bloque) => {
        const inicioBloque = bloque.inicio;
        const finBloque = bloque.fin;
        return candidato < finBloque && finCandidato > inicioBloque;
      });

      if (disponible) {
        alternativos.push(candidato.toISOString());
      }

      candidato = new Date(candidato.getTime() + DURACION_MINUTOS * 60 * 1000);
    }

    return alternativos;
  }

  private validarHorarioLaboral(fechaHora: Date): void {
    const dia = fechaHora.getDay();
    if (dia === 0) {
      throw new BadRequestException(
        'La clínica no atiende los domingos. El horario laboral es lunes a sábado de 7:00 AM a 7:00 PM.',
      );
    }

    const hora = fechaHora.getHours();
    const minutos = fechaHora.getMinutes();
    const totalMinutos = hora * 60 + minutos;

    if (
      totalMinutos < HORA_INICIO * 60 ||
      totalMinutos + DURACION_MINUTOS > HORA_FIN * 60
    ) {
      throw new BadRequestException(
        'La cita debe estar dentro del horario laboral (lunes a sábado de 7:00 AM a 7:00 PM) y considerar 30 minutos de duración.',
      );
    }
  }

  private async validarSinConflicto(
    veterinarioId: string,
    fechaHora: Date,
  ): Promise<void> {
    const fecha = new Date(fechaHora);
    fecha.setHours(0, 0, 0, 0);

    const citasDelDia = await this.findCitasPorVeterinarioYFecha(
      veterinarioId,
      fecha,
    );

    const inicioPropuesto = fechaHora.getTime();
    const finPropuesto = inicioPropuesto + DURACION_MINUTOS * 60 * 1000;

    for (const cita of citasDelDia) {
      const inicioExistente = new Date(cita.fechaHora).getTime();
      const finExistente =
        inicioExistente + DURACION_MINUTOS * 60 * 1000;

      if (inicioPropuesto < finExistente && finPropuesto > inicioExistente) {
        const alternativos = await this.obtenerHorariosAlternativos(
          veterinarioId,
          fecha,
        );

        throw new ConflictException({
          message: 'El veterinario ya tiene una cita en este horario',
          conflictoCon: cita,
          horariosAlternativos: alternativos,
        });
      }
    }
  }

  private async enviarNotificacionPropietario(cita: Cita): Promise<void> {
    try {
      const mascota = await this.mascotaService.findOne(cita.mascotaId);

      const propietario = mascota.propietario;

      if (!propietario?.email) return;

      const fechaFormateada = new Date(cita.fechaHora).toLocaleString('es-CO', {
        dateStyle: 'long',
        timeStyle: 'short',
      });

      await this.notificacionService.create({
        usuarioId: propietario.id,
        mensaje: `Recordatorio: Su mascota ${mascota.nombre} tiene una cita el ${fechaFormateada}. Motivo: ${cita.motivo}`,
        emailDestino: propietario.email,
        tipoEnvio: 'email',
        estado: 'pendiente',
      });
    } catch {
      console.warn(
        `No se pudo enviar notificación para la cita ${cita.id}`,
      );
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