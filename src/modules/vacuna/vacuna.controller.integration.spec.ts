import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { VacunaController } from './vacuna.controller';
import { VacunaService } from './vacuna.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';

describe('VacunaController integration', () => {
  let app: INestApplication;
  const vacunaService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findByMascota: jest.fn(),
    findByHistoriaClinica: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [VacunaController],
      providers: [{ provide: VacunaService, useValue: vacunaService }],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .overrideGuard(RolesGuard)
      .useValue({ canActivate: () => true })
      .compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
      }),
    );
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it('exposes GET /vacunas/mascota/:mascotaId for frontend vaccine history', async () => {
    const mascotaId = '550e8400-e29b-41d4-a716-446655440000';
    vacunaService.findByMascota.mockResolvedValue([
      {
        id: 'vacuna-1',
        historiaClinica: { mascotaId },
      },
    ]);

    await request(app.getHttpServer())
      .get(`/vacunas/mascota/${mascotaId}`)
      .expect(200)
      .expect(({ body }) => {
        expect(body).toHaveLength(1);
        expect(body[0].historiaClinica.mascotaId).toBe(mascotaId);
      });

    expect(vacunaService.findByMascota).toHaveBeenCalledWith(mascotaId);
  });

  it('accepts the vaccine application payload required by frontend', async () => {
    const payload = {
      historiaClinicaId: '550e8400-e29b-41d4-a716-446655440001',
      inventarioId: '550e8400-e29b-41d4-a716-446655440002',
      nombre: 'Rabia',
      fechaAplicacion: '2026-01-01T00:00:00Z',
      dosis: '1',
      lote: 'LOTE-1',
    };
    vacunaService.create.mockResolvedValue({ id: 'vacuna-1', ...payload });

    await request(app.getHttpServer())
      .post('/vacunas')
      .send(payload)
      .expect(201)
      .expect(({ body }) => {
        expect(body).toMatchObject(payload);
      });

    expect(vacunaService.create).toHaveBeenCalledWith(payload);
  });
});
