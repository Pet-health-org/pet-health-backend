import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';

@Entity('recepcionistas')
export class Recepcionista {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  userId: string;

  @Column('varchar', { length: 50, nullable: true })
  telefonoDirecto: string;

  @Column('text', { nullable: true })
  observaciones: string;

  @OneToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;
}
