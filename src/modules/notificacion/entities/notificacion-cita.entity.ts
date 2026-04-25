import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Cita } from '../../mascota/entities/cita.entity';

@Entity('notificaciones_cita')
export class NotificacionCita {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  citaId: string;

  @Column('timestamp')
  fechaRecordatorio: Date;

  @ManyToOne(() => Cita)
  @JoinColumn({ name: 'citaId' })
  cita: Cita;
}
