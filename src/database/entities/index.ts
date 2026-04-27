import { Rol } from '../../modules/rol/entities/rol.entity';
import { User } from '../../modules/user/entities/user.entity';
import { Admin } from '../../modules/admin/entities/admin.entity';
import { Veterinario } from '../../modules/veterinario/entities/veterinario.entity';
import { Recepcionista } from '../../modules/recepcionista/entities/recepcionista.entity';
import { Propietario } from '../../modules/propietario/entities/propietario.entity';
import { Especie } from '../../modules/especie/entities/especie.entity';
import { Raza } from '../../modules/raza/entities/raza.entity';
import { Mascota } from '../../modules/mascota/entities/mascota.entity';
import { Cita } from '../../modules/cita/entities/cita.entity';
import { HistoriaClinica } from '../../modules/historia-clinica/entities/historia-clinica.entity';
import { Vacuna } from '../../modules/vacuna/entities/vacuna.entity';
import { Medicamento } from '../../modules/medicamento/entities/medicamento.entity';
import { Proveedor } from '../../modules/proveedor/entities/proveedor.entity';
import { Inventario } from '../../modules/inventario/entities/inventario.entity';
import { Reporte } from '../../modules/reporte/entities/reporte.entity';
import { Notificacion } from '../../modules/notificacion/entities/notificacion.entity';
import { NotificacionInventario } from '../../modules/notificacion-inventario/entities/notificacion-inventario.entity';

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
  | typeof NotificacionInventario;