import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { Vacuna } from '../../vacuna/entities/vacuna.entity';
import { Mascota } from '../../mascota/entities/mascota.entity';
import { User } from '../../user/entities/user.entity';
import { Notificacion } from '../../notificacion/entities/notificacion.entity';

@Entity('alertas_vacunas')
@Unique(['vacunaId'])
@Index('IDX_alertas_vacunas_fecha_refuerzo', ['fechaProximoRefuerzo'])
export class AlertaVacuna {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  vacunaId: string;

  @Column('uuid')
  mascotaId: string;

  @Column('uuid')
  propietarioId: string;

  @Column('uuid', { nullable: true })
  notificacionId: string | null;

  @Column('timestamp')
  fechaProximoRefuerzo: Date;

  @Column('timestamp', { default: () => 'CURRENT_TIMESTAMP' })
  fechaAlerta: Date;

  @Column('varchar', { length: 20, default: 'generada' })
  estado: string;

  @Column('boolean', { default: false })
  notificacionEnviada: boolean;

  @Column('text', { nullable: true })
  errorNotificacion: string | null;

  @ManyToOne(() => Vacuna)
  @JoinColumn({ name: 'vacunaId' })
  vacuna: Vacuna;

  @ManyToOne(() => Mascota)
  @JoinColumn({ name: 'mascotaId' })
  mascota: Mascota;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'propietarioId' })
  propietario: User;

  @ManyToOne(() => Notificacion, { nullable: true })
  @JoinColumn({ name: 'notificacionId' })
  notificacion: Notificacion | null;
}
