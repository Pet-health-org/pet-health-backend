import {
  Injectable,
  BadRequestException,
  ConflictException,
  Inject,
} from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Cita } from '../cita/entities/cita.entity';
import { horarioConfig } from '../../config/configuration';

@Injectable()
export class HorarioService {
  constructor(
    @InjectRepository(Cita)
    private readonly citaRepository: Repository<Cita>,
    @Inject(horarioConfig.KEY)
    private readonly config: ConfigType<typeof horarioConfig>,
  ) {}

  validarHorarioLaboral(fechaHora: Date): void {
    const dia = fechaHora.getDay();
    if (dia === 0) {
      throw new BadRequestException(
        `La clínica no atiende los domingos. El horario laboral es lunes a sábado de ${this.config.horaInicio}:00 AM a ${this.config.horaFin}:00 PM.`,
      );
    }

    const hora = fechaHora.getHours();
    const minutos = fechaHora.getMinutes();
    const totalMinutos = hora * 60 + minutos;

    if (
      totalMinutos < this.config.horaInicio * 60 ||
      totalMinutos + this.config.duracionMinutos > this.config.horaFin * 60
    ) {
      throw new BadRequestException(
        `La cita debe estar dentro del horario laboral (lunes a sábado de ${this.config.horaInicio}:00 AM a ${this.config.horaFin}:00 PM) y considerar ${this.config.duracionMinutos} minutos de duración.`,
      );
    }
  }

  async validarSinConflicto(
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
    const finPropuesto =
      inicioPropuesto + this.config.duracionMinutos * 60 * 1000;

    for (const cita of citasDelDia) {
      const inicioExistente = new Date(cita.fechaHora).getTime();
      const finExistente =
        inicioExistente + this.config.duracionMinutos * 60 * 1000;

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
      const fin = new Date(
        inicio.getTime() + this.config.duracionMinutos * 60 * 1000,
      );
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
    inicioJornada.setHours(this.config.horaInicio, 0, 0, 0);
    const finJornada = new Date(fecha);
    finJornada.setHours(this.config.horaFin, 0, 0, 0);

    let candidato = new Date(inicioJornada);

    while (candidato < finJornada && alternativos.length < limite) {
      const finCandidato = new Date(
        candidato.getTime() + this.config.duracionMinutos * 60 * 1000,
      );

      const disponible = !ocupados.some((bloque) => {
        const inicioBloque = bloque.inicio;
        const finBloque = bloque.fin;
        return candidato < finBloque && finCandidato > inicioBloque;
      });

      if (disponible) {
        alternativos.push(candidato.toISOString());
      }

      candidato = new Date(
        candidato.getTime() + this.config.duracionMinutos * 60 * 1000,
      );
    }

    return alternativos;
  }
}
