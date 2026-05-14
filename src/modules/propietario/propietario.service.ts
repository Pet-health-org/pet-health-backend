import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { CreatePropietarioDto } from './dto/propietario.dto';
import { RolService } from '../rol/rol.service';
import { RoleType } from '../rol/entities/rol.entity';
import { User, UserStatus } from '../user/entities/user.entity';

export type PropietarioResponse = Omit<User, 'password'>;

@Injectable()
export class PropietarioService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly rolService: RolService,
  ) {}

  async create(createDto: CreatePropietarioDto): Promise<PropietarioResponse> {
    await this.ensureUniqueFields(createDto);

    const rol = await this.rolService.findByName(RoleType.PROPIETARIO);
    if (!rol) {
      throw new BadRequestException('El rol propietario no existe');
    }

    const hashedPassword = await bcrypt.hash(createDto.password, 10);
    const propietario = this.userRepository.create({
      ...createDto,
      password: hashedPassword,
      rol,
      status: UserStatus.ACTIVO,
      isActive: true,
    });

    const saved = await this.userRepository.save(propietario);
    return this.toResponse(saved);
  }

  async search(
    q?: string,
    page = 1,
    limit = 20,
  ): Promise<PropietarioResponse[]> {
    const safePage = Number.isFinite(page) && page > 0 ? page : 1;
    const safeLimit = Math.min(
      Math.max(Number.isFinite(limit) && limit > 0 ? limit : 20, 1),
      20,
    );

    const query = this.userRepository
      .createQueryBuilder('propietario')
      .innerJoinAndSelect('propietario.rol', 'rol')
      .where('rol.name = :rol', { rol: RoleType.PROPIETARIO })
      .orderBy('propietario.createdAt', 'DESC')
      .skip((safePage - 1) * safeLimit)
      .take(safeLimit);

    const term = q?.trim();
    if (term) {
      query.andWhere(
        [
          'propietario.nombreCompleto LIKE :term',
          'propietario.numeroIdentificacion LIKE :term',
          'propietario.telefono LIKE :term',
        ].join(' OR '),
        { term: `%${term}%` },
      );
    }

    const propietarios = await query.getMany();
    return propietarios.map((propietario) => this.toResponse(propietario));
  }

  async findOne(id: string): Promise<PropietarioResponse> {
    const propietario = await this.userRepository.findOne({
      where: { id, rol: { name: RoleType.PROPIETARIO } },
      relations: ['rol'],
    });
    if (!propietario) {
      throw new NotFoundException(`Propietario con ID ${id} no encontrado`);
    }

    return this.toResponse(propietario);
  }

  async exists(id: string): Promise<boolean> {
    return await this.userRepository.exists({
      where: { id, rol: { name: RoleType.PROPIETARIO } },
    });
  }

  private async ensureUniqueFields(
    createDto: CreatePropietarioDto,
  ): Promise<void> {
    const existingIdentification = await this.userRepository.findOne({
      where: { numeroIdentificacion: createDto.numeroIdentificacion },
    });
    if (existingIdentification) {
      throw new ConflictException(
        'El numero de identificacion ya esta registrado',
      );
    }

    const existingEmail = await this.userRepository.findOne({
      where: { email: createDto.email },
    });
    if (existingEmail) {
      throw new ConflictException('El email ya esta registrado');
    }

    const existingUsername = await this.userRepository.findOne({
      where: { username: createDto.username },
    });
    if (existingUsername) {
      throw new ConflictException('El nombre de usuario ya esta en uso');
    }
  }

  private toResponse(propietario: User): PropietarioResponse {
    const { password, ...response } = propietario;
    void password;
    return response as PropietarioResponse;
  }
}
