import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Rol } from './entities/rol.entity';
import { CreateRolDto, UpdateRolDto } from './dto/rol.dto';
import { User } from '../user/entities/user.entity';

@Injectable()
export class RolService {
  constructor(
    @InjectRepository(Rol)
    private readonly rolRepository: Repository<Rol>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createRolDto: CreateRolDto): Promise<Rol> {
    const existingRol = await this.rolRepository.findOne({
      where: { name: createRolDto.name },
    });
    if (existingRol) {
      throw new ConflictException('El rol ya existe');
    }

    const rol = this.rolRepository.create(createRolDto);
    return await this.rolRepository.save(rol);
  }

  async findAll(): Promise<Rol[]> {
    return await this.rolRepository.find({
      order: { name: 'ASC' },
    });
  }

  async findOne(id: string): Promise<Rol> {
    const rol = await this.rolRepository.findOne({
      where: { id },
    });
    if (!rol) {
      throw new NotFoundException(`Rol con ID ${id} no encontrado`);
    }
    return rol;
  }

  async findByNome(name: Rol['name']): Promise<Rol> {
    const rol = await this.rolRepository.findOne({
      where: { name },
    });
    if (!rol) {
      throw new NotFoundException(`Rol con nombre ${name} no encontrado`);
    }
    return rol;
  }

  async update(id: string, updateRolDto: UpdateRolDto): Promise<Rol> {
    const rol = await this.findOne(id);
    if (updateRolDto.name && updateRolDto.name !== rol.name) {
      const existingRol = await this.rolRepository.findOne({
        where: { name: updateRolDto.name },
      });
      if (existingRol) {
        throw new ConflictException('El nombre de rol ya está en uso');
      }
    }
    Object.assign(rol, updateRolDto);
    return await this.rolRepository.save(rol);
  }

  async remove(id: string): Promise<void> {
    const rol = await this.findOne(id);
    const usersCount = await this.userRepository.count({
      where: { rol: { id: id } },
    });
    if (usersCount > 0) {
      throw new ConflictException(
        'No se puede eliminar el rol porque tiene usuarios asignados',
      );
    }
    await this.rolRepository.remove(rol);
  }
}
