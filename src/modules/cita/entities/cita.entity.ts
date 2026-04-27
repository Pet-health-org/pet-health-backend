import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Mascota } from '../../mascota/entities/mascota.entity';
import { User } from '../../user/entities/user.entity';

@Entity('citas')
export class Cita {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  mascotaId: string;

  @Column('uuid')
  veterinarioId: string;

  @Column('timestamp')
  fechaHora: Date;

  @Column('text')
  motivo: string;

  @Column('varchar', { length: 50 })
  estado: string;

  @Column('timestamp', { default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @ManyToOne(() => Mascota)
  @JoinColumn({ name: 'mascotaId' })
  mascota: Mascota;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'veterinarioId' })
  veterinario: User;
}