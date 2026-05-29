import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserStatus } from './entities/user.entity';
import { CreateUserDto, UpdateUserDto } from './dto/user.dto';
import { RolService } from '../rol/rol.service';
import { RoleType } from '../rol/entities/rol.entity';
import { PropietarioService } from '../propietario/propietario.service';
import { HashService } from '../../common/hash.service';
import { IUserService } from '../../common/interfaces/iuser-service.interface';
import { FindOptionsWhere } from 'typeorm';

type UserCreationHandler = (dto: CreateUserDto) => Promise<User>;

@Injectable()
export class UserService implements IUserService {
  private readonly roleHandlers: Map<string, UserCreationHandler>;

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly rolService: RolService,
    private readonly propietarioService: PropietarioService,
    private readonly hashService: HashService,
  ) {
    this.roleHandlers = new Map([
      [
        RoleType.PROPIETARIO,
        (dto) => this.propietarioService.createFromUser(dto),
      ],
    ]);
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const { email, username, password, rolId } = createUserDto;

    const rol = await this.rolService.findByName(rolId);
    if (!rol) {
      throw new BadRequestException(
        `Rol ${rolId} no existe. Roles válidos: admin, veterinario, recepcionista, propietario`,
      );
    }

    const handler = this.roleHandlers.get(rolId);
    if (handler) {
      return handler(createUserDto);
    }

    const existingEmail = await this.userRepository.findOne({
      where: { email },
    });
    if (existingEmail) {
      throw new ConflictException('El email ya está registrado');
    }

    const existingUsername = await this.userRepository.findOne({
      where: { username },
    });
    if (existingUsername) {
      throw new ConflictException('El nombre de usuario ya está en uso');
    }

    const hashedPassword = await this.hashService.hash(password);
    const user = this.userRepository.create({
      ...createUserDto,
      password: hashedPassword,
      rol,
    });

    return await this.userRepository.save(user);
  }

  async findAll(): Promise<User[]> {
    return await this.userRepository.find({
      relations: ['rol'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['rol'],
    });
    if (!user) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    }
    return user;
  }

  async findByEmail(email: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { email },
      relations: ['rol'],
    });
    if (!user) {
      throw new NotFoundException(`Usuario con email ${email} no encontrado`);
    }
    return user;
  }

  async findByUsername(username: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { username },
      relations: ['rol'],
    });
    if (!user) {
      throw new NotFoundException(
        `Usuario con username ${username} no encontrado`,
      );
    }
    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id);

    if (updateUserDto.email && updateUserDto.email !== user.email) {
      const existingEmail = await this.userRepository.findOne({
        where: { email: updateUserDto.email },
      });
      if (existingEmail) {
        throw new ConflictException('El email ya está registrado');
      }
    }

    if (updateUserDto.username && updateUserDto.username !== user.username) {
      const existingUsername = await this.userRepository.findOne({
        where: { username: updateUserDto.username },
      });
      if (existingUsername) {
        throw new ConflictException('El nombre de usuario ya está en uso');
      }
    }

    if (updateUserDto.rolId) {
      const rol = await this.rolService.findByName(updateUserDto.rolId);
      if (!rol) {
        throw new BadRequestException(`Rol ${updateUserDto.rolId} no existe`);
      }
      user.rol = rol;
    }

    if (updateUserDto.password) {
      user.password = await this.hashService.hash(updateUserDto.password);
    }

    Object.assign(user, updateUserDto);
    return await this.userRepository.save(user);
  }

  async changeStatus(id: string, status: UserStatus): Promise<User> {
    const user = await this.findOne(id);
    user.status = status;
    user.isActive = status === UserStatus.ACTIVO;
    return await this.userRepository.save(user);
  }

  async remove(id: string): Promise<void> {
    const user = await this.findOne(id);
    await this.userRepository.remove(user);
  }

  async validateCredentials(
    username: string,
    password: string,
  ): Promise<User | null> {
    const user = await this.userRepository.findOne({
      where: [{ username }, { email: username }],
      relations: ['rol'],
    });
    if (!user) {
      return null;
    }
    const isValid = await this.hashService.compare(password, user.password);
    if (!isValid) {
      return null;
    }
    return user;
  }

  async findByRol(rol: RoleType): Promise<User[]> {
    return await this.userRepository.find({
      where: { rol: { name: rol } },
      relations: ['rol'],
      order: { createdAt: 'DESC' },
    });
  }

  async findForAuth(usernameOrEmail: string): Promise<User | null> {
    return await this.userRepository.findOne({
      where: [{ username: usernameOrEmail }, { email: usernameOrEmail }] as FindOptionsWhere<User>[],
      relations: ['rol'],
    });
  }

  async comparePassword(password: string, hash: string): Promise<boolean> {
    return await this.hashService.compare(password, hash);
  }
}
