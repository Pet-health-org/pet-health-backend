import { User, UserStatus } from '../../modules/user/entities/user.entity';
import { CreateUserDto, UpdateUserDto } from '../../modules/user/dto/user.dto';
import { RoleType } from '../../modules/rol/entities/rol.entity';

export interface IUserService {
  create(createUserDto: CreateUserDto): Promise<User>;
  findAll(): Promise<User[]>;
  findOne(id: string): Promise<User>;
  findByEmail(email: string): Promise<User>;
  findByUsername(username: string): Promise<User>;
  findByRol(rol: RoleType): Promise<User[]>;
  update(id: string, updateUserDto: UpdateUserDto): Promise<User>;
  changeStatus(id: string, status: UserStatus): Promise<User>;
  remove(id: string): Promise<void>;
  validateCredentials(username: string, password: string): Promise<User | null>;
}
