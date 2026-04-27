import { Entity, Column } from 'typeorm';
import { User } from '../../user/entities/user.entity';

@Entity('veterinarios')
export class Veterinario extends User {
  @Column('varchar', { length: 100 })
  especialidad: string;

  @Column('varchar', { length: 50, nullable: true })
  numeroLicencia: string;

  @Column('text', { nullable: true })
  curriculum: string;
}