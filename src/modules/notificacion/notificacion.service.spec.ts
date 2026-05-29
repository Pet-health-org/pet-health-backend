import { NotFoundException } from '@nestjs/common';
import { NotificacionService } from './notificacion.service';

describe('NotificacionService', () => {
  const createRepository = () => ({
    create: jest.fn((dto) => dto),
    save: jest.fn(async (entity) => ({ id: 'notificacion-1', ...entity })),
    findOne: jest.fn(),
    findAndCount: jest.fn(),
    find: jest.fn(),
    remove: jest.fn(),
  });

  it('sends owner notifications using the owner user record', async () => {
    const notificacionRepository = createRepository();
    const userRepository = createRepository();
    const emailService = {
      enviarCorreo: jest.fn().mockResolvedValue(undefined),
    };
    userRepository.findOne.mockResolvedValue({
      id: '550e8400-e29b-41d4-a716-446655440001',
      email: 'owner@mail.com',
      nombreCompleto: 'Ana Propietaria',
    });

    const service = new NotificacionService(
      notificacionRepository as any,
      userRepository as any,
      emailService as any,
    );

    const result = await service.notificarPropietario({
      propietarioId: '550e8400-e29b-41d4-a716-446655440001',
      mensaje: 'Vacuna pendiente',
      tipoPlantilla: 'alerta_vacuna',
    });

    expect(result).toMatchObject({
      usuarioId: '550e8400-e29b-41d4-a716-446655440001',
      emailDestino: 'owner@mail.com',
      estado: 'enviado',
    });
    expect(emailService.enviarCorreo).toHaveBeenCalledWith(
      'owner@mail.com',
      'alerta_vacuna',
      expect.objectContaining({
        nombrePropietario: 'Ana Propietaria',
        motivo: 'Vacuna pendiente',
      }),
    );
  });

  it('returns 404 when the owner user does not exist', async () => {
    const notificacionRepository = createRepository();
    const userRepository = createRepository();
    userRepository.findOne.mockResolvedValue(null);

    const service = new NotificacionService(
      notificacionRepository as any,
      userRepository as any,
      { enviarCorreo: jest.fn() } as any,
    );

    await expect(
      service.notificarPropietario({
        propietarioId: '550e8400-e29b-41d4-a716-446655440001',
        mensaje: 'Vacuna pendiente',
      }),
    ).rejects.toBeInstanceOf(NotFoundException);
  });
});
