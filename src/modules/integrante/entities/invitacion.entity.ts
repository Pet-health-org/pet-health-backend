import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

export enum TipoAcceso {
  BACKEND = 'backend',
  FRONTEND = 'frontend',
}

@Entity('invitaciones')
export class Invitacion {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('varchar', { length: 100 })
  email: string;

  @Column('varchar', { length: 50, unique: true })
  codigo: string;

  @Column({
    type: 'enum',
    enum: TipoAcceso,
  })
  tipoAcceso: TipoAcceso;

  @Column('timestamp')
  expiresAt: Date;

  @Column('timestamp', { default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
}
