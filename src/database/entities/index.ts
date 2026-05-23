import { Rol } from '../../modules/rol/entities/rol.entity';
import { User } from '../../modules/user/entities/user.entity';
import { Especie } from '../../modules/especie/entities/especie.entity';
import { Raza } from '../../modules/raza/entities/raza.entity';
import { Mascota } from '../../modules/mascota/entities/mascota.entity';
import { Cita } from '../../modules/cita/entities/cita.entity';
import { HistoriaClinica } from '../../modules/historia-clinica/entities/historia-clinica.entity';
import { Vacuna } from '../../modules/vacuna/entities/vacuna.entity';
import { Medicamento } from '../../modules/medicamento/entities/medicamento.entity';
import { Proveedor } from '../../modules/proveedor/entities/proveedor.entity';
import { Inventario } from '../../modules/inventario/entities/inventario.entity';
import { MovimientoInventario } from '../../modules/inventario/entities/movimiento-inventario.entity';
import { Reporte } from '../../modules/reporte/entities/reporte.entity';
import { Notificacion } from '../../modules/notificacion/entities/notificacion.entity';
import { NotificacionInventario } from '../../modules/notificacion-inventario/entities/notificacion-inventario.entity';
import { Consulta } from '../../modules/consulta/entities/consulta.entity';
import { EsquemaVacunacion } from '../../modules/vacunacion/entities/esquema-vacunacion.entity';
import { AlertaVacuna } from '../../modules/vacunacion/entities/alerta-vacuna.entity';

export const entities = [
  Rol,
  User,
  Especie,
  Raza,
  Mascota,
  Cita,
  HistoriaClinica,
  Vacuna,
  Medicamento,
  Proveedor,
  Inventario,
  MovimientoInventario,
  Reporte,
  Notificacion,
  NotificacionInventario,
  Consulta,
  EsquemaVacunacion,
  AlertaVacuna,
];

export type EntityClass =
  | typeof Rol
  | typeof User
  | typeof Especie
  | typeof Raza
  | typeof Mascota
  | typeof Cita
  | typeof HistoriaClinica
  | typeof Vacuna
  | typeof Medicamento
  | typeof Proveedor
  | typeof Inventario
  | typeof MovimientoInventario
  | typeof Reporte
  | typeof Notificacion
  | typeof NotificacionInventario
  | typeof Consulta
  | typeof EsquemaVacunacion
  | typeof AlertaVacuna;
  | typeof Consulta
  | typeof EsquemaVacunacion
  | typeof AlertaVacuna;
