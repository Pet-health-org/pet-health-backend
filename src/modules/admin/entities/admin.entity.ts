import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';

@Entity('admins')
export class Admin {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  userId: string;

  @Column('varchar', { length: 100, nullable: true })
  cargo: string;

  @Column('text', { nullable: true })
  permisosEspeciales: string;

  @OneToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;
}
