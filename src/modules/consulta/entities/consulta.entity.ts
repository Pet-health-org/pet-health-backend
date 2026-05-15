import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Mascota } from '../../mascota/entities/mascota.entity';

@Entity('consultas')
export class Consulta {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  mascotaId: string;

  @Column('text')
  motivo: string;

  @Column('text', { nullable: true })
  anamnesis: string | null;

  @Column('text', { nullable: true })
  constantesVitales: string | null;

  @Column('text')
  diagnostico: string;

  @Column('text')
  tratamiento: string;

  @Column('text', { nullable: true })
  observaciones: string | null;

  @Column('text', { nullable: true })
  justificacion: string | null;

  @Column('timestamp', { default: () => 'CURRENT_TIMESTAMP' })
  fecha: Date;

  @Column('timestamp', { default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @ManyToOne(() => Mascota)
  @JoinColumn({ name: 'mascotaId' })
  mascota: Mascota;
}
