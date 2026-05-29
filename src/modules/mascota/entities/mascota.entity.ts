import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Propietario } from '../../propietario/entities/propietario.entity';
import { Raza } from '../../raza/entities/raza.entity';

export enum EspecieMascota {
  PERRO = 'perro',
  GATO = 'gato',
  AVE = 'ave',
  OTRO = 'otro',
}

@Entity('mascotas')
export class Mascota {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  propietarioId: string;

  @Column('uuid', { nullable: true })
  razaId: string | null;

  @Column('varchar', { length: 100 })
  nombre: string;

  @Column({
    type: 'enum',
    enum: EspecieMascota,
    default: EspecieMascota.OTRO,
  })
  especie: EspecieMascota;

  @Column('date')
  birthDate: string;

  @Column('int')
  edad: number;

  @Column('varchar', { length: 20 })
  sexo: string;

  @Column('decimal', { precision: 10, scale: 2 })
  peso: number;

  @Column('varchar', { length: 255, nullable: true })
  color: string;

  @Column('text', { nullable: true })
  observaciones: string;

  @Column('boolean', { default: true })
  estaActivo: boolean;

  @Column('timestamp', { default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @ManyToOne(() => Propietario)
  @JoinColumn({ name: 'propietarioId' })
  propietario: Propietario;

  @ManyToOne(() => Raza, { nullable: true })
  @JoinColumn({ name: 'razaId' })
  raza: Raza | null;
}
