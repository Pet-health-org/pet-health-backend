import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Consulta } from './entities/consulta.entity';
import { CreateConsultaDto, AlertaConstanteDto } from './dto/consulta.dto';
import { MascotaService } from '../mascota/mascota.service';
import { RazaService } from '../raza/raza.service';
import { EspecieService } from '../especie/especie.service';

@Injectable()
export class ConsultaService {
  constructor(
    @InjectRepository(Consulta)
    private readonly consultaRepository: Repository<Consulta>,
    private readonly mascotaService: MascotaService,
    private readonly razaService: RazaService,
    private readonly especieService: EspecieService,
  ) {}

  async create(createDto: CreateConsultaDto): Promise<Consulta> {
    const mascota = await this.mascotaService.findOne(createDto.mascotaId);

    let alertas: AlertaConstanteDto[] = [];

    if (createDto.constantesVitales) {
      alertas = await this.validarConstantes(
        mascota.razaId,
        createDto.constantesVitales,
      );

      if (alertas.length > 0 && !createDto.justificacion) {
        throw new BadRequestException({
          message:
            'Las constantes vitales están fuera del rango normal. Debe incluir una justificación.',
          alertas,
        });
      }
    }

    const consulta = new Consulta();
    consulta.mascotaId = createDto.mascotaId;
    consulta.motivo = createDto.motivo;
    consulta.anamnesis = createDto.anamnesis || null;
    consulta.constantesVitales = createDto.constantesVitales
      ? JSON.stringify(createDto.constantesVitales)
      : null;
    consulta.diagnostico = createDto.diagnostico;
    consulta.tratamiento = createDto.tratamiento;
    consulta.observaciones = createDto.observaciones || null;
    consulta.justificacion = createDto.justificacion || null;
    consulta.fecha = new Date();

    const saved = await this.consultaRepository.save(consulta);

    if (alertas.length > 0) {
      (saved as any).alertas = alertas;
    }

    return saved;
  }

  private async validarConstantes(
    razaId: string | null,
    constantes: any,
  ): Promise<AlertaConstanteDto[]> {
    try {
      if (!razaId) return [];

      const raza = await this.razaService.findOne(razaId);
      const especieId = raza.especieId;

      const rangosDto = await this.especieService.getConstantes(especieId);
      const rangos = rangosDto as any;
      const alertas: AlertaConstanteDto[] = [];

      if (constantes.temperatura) {
        this.evaluarConstante(
          'temperatura',
          constantes.temperatura.valor,
          rangos.temperatura,
          alertas,
        );
      }

      if (constantes.frecuenciaCardiaca) {
        this.evaluarConstante(
          'frecuenciaCardiaca',
          constantes.frecuenciaCardiaca.valor,
          rangos.frecuenciaCardiaca,
          alertas,
        );
      }

      if (constantes.frecuenciaRespiratoria) {
        this.evaluarConstante(
          'frecuenciaRespiratoria',
          constantes.frecuenciaRespiratoria.valor,
          rangos.frecuenciaRespiratoria,
          alertas,
        );
      }

      return alertas;
    } catch {
      return [];
    }
  }

  private evaluarConstante(
    nombre: string,
    valor: number,
    rango: { minimo: number; maximo: number; unidad: string } | undefined,
    alertas: AlertaConstanteDto[],
  ): void {
    if (!rango) return;

    if (valor < rango.minimo || valor > rango.maximo) {
      alertas.push({
        constante: nombre,
        valorIngresado: valor,
        minimoEsperado: rango.minimo,
        maximoEsperado: rango.maximo,
        unidad: rango.unidad,
      });
    }
  }
}
