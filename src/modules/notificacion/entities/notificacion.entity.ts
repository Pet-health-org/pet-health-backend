import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';

@Entity('notificaciones')
export class Notificacion {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  usuarioId: string;

  @Column('text')
  mensaje: string;

  @Column('varchar', { length: 150 })
  emailDestino: string;

  @Column('varchar', { length: 20 })
  tipoEnvio: string;

  @Column('varchar', { length: 30, nullable: true })
  tipoPlantilla: string | null;

  @Column('timestamp', { default: () => 'CURRENT_TIMESTAMP' })
  fechaCreacion: Date;

  @Column('timestamp', { nullable: true })
  fechaEnvio: Date | null;

  @Column('varchar', { length: 20 })
  estado: string;

  @Column('text', { nullable: true })
  errorMsg: string | null;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'usuarioId' })
  usuario: User;
}
