import { UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';

describe('AuthService login lockout', () => {
  const baseUser = {
    id: 'user-1',
    username: 'admin',
    email: 'admin@pethealth.com',
    password: 'hashed',
    status: 'activo',
    intentosFallidos: 0,
    bloqueadoHasta: null,
    rol: { id: 'role-1', name: 'admin' },
  };

  const createService = (overrides: Partial<typeof baseUser> = {}) => {
    const user = { ...baseUser, ...overrides };
    const userService = {
      findForAuth: jest.fn().mockResolvedValue(user),
      comparePassword: jest.fn().mockResolvedValue(false),
      findOne: jest.fn(),
    };
    const jwtService = {
      signAsync: jest.fn(),
    };
    const configService = {
      get: jest.fn().mockReturnValue(1800),
    };
    const userRepository = {
      update: jest.fn(),
    };

    const service = new AuthService(
      userService as any,
      jwtService as any,
      configService as any,
      userRepository as any,
    );

    return { service, userService, userRepository };
  };

  it('persists a temporary lock after three failed attempts', async () => {
    const { service, userRepository } = createService({
      intentosFallidos: 2,
    });

    await expect(
      service.validateUser({ username: 'admin', password: 'bad-password' }),
    ).rejects.toBeInstanceOf(UnauthorizedException);

    expect(userRepository.update).toHaveBeenCalledWith(
      'user-1',
      expect.objectContaining({
        intentosFallidos: 3,
        bloqueadoHasta: expect.any(Date),
      }),
    );
  });

  it('rejects a blocked account from persisted database state before checking password', async () => {
    const bloqueadoHasta = new Date(Date.now() + 15 * 60 * 1000);
    const { service, userService, userRepository } = createService({
      intentosFallidos: 3,
      bloqueadoHasta,
    });

    await expect(
      service.validateUser({ username: 'admin', password: 'Admin123!' }),
    ).rejects.toBeInstanceOf(UnauthorizedException);

    expect(userService.comparePassword).not.toHaveBeenCalled();
    expect(userRepository.update).not.toHaveBeenCalled();
  });

  it('clears an expired temporary lock before counting new failures', async () => {
    const bloqueadoHasta = new Date(Date.now() - 60 * 1000);
    const { service, userRepository } = createService({
      intentosFallidos: 3,
      bloqueadoHasta,
    });

    await expect(
      service.validateUser({ username: 'admin', password: 'bad-password' }),
    ).rejects.toBeInstanceOf(UnauthorizedException);

    expect(userRepository.update).toHaveBeenNthCalledWith(1, 'user-1', {
      intentosFallidos: 0,
      bloqueadoHasta: null,
    });
    expect(userRepository.update).toHaveBeenNthCalledWith(2, 'user-1', {
      intentosFallidos: 1,
    });
  });
});
