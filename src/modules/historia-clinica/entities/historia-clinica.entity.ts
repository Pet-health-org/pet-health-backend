import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Mascota } from '../../mascota/entities/mascota.entity';

@Entity('historias_clinicas')
export class HistoriaClinica {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  mascotaId: string;

  @Column('uuid', { nullable: true })
  citaId: string;

  @Column('timestamp')
  fecha: Date;

  @Column('text')
  diagnostico: string;

  @Column('text')
  tratamiento: string;

  @Column('text', { nullable: true })
  observaciones: string;

  @Column('timestamp', { default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @ManyToOne(() => Mascota)
  @JoinColumn({ name: 'mascotaId' })
  mascota: Mascota;
}