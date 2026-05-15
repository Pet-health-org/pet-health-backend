import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';

@Entity('reportes')
export class Reporte {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  adminId: string;

  @Column('varchar', { length: 50 })
  tipoReporte: string;

  @Column('timestamp')
  fechaGeneracion: Date;

  @Column('varchar', { length: 50, nullable: true })
  periodo: string;

  @Column('text')
  contenido: string;

  @Column('varchar', { length: 20 })
  formato: string;

  @Column('timestamp', { default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'adminId' })
  admin: User;
}
