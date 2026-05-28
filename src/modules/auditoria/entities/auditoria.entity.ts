import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';

@Entity('auditoria')
@Index('IDX_auditoria_usuario', ['usuarioId'])
@Index('IDX_auditoria_accion', ['accion'])
@Index('IDX_auditoria_fecha', ['fecha'])
export class Auditoria {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  usuarioId: string;

  @Column('varchar', { length: 100 })
  accion: string;

  @Column('timestamp', { default: () => 'CURRENT_TIMESTAMP' })
  fecha: Date;

  @Column('varchar', { length: 50, nullable: true })
  ip: string | null;

  @Column('uuid', { nullable: true })
  registroId: string | null;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'usuarioId' })
  usuario: User;
}
