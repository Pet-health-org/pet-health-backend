import { Entity, Column, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { TipoAcceso } from './invitacion.entity';

@Entity('integrantes')
@Unique(['email'])
@Unique(['username'])
export class Integrante {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('varchar', { length: 100 })
  email: string;

  @Column('varchar', { length: 50 })
  username: string;

  @Column('varchar', { length: 255 })
  password: string;

  @Column('varchar', { length: 100, nullable: true })
  nombreCompleto: string | null;

  @Column({ type: 'enum', enum: TipoAcceso })
  tipoAcceso: TipoAcceso;

  @Column('boolean', { default: true })
  isActive: boolean;

  @Column('timestamp', { default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
}
