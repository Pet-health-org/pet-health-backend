import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User, UserStatus } from './entities/user.entity';
import { CreateUserDto, UpdateUserDto } from './dto/user.dto';
import { Rol, RoleType } from '../rol/entities/rol.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Rol)
    private readonly rolRepository: Repository<Rol>,
  ) {}

  private async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, 10);
  }

  private async comparePassword(
    password: string,
    hash: string,
  ): Promise<boolean> {
    return await bcrypt.compare(password, hash);
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const { email, username, password, rolId } = createUserDto;

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

    const rol = await this.rolRepository.findOne({ where: { name: rolId } });
    if (!rol) {
      throw new BadRequestException(
        `Rol ${rolId} no existe. Roles válidos: admin, veterinario, recepcionista, propietario`,
      );
    }

    const hashedPassword = await this.hashPassword(password);
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
      const rol = await this.rolRepository.findOne({
        where: { name: updateUserDto.rolId },
      });
      if (!rol) {
        throw new BadRequestException(`Rol ${updateUserDto.rolId} no existe`);
      }
      user.rol = rol;
    }

    if (updateUserDto.password) {
      user.password = await this.hashPassword(updateUserDto.password);
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
    const isValid = await this.comparePassword(password, user.password);
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
}
