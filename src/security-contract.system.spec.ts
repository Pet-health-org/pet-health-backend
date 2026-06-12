import 'reflect-metadata';
import { GUARDS_METADATA } from '@nestjs/common/constants';
import { ROLES_KEY } from './modules/auth/decorators/roles.decorator';
import { JwtAuthGuard } from './modules/auth/guards/jwt-auth.guard';
import { RolesGuard } from './modules/auth/guards/roles.guard';
import { RoleType } from './modules/rol/entities/rol.entity';
import { CitaController } from './modules/cita/cita.controller';
import { MascotaController } from './modules/mascota/mascota.controller';
import { NotificacionController } from './modules/notificacion/notificacion.controller';
import { RolController } from './modules/rol/rol.controller';
import { UserController } from './modules/user/user.controller';

function getGuardNames(target: object): string[] {
  const guards = Reflect.getMetadata(GUARDS_METADATA, target) ?? [];
  return guards.map((guard: any) => guard.name);
}

describe('security contract', () => {
  it('protects role management with JWT and admin role', () => {
    expect(getGuardNames(RolController)).toEqual(
      expect.arrayContaining([JwtAuthGuard.name, RolesGuard.name]),
    );
    expect(Reflect.getMetadata(ROLES_KEY, RolController)).toEqual([
      RoleType.ADMIN,
    ]);
  });

  it('protects user registration with JWT and admin role', () => {
    const register = UserController.prototype.register;

    expect(getGuardNames(register)).toEqual(
      expect.arrayContaining([JwtAuthGuard.name, RolesGuard.name]),
    );
    expect(Reflect.getMetadata(ROLES_KEY, register)).toEqual([RoleType.ADMIN]);
  });

  it('requires operational roles for appointment and pet updates', () => {
    expect(getGuardNames(CitaController.prototype.update)).toEqual(
      expect.arrayContaining([RolesGuard.name]),
    );
    expect(Reflect.getMetadata(ROLES_KEY, CitaController.prototype.update)).toEqual(
      [RoleType.ADMIN, RoleType.RECEPCIONISTA],
    );

    expect(getGuardNames(MascotaController.prototype.update)).toEqual(
      expect.arrayContaining([RolesGuard.name]),
    );
    expect(
      Reflect.getMetadata(ROLES_KEY, MascotaController.prototype.update),
    ).toEqual([RoleType.ADMIN, RoleType.RECEPCIONISTA, RoleType.PROPIETARIO]);
  });

  it('restricts notification history reads and updates to admin', () => {
    const adminOnlyHandlers = [
      NotificacionController.prototype.findAll,
      NotificacionController.prototype.findByUsuario,
      NotificacionController.prototype.findByEstado,
      NotificacionController.prototype.findOne,
      NotificacionController.prototype.update,
    ];

    for (const handler of adminOnlyHandlers) {
      expect(getGuardNames(handler)).toEqual(
        expect.arrayContaining([RolesGuard.name]),
      );
      expect(Reflect.getMetadata(ROLES_KEY, handler)).toEqual([
        RoleType.ADMIN,
      ]);
    }
  });
});
