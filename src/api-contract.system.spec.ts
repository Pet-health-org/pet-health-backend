import 'reflect-metadata';
import { RequestMethod } from '@nestjs/common';
import { METHOD_METADATA, PATH_METADATA } from '@nestjs/common/constants';
import { AuthController } from './modules/auth/auth.controller';
import { PropietarioController } from './modules/propietario/propietario.controller';
import { MascotaController } from './modules/mascota/mascota.controller';
import { EspecieController } from './modules/especie/especie.controller';
import { CitaController } from './modules/cita/cita.controller';
import { VeterinarioController } from './modules/veterinario/veterinario.controller';
import { ConsultaController } from './modules/consulta/consulta.controller';
import { VacunacionController } from './modules/vacunacion/vacunacion.controller';
import { VacunaController } from './modules/vacuna/vacuna.controller';
import { InventarioController } from './modules/inventario/inventario.controller';
import { NotificacionController } from './modules/notificacion/notificacion.controller';
import { AuditoriaController } from './modules/auditoria/auditoria.controller';
import { HistoriaClinicaController } from './modules/historia-clinica/historia-clinica.controller';

type ControllerClass = new (...args: any[]) => any;

const methodNames: Record<number, string> = {
  [RequestMethod.GET]: 'GET',
  [RequestMethod.POST]: 'POST',
  [RequestMethod.PUT]: 'PUT',
  [RequestMethod.PATCH]: 'PATCH',
  [RequestMethod.DELETE]: 'DELETE',
};

function normalizePath(path: string | string[] | undefined): string {
  const value = Array.isArray(path) ? path[0] : path;
  return (value || '').replace(/^\/+|\/+$/g, '');
}

function collectRoutes(controllers: ControllerClass[]): string[] {
  const routes = new Set<string>();

  for (const ControllerClass of controllers) {
    const controllerPath = normalizePath(
      Reflect.getMetadata(PATH_METADATA, ControllerClass),
    );
    const prototype = ControllerClass.prototype;

    for (const methodName of Object.getOwnPropertyNames(prototype)) {
      if (methodName === 'constructor') continue;

      const method = prototype[methodName];
      const requestMethod = Reflect.getMetadata(METHOD_METADATA, method);
      if (requestMethod === undefined) continue;

      const routePath = normalizePath(
        Reflect.getMetadata(PATH_METADATA, method),
      );
      const fullPath = [controllerPath, routePath].filter(Boolean).join('/');
      routes.add(`${methodNames[requestMethod]} /${fullPath}`);
    }
  }

  return Array.from(routes);
}

describe('API contract system coverage', () => {
  const routes = collectRoutes([
    AuthController,
    PropietarioController,
    MascotaController,
    EspecieController,
    CitaController,
    VeterinarioController,
    ConsultaController,
    VacunacionController,
    VacunaController,
    InventarioController,
    NotificacionController,
    AuditoriaController,
    HistoriaClinicaController,
  ]);

  it('exposes the backend HU routes required by hu.md', () => {
    expect(routes).toEqual(
      expect.arrayContaining([
        'POST /auth/login',
        'POST /propietarios',
        'GET /propietarios',
        'POST /mascotas',
        'GET /especies/:especieId/constantes',
        'PUT /especies/:especieId/constantes',
        'POST /citas',
        'GET /veterinarios/:id/disponibilidad',
        'GET /veterinarios/disponibilidad',
        'POST /consultas',
        'POST /vacunacion/esquemas',
        'GET /vacunacion/esquemas/:especie',
        'GET /notificaciones',
        'POST /notificaciones/:id/reenviar',
        'GET /auditoria',
      ]),
    );
  });

  it('exposes the frontend integration routes and PATCH update methods', () => {
    expect(routes).toEqual(
      expect.arrayContaining([
        'GET /vacunas/mascota/:mascotaId',
        'POST /vacunas',
        'PATCH /vacunas/:id',
        'POST /inventario',
        'PATCH /inventario/:id',
        'PATCH /historias-clinicas/:id',
        'POST /notificaciones/propietario',
      ]),
    );
  });
});
