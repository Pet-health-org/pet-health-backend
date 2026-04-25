import { Entity, Column } from 'typeorm';
import { User } from './user.entity';

@Entity('admins')
export class Admin extends User {
  @Column('varchar', { length: 100, nullable: true })
  cargo: string;

  @Column('text', { nullable: true })
  permisosEspeciales: string;
}
