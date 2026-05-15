import { Entity } from 'typeorm';
import { User } from '../../user/entities/user.entity';

@Entity('propietarios')
export class Propietario extends User {}
