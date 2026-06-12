import {
  Injectable,
  BadRequestException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, EntityManager, Repository } from 'typeorm';
import { Consulta } from './entities/consulta.entity';
import {
  CreateConsultaDto,
  AlertaConstanteDto,
  ConstantesVitalesIngresoDto,
  InsumoConsultaDto,
} from './dto/consulta.dto';
import { MascotaService } from '../mascota/mascota.service';
import { RazaService } from '../raza/raza.service';
import { EspecieService } from '../especie/especie.service';
import { Inventario } from '../inventario/entities/inventario.entity';
import {
  MovimientoInventario,
  TipoMovimientoInventario,
} from '../inventario/entities/movimiento-inventario.entity';
import { Notificacion } from '../notificacion/entities/notificacion.entity';
import { NotificacionInventario } from '../notificacion-inventario/entities/notificacion-inventario.entity';
import { User } from '../user/entities/user.entity';
import { RoleType } from '../rol/entities/rol.entity';
import { ConstantesVitalesDto } from '../especie/dto/constantes-vitales.dto';

@Injectable()
export class ConsultaService {
  constructor(
    @InjectRepository(Consulta)
    private readonly consultaRepository: Repository<Consulta>,
    private readonly mascotaService: MascotaService,
    private readonly razaService: RazaService,
    private readonly especieService: EspecieService,
    private readonly dataSource: DataSource,
  ) {}

  async create(createDto: CreateConsultaDto): Promise<Consulta> {
    const mascota = await this.mascotaService.findOne(createDto.mascotaId);

    let alertas: AlertaConstanteDto[] = [];

    if (createDto.constantesVitales) {
      alertas = await this.validarConstantes(
        mascota.razaId,
        createDto.constantesVitales,
      );

      if (alertas.length > 0 && !this.hasVitalJustification(createDto)) {
        throw new BadRequestException({
          message:
            'Las constantes vitales están fuera del rango normal. Debe incluir una justificación.',
          alertas,
        });
      }
    }

    const insumos = createDto.insumosUtilizados ?? [];
    const saved =
      insumos.length > 0
        ? await this.createWithInventoryTransaction(createDto, insumos)
        : await this.consultaRepository.save(this.buildConsulta(createDto));

    if (alertas.length > 0) {
      (saved as Consulta & { alertas?: AlertaConstanteDto[] }).alertas =
        alertas;
    }

    return saved;
  }

  private async createWithInventoryTransaction(
    createDto: CreateConsultaDto,
    insumos: InsumoConsultaDto[],
  ): Promise<Consulta> {
    return await this.dataSource.transaction(async (manager) => {
      const inventarios = await this.lockAndValidateStock(manager, insumos);
      const saved = await manager.save(Consulta, this.buildConsulta(createDto));

      for (const item of inventarios) {
        const stockAnterior = item.inventario.stockActual;
        const stockResultante = stockAnterior - item.cantidad;

        item.inventario.stockActual = stockResultante;
        await manager.save(Inventario, item.inventario);

        await manager.save(
          MovimientoInventario,
          manager.create(MovimientoInventario, {
            inventarioId: item.inventario.id,
            consultaId: saved.id,
            cantidad: item.cantidad,
            tipoMovimiento: TipoMovimientoInventario.USO_CONSULTA,
            stockAnterior,
            stockResultante,
          }),
        );

        if (stockResultante < item.inventario.stockMinimo) {
          await this.createLowStockAlert(manager, item.inventario);
        }
      }

      return saved;
    });
  }

  private async lockAndValidateStock(
    manager: EntityManager,
    insumos: InsumoConsultaDto[],
  ): Promise<{ inventario: Inventario; cantidad: number }[]> {
    const result: { inventario: Inventario; cantidad: number }[] = [];
    const cantidadesPorProducto = new Map<string, number>();

    for (const insumo of insumos) {
      cantidadesPorProducto.set(
        insumo.inventarioId,
        (cantidadesPorProducto.get(insumo.inventarioId) ?? 0) + insumo.cantidad,
      );
    }

    for (const [inventarioId, cantidad] of cantidadesPorProducto.entries()) {
      const inventario = await manager.findOne(Inventario, {
        where: { id: inventarioId },
        lock: { mode: 'pessimistic_write' },
      });

      if (!inventario) {
        throw new BadRequestException(
          `Producto de inventario ${inventarioId} no encontrado`,
        );
      }

      if (inventario.stockActual < cantidad) {
        throw new UnprocessableEntityException(
          `Stock insuficiente para ${inventario.nombreProducto}. Disponible: ${inventario.stockActual}, requerido: ${cantidad}`,
        );
      }

      result.push({ inventario, cantidad });
    }

    return result;
  }

  private async createLowStockAlert(
    manager: EntityManager,
    inventario: Inventario,
  ): Promise<void> {
    const admin = await manager
      .createQueryBuilder(User, 'user')
      .innerJoinAndSelect('user.rol', 'rol')
      .where('rol.name = :role', { role: RoleType.ADMIN })
      .orderBy('user.createdAt', 'ASC')
      .getOne();

    if (!admin) {
      throw new BadRequestException(
        'No existe un usuario administrador para generar alerta de stock bajo',
      );
    }

    const notificacion = await manager.save(
      Notificacion,
      manager.create(Notificacion, {
        usuarioId: admin.id,
        mensaje: `Stock bajo: ${inventario.nombreProducto} quedo en ${inventario.stockActual} unidades (minimo ${inventario.stockMinimo}).`,
        emailDestino: admin.email,
        tipoEnvio: 'sistema',
        fechaEnvio: new Date(),
        estado: 'generada',
        errorMsg: null,
      }),
    );

    await manager.save(
      NotificacionInventario,
      manager.create(NotificacionInventario, {
        inventarioId: inventario.id,
        notificacionId: notificacion.id,
        tipoAlerta: 'stock_bajo',
      }),
    );
  }

  private buildConsulta(createDto: CreateConsultaDto): Consulta {
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
    consulta.justificacion =
      createDto.justificacion || createDto.vitalsJustification || null;
    consulta.fecha = new Date();
    return consulta;
  }

  private hasVitalJustification(createDto: CreateConsultaDto): boolean {
    return Boolean(
      createDto.justificacion ||
      createDto.vitalsJustification ||
      createDto.observaciones,
    );
  }

  private async validarConstantes(
    razaId: string | null,
    constantes: ConstantesVitalesIngresoDto,
  ): Promise<AlertaConstanteDto[]> {
    if (!razaId) return [];

    const raza = await this.razaService.findOne(razaId);
    const especieId = raza.especieId;

    const rangos: ConstantesVitalesDto =
      await this.especieService.getConstantes(especieId);
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
