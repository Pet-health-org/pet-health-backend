import { Entity, Column } from 'typeorm';
import { User } from './user.entity';

@Entity('recepcionistas')
export class Recepcionista extends User {
  @Column('varchar', { length: 50, nullable: true })
  telefonoDirecto: string;

  @Column('text', { nullable: true })
  observaciones: string;
}
