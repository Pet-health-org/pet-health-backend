import {
  BadRequestException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { VacunaService } from './vacuna.service';

describe('VacunaService', () => {
  const createRepository = () => ({
    find: jest.fn(),
    findOne: jest.fn(),
    createQueryBuilder: jest.fn(),
    remove: jest.fn(),
  });

  it('registers a vaccine, calculates booster date and discounts stock atomically', async () => {
    const inventario = {
      id: '550e8400-e29b-41d4-a716-446655440002',
      nombreProducto: 'Rabia',
      stockActual: 5,
    };
    const manager = {
      findOne: jest.fn().mockResolvedValue(inventario),
      create: jest.fn((_entity, dto) => dto),
      save: jest.fn(async (entity, value) =>
        entity.name === 'Vacuna' ? { id: 'vacuna-1', ...value } : value,
      ),
    };
    const dataSource = {
      transaction: jest.fn((callback) => callback(manager)),
    };
    const service = new VacunaService(
      createRepository() as any,
      {
        findOne: jest.fn().mockResolvedValue({
          mascota: { especie: 'perro', edad: 2 },
        }),
      } as any,
      {
        calcularProximoRefuerzo: jest
          .fn()
          .mockResolvedValue(new Date('2027-01-01T00:00:00Z')),
      } as any,
      dataSource as any,
    );

    const result = await service.create({
      historiaClinicaId: '550e8400-e29b-41d4-a716-446655440001',
      inventarioId: inventario.id,
      nombre: 'Rabia',
      fechaAplicacion: '2026-01-01T00:00:00Z',
      dosis: '1',
    });

    expect(result).toMatchObject({
      id: 'vacuna-1',
      fechaProximoRefuerzo: '2027-01-01T00:00:00.000Z',
    });
    expect(inventario.stockActual).toBe(4);
    expect(dataSource.transaction).toHaveBeenCalled();
  });

  it('rejects vaccine registration when the inventory product does not exist', async () => {
    const dataSource = {
      transaction: jest.fn((callback) =>
        callback({
          findOne: jest.fn().mockResolvedValue(null),
        }),
      ),
    };
    const service = new VacunaService(
      createRepository() as any,
      { findOne: jest.fn() } as any,
      { calcularProximoRefuerzo: jest.fn() } as any,
      dataSource as any,
    );

    await expect(
      service.create({
        historiaClinicaId: '550e8400-e29b-41d4-a716-446655440001',
        inventarioId: '550e8400-e29b-41d4-a716-446655440002',
        nombre: 'Rabia',
        fechaAplicacion: '2026-01-01T00:00:00Z',
        fechaProximoRefuerzo: '2027-01-01T00:00:00Z',
        dosis: '1',
      }),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('rejects vaccine registration when stock is insufficient', async () => {
    const dataSource = {
      transaction: jest.fn((callback) =>
        callback({
          findOne: jest.fn().mockResolvedValue({
            nombreProducto: 'Rabia',
            stockActual: 0,
          }),
        }),
      ),
    };
    const service = new VacunaService(
      createRepository() as any,
      { findOne: jest.fn() } as any,
      { calcularProximoRefuerzo: jest.fn() } as any,
      dataSource as any,
    );

    await expect(
      service.create({
        historiaClinicaId: '550e8400-e29b-41d4-a716-446655440001',
        inventarioId: '550e8400-e29b-41d4-a716-446655440002',
        nombre: 'Rabia',
        fechaAplicacion: '2026-01-01T00:00:00Z',
        fechaProximoRefuerzo: '2027-01-01T00:00:00Z',
        dosis: '1',
      }),
    ).rejects.toBeInstanceOf(UnprocessableEntityException);
  });
});
