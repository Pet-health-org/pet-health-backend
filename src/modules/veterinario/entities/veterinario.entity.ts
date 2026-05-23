import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';

@Entity('veterinarios')
export class Veterinario {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  userId: string;

  @Column('varchar', { length: 100 })
  especialidad: string;

  @Column('varchar', { length: 50, nullable: true })
  numeroLicencia: string;

  @Column('text', { nullable: true })
  curriculum: string;

  @OneToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;
}
