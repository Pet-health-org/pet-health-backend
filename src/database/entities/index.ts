import { Rol } from '../../modules/rol/entities/rol.entity';
import { User } from '../../modules/user/entities/user.entity';
import { Admin } from '../../modules/user/entities/admin.entity';
import { Veterinario } from '../../modules/user/entities/veterinario.entity';
import { Recepcionista } from '../../modules/user/entities/recepcionista.entity';
import { Propietario } from '../../modules/user/entities/propietario.entity';
import { Especie } from '../../modules/especie/entities/especie.entity';
import { Raza } from '../../modules/especie/entities/raza.entity';
import { Mascota } from '../../modules/mascota/entities/mascota.entity';
import { Cita } from '../../modules/mascota/entities/cita.entity';
import { HistoriaClinica } from '../../modules/mascota/entities/historia-clinica.entity';
import { Vacuna } from '../../modules/mascota/entities/vacuna.entity';
import { Medicamento } from '../../modules/mascota/entities/medicamento.entity';
import { Proveedor } from '../../modules/inventario/entities/proveedor.entity';
import { Inventario } from '../../modules/inventario/entities/inventario.entity';
import { Reporte } from '../../modules/reporte/entities/reporte.entity';
import { Notificacion } from '../../modules/notificacion/entities/notificacion.entity';
import { NotificacionCita } from '../../modules/notificacion/entities/notificacion-cita.entity';
import { NotificacionInventario } from '../../modules/notificacion/entities/notificacion-inventario.entity';

export const entities = [
  Rol,
  User,
  Admin,
  Veterinario,
  Recepcionista,
  Propietario,
  Especie,
  Raza,
  Mascota,
  Cita,
  HistoriaClinica,
  Vacuna,
  Medicamento,
  Proveedor,
  Inventario,
  Reporte,
  Notificacion,
  NotificacionCita,
  NotificacionInventario,
];

export type EntityClass =
  | typeof Rol
  | typeof User
  | typeof Admin
  | typeof Veterinario
  | typeof Recepcionista
  | typeof Propietario
  | typeof Especie
  | typeof Raza
  | typeof Mascota
  | typeof Cita
  | typeof HistoriaClinica
  | typeof Vacuna
  | typeof Medicamento
  | typeof Proveedor
  | typeof Inventario
  | typeof Reporte
  | typeof Notificacion
  | typeof NotificacionCita
  | typeof NotificacionInventario;
