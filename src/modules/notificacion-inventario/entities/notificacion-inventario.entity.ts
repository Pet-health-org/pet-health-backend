import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  OneToOne,
} from 'typeorm';
import { Inventario } from '../../inventario/entities/inventario.entity';
import { Notificacion } from '../../notificacion/entities/notificacion.entity';

@Entity('notificaciones_inventario')
export class NotificacionInventario {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  inventarioId: string;

  @Column('uuid')
  notificacionId: string;

  @Column('varchar', { length: 50 })
  tipoAlerta: string;

  @ManyToOne(() => Inventario)
  @JoinColumn({ name: 'inventarioId' })
  inventario: Inventario;

  @OneToOne(() => Notificacion)
  @JoinColumn({ name: 'notificacionId' })
  notificacion: Notificacion;
}