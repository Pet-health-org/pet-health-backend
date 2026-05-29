import {
  BadRequestException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { ConsultaService } from './consulta.service';

describe('ConsultaService', () => {
  const mascota = {
    id: '550e8400-e29b-41d4-a716-446655440001',
    razaId: '550e8400-e29b-41d4-a716-446655440002',
  };

  const createService = (overrides?: {
    consultaRepository?: any;
    mascotaService?: any;
    razaService?: any;
    especieService?: any;
    dataSource?: any;
  }) => {
    const consultaRepository = overrides?.consultaRepository ?? {
      save: jest.fn(async (entity) => ({ id: 'consulta-1', ...entity })),
    };
    const mascotaService = overrides?.mascotaService ?? {
      findOne: jest.fn().mockResolvedValue(mascota),
    };
    const razaService = overrides?.razaService ?? {
      findOne: jest.fn().mockResolvedValue({
        especieId: '550e8400-e29b-41d4-a716-446655440003',
      }),
    };
    const especieService = overrides?.especieService ?? {
      getConstantes: jest.fn().mockResolvedValue({
        temperatura: { minimo: 38, maximo: 39, unidad: 'C' },
        frecuenciaCardiaca: { minimo: 60, maximo: 120, unidad: 'lpm' },
        frecuenciaRespiratoria: { minimo: 10, maximo: 30, unidad: 'rpm' },
      }),
    };
    const dataSource = overrides?.dataSource ?? {
      transaction: jest.fn(),
    };

    return new ConsultaService(
      consultaRepository as any,
      mascotaService as any,
      razaService as any,
      especieService as any,
      dataSource as any,
    );
  };

  const baseDto = {
    mascotaId: mascota.id,
    motivo: 'Chequeo',
    diagnostico: 'Paciente estable',
    tratamiento: 'Observacion',
    constantesVitales: {
      temperatura: { valor: 40, unidad: 'C' },
      frecuenciaCardiaca: { valor: 80, unidad: 'lpm' },
      frecuenciaRespiratoria: { valor: 20, unidad: 'rpm' },
    },
  };

  it('rejects abnormal vital signs when no justification is provided', async () => {
    const service = createService();

    await expect(service.create(baseDto as any)).rejects.toBeInstanceOf(
      BadRequestException,
    );
  });

  it('accepts vitalsJustification and returns vital sign alerts', async () => {
    const service = createService();

    const result = await service.create({
      ...baseDto,
      vitalsJustification: 'Temperatura elevada por estres',
    } as any);

    expect(result).toMatchObject({
      id: 'consulta-1',
      justificacion: 'Temperatura elevada por estres',
      alertas: [
        expect.objectContaining({
          constante: 'temperatura',
          valorIngresado: 40,
        }),
      ],
    });
  });

  it('returns 422 when stock is insufficient before saving the consultation', async () => {
    const manager = {
      findOne: jest.fn().mockResolvedValue({
        id: '550e8400-e29b-41d4-a716-446655440004',
        nombreProducto: 'Vacuna rabia',
        stockActual: 0,
      }),
    };
    const service = createService({
      dataSource: {
        transaction: jest.fn((callback) => callback(manager)),
      },
    });

    await expect(
      service.create({
        mascotaId: mascota.id,
        motivo: 'Vacunacion',
        diagnostico: 'Apto',
        tratamiento: 'Aplicar vacuna',
        insumosUtilizados: [
          {
            inventarioId: '550e8400-e29b-41d4-a716-446655440004',
            cantidad: 1,
          },
        ],
      } as any),
    ).rejects.toBeInstanceOf(UnprocessableEntityException);
  });
});
