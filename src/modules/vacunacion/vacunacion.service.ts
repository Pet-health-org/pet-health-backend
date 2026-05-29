import {
  Injectable,
  Logger,
  NotFoundException,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';
import {
  EsquemaVacunacion,
  TipoVacunaEsquema,
} from './entities/esquema-vacunacion.entity';
import { AlertaVacuna } from './entities/alerta-vacuna.entity';
import { CreateEsquemaVacunacionDto } from './dto/esquema-vacunacion.dto';
import { Vacuna } from '../vacuna/entities/vacuna.entity';
import { NotificacionService } from '../notificacion/notificacion.service';

export interface EsquemaVacunacionResponse {
  especie: string;
  vacunasObligatorias: EsquemaVacunacion[];
  vacunasOpcionales: EsquemaVacunacion[];
}

@Injectable()
export class VacunacionService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(VacunacionService.name);
  private dailyTimeout?: NodeJS.Timeout;

  constructor(
    @InjectRepository(EsquemaVacunacion)
    private readonly esquemaRepository: Repository<EsquemaVacunacion>,
    @InjectRepository(AlertaVacuna)
    private readonly alertaRepository: Repository<AlertaVacuna>,
    @InjectRepository(Vacuna)
    private readonly vacunaRepository: Repository<Vacuna>,
    private readonly notificacionService: NotificacionService,
  ) {}

  onModuleInit(): void {
    this.scheduleNextDailyReview();
  }

  onModuleDestroy(): void {
    if (this.dailyTimeout) {
      clearTimeout(this.dailyTimeout);
    }
  }

  async createEsquema(
    createDto: CreateEsquemaVacunacionDto,
  ): Promise<EsquemaVacunacionResponse> {
    const especie = createDto.especie.trim().toLowerCase();
    const esquemas = createDto.vacunas.map((vacuna) =>
      this.esquemaRepository.create({
        especie,
        nombreVacuna: vacuna.nombreVacuna,
        tipo: vacuna.tipo,
        edadMinimaMeses: vacuna.edadMinimaMeses,
        edadMaximaMeses: vacuna.edadMaximaMeses ?? null,
        intervaloRefuerzoDias: vacuna.intervaloRefuerzoDias,
        descripcion: vacuna.descripcion ?? null,
      }),
    );

    const saved = await this.esquemaRepository.save(esquemas);
    return this.groupByTipo(especie, saved);
  }

  async findEsquema(
    especie: string,
    edadMeses?: number,
    edadMinimaMeses?: number,
    edadMaximaMeses?: number,
  ): Promise<EsquemaVacunacionResponse> {
    const normalizedEspecie = especie.trim().toLowerCase();
    const query = this.esquemaRepository
      .createQueryBuilder('esquema')
      .where('esquema.especie = :especie', { especie: normalizedEspecie })
      .andWhere('esquema.estaActivo = :estaActivo', { estaActivo: true })
      .orderBy('esquema.edadMinimaMeses', 'ASC')
      .addOrderBy('esquema.nombreVacuna', 'ASC');

    if (edadMeses !== undefined) {
      query
        .andWhere('esquema.edadMinimaMeses <= :edadMeses', { edadMeses })
        .andWhere(
          '(esquema.edadMaximaMeses IS NULL OR esquema.edadMaximaMeses >= :edadMeses)',
          { edadMeses },
        );
    }

    if (edadMinimaMeses !== undefined) {
      query.andWhere(
        '(esquema.edadMaximaMeses IS NULL OR esquema.edadMaximaMeses >= :edadMinimaMeses)',
        { edadMinimaMeses },
      );
    }

    if (edadMaximaMeses !== undefined) {
      query.andWhere('esquema.edadMinimaMeses <= :edadMaximaMeses', {
        edadMaximaMeses,
      });
    }

    const esquemas = await query.getMany();
    if (esquemas.length === 0) {
      throw new NotFoundException(
        `No existe esquema de vacunacion para la especie ${normalizedEspecie}`,
      );
    }

    return this.groupByTipo(normalizedEspecie, esquemas);
  }

  async calcularProximoRefuerzo(
    especie: string,
    nombreVacuna: string,
    fechaAplicacion: Date,
    edadMeses?: number,
  ): Promise<Date | null> {
    const normalizedEspecie = especie.trim().toLowerCase();
    const query = this.esquemaRepository
      .createQueryBuilder('esquema')
      .where('esquema.especie = :especie', { especie: normalizedEspecie })
      .andWhere('LOWER(esquema.nombreVacuna) = :nombreVacuna', {
        nombreVacuna: nombreVacuna.trim().toLowerCase(),
      })
      .andWhere('esquema.estaActivo = :estaActivo', { estaActivo: true })
      .orderBy('esquema.edadMinimaMeses', 'DESC');

    if (edadMeses !== undefined) {
      query
        .andWhere('esquema.edadMinimaMeses <= :edadMeses', { edadMeses })
        .andWhere(
          '(esquema.edadMaximaMeses IS NULL OR esquema.edadMaximaMeses >= :edadMeses)',
          { edadMeses },
        );
    }

    const esquema = await query.getOne();
    if (!esquema) {
      return null;
    }

    const proximoRefuerzo = new Date(fechaAplicacion);
    proximoRefuerzo.setDate(
      proximoRefuerzo.getDate() + esquema.intervaloRefuerzoDias,
    );
    return proximoRefuerzo;
  }

  async revisarAlertasVacunasPendientes(): Promise<void> {
    const hoy = this.startOfDay(new Date());
    const limite = this.endOfDay(this.addDays(hoy, 15));

    const vacunas = await this.vacunaRepository.find({
      where: {
        fechaProximoRefuerzo: Between(hoy, limite),
      },
      relations: [
        'historiaClinica',
        'historiaClinica.mascota',
        'historiaClinica.mascota.propietario',
      ],
      order: { fechaProximoRefuerzo: 'ASC' },
    });

    for (const vacuna of vacunas) {
      await this.generarAlertaVacuna(vacuna);
    }
  }

  private async generarAlertaVacuna(vacuna: Vacuna): Promise<void> {
    const existing = await this.alertaRepository.findOne({
      where: { vacunaId: vacuna.id },
    });
    if (existing) {
      return;
    }

    const mascota = vacuna.historiaClinica?.mascota;
    const propietario = mascota?.propietario;
    if (!mascota || !propietario || !vacuna.fechaProximoRefuerzo) {
      this.logger.warn(
        `No se genero alerta para vacuna ${vacuna.id}: datos de mascota o propietario incompletos`,
      );
      return;
    }

    const alerta = this.alertaRepository.create({
      vacunaId: vacuna.id,
      mascotaId: mascota.id,
      propietarioId: propietario.id,
      fechaProximoRefuerzo: vacuna.fechaProximoRefuerzo,
      estado: 'generada',
      notificacionEnviada: false,
      errorNotificacion: null,
    });
    const saved = await this.alertaRepository.save(alerta);
    this.logger.log(`Alerta de vacuna generada: ${saved.id}`);

    try {
      const notificacion = await this.notificacionService.enviarCorreo({
        usuarioId: propietario.id,
        emailDestino: propietario.email,
        tipoPlantilla: 'alerta_vacuna',
        datos: {
          nombrePropietario: propietario.nombreCompleto || propietario.email,
          nombreMascota: mascota.nombre,
          fecha: vacuna.fechaProximoRefuerzo.toISOString().slice(0, 10),
          hora: '',
          motivo: `Refuerzo de ${vacuna.nombre}`,
        },
      });

      saved.notificacionId = notificacion.id;
      saved.notificacionEnviada = true;
      saved.estado = 'notificada';
      await this.alertaRepository.save(saved);
      this.logger.log(`Notificacion de vacuna enviada: ${notificacion.id}`);
    } catch (error) {
      saved.estado = 'error_notificacion';
      saved.errorNotificacion =
        error instanceof Error ? error.message : 'Error desconocido';
      await this.alertaRepository.save(saved);
      this.logger.error(
        `Error enviando notificacion de vacuna ${vacuna.id}: ${saved.errorNotificacion}`,
      );
    }
  }

  private scheduleNextDailyReview(): void {
    const now = new Date();
    const nextRun = new Date(now);
    nextRun.setHours(7, 0, 0, 0);
    if (nextRun <= now) {
      nextRun.setDate(nextRun.getDate() + 1);
    }

    const delayMs = nextRun.getTime() - now.getTime();
    this.dailyTimeout = setTimeout(() => {
      void this.revisarAlertasVacunasPendientes().finally(() =>
        this.scheduleNextDailyReview(),
      );
    }, delayMs);
    this.logger.log(
      `Revision diaria de vacunas programada para ${nextRun.toISOString()}`,
    );
  }

  private groupByTipo(
    especie: string,
    esquemas: EsquemaVacunacion[],
  ): EsquemaVacunacionResponse {
    return {
      especie,
      vacunasObligatorias: esquemas.filter(
        (esquema) => esquema.tipo === TipoVacunaEsquema.OBLIGATORIA,
      ),
      vacunasOpcionales: esquemas.filter(
        (esquema) => esquema.tipo === TipoVacunaEsquema.OPCIONAL,
      ),
    };
  }

  private startOfDay(date: Date): Date {
    const copy = new Date(date);
    copy.setHours(0, 0, 0, 0);
    return copy;
  }

  private endOfDay(date: Date): Date {
    const copy = new Date(date);
    copy.setHours(23, 59, 59, 999);
    return copy;
  }

  private addDays(date: Date, days: number): Date {
    const copy = new Date(date);
    copy.setDate(copy.getDate() + days);
    return copy;
  }
}
