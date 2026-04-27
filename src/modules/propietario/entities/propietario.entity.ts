import { Entity, Column } from 'typeorm';
import { User } from '../../user/entities/user.entity';

@Entity('propietarios')
export class Propietario extends User {
  @Column('varchar', { length: 100, nullable: true })
  direccion: string;

  @Column('varchar', { length: 50, nullable: true })
  telefono: string;

  @Column('text', { nullable: true })
  notas: string;
}