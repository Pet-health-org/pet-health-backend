import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('especies')
export class Especie {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('varchar', { length: 50 })
  nombre: string;

  @Column('text', { nullable: true })
  constantesVitales: string;

  @Column('text', { nullable: true })
  observaciones: string;
}