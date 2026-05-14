import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  Unique,
  Index,
} from 'typeorm';
import { Rol } from '../../rol/entities/rol.entity';

export enum UserStatus {
  ACTIVO = 'activo',
  INACTIVO = 'inactivo',
  BLOQUEADO = 'bloqueado',
}

@Entity('users')
@Unique(['email'])
@Unique(['username'])
@Index('IDX_users_nombre_completo', ['nombreCompleto'])
@Index('IDX_users_numero_identificacion', ['numeroIdentificacion'], {
  unique: true,
})
@Index('IDX_users_telefono', ['telefono'])
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('varchar', { length: 50 })
  username: string;

  @Column('varchar', { length: 100 })
  email: string;

  @Column('varchar', { length: 255 })
  password: string;

  @Column('varchar', { length: 100, nullable: true })
  nombreCompleto: string | null;

  @Column('varchar', { length: 50, nullable: true })
  numeroIdentificacion: string | null;

  @Column('varchar', { length: 100, nullable: true })
  direccion: string | null;

  @Column('varchar', { length: 50, nullable: true })
  telefono: string | null;

  @Column('text', { nullable: true })
  notas: string | null;

  @Column({
    type: 'enum',
    enum: UserStatus,
    default: UserStatus.ACTIVO,
  })
  status: UserStatus;

  @Column('boolean', { default: false })
  isActive: boolean;

  @Column('timestamp', { default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column('timestamp', {
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;

  @ManyToOne(() => Rol, { eager: true })
  @JoinColumn({ name: 'rol_id' })
  rol: Rol;

  toJSON() {
    const { password, ...user } = this;
    void password;
    return user;
  }
}
