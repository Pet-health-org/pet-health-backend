import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Especie } from '../../especie/entities/especie.entity';

@Entity('razas')
export class Raza {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('varchar', { length: 50 })
  nombre: string;

  @Column('text', { nullable: true })
  caracteristicas: string;

  @Column('uuid')
  especieId: string;

  @ManyToOne(() => Especie)
  @JoinColumn({ name: 'especieId' })
  especie: Especie;
}