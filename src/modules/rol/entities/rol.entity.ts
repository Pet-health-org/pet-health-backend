import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

export enum RoleType {
  ADMIN = 'admin',
  VETERINARIO = 'veterinario',
  RECEPCIONISTA = 'recepcionista',
  PROPIETARIO = 'propietario',
}

@Entity('roles')
export class Rol {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: RoleType,
    unique: true,
  })
  name: RoleType;

  @Column('text', { nullable: true })
  description: string;
}
