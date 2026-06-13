import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThan } from 'typeorm';
import { Invitacion, TipoAcceso } from './entities/invitacion.entity';
import { Integrante } from './entities/integrante.entity';
import { InviteIntegranteDto } from './dto/invite-integrante.dto';
import { RegisterIntegranteDto } from './dto/register-integrante.dto';
import { EmailService } from '../email/email.service';
import { User } from '../user/entities/user.entity';
import { Rol, RoleType } from '../rol/entities/rol.entity';
import { HashService } from '../../common/hash.service';
import * as crypto from 'crypto';

@Injectable()
export class IntegranteService {
  constructor(
    @InjectRepository(Invitacion)
    private readonly invitacionRepository: Repository<Invitacion>,
    @InjectRepository(Integrante)
    private readonly integranteRepository: Repository<Integrante>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Rol)
    private readonly rolRepository: Repository<Rol>,
    private readonly emailService: EmailService,
    private readonly hashService: HashService,
  ) {}

  async invite(inviteDto: InviteIntegranteDto): Promise<{ message: string }> {
    // Verificar si el usuario ya existe
    const existingUser = await this.userRepository.findOne({
      where: { email: inviteDto.email },
    });
    if (existingUser) {
      throw new ConflictException('El correo ya está registrado en el sistema');
    }

    // Generar código único
    const codigo = crypto.randomBytes(4).toString('hex').toUpperCase();

    // Crear invitación
    const invitacion = this.invitacionRepository.create({
      email: inviteDto.email,
      codigo,
      tipoAcceso: inviteDto.tipoAcceso,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 horas
    });

    await this.invitacionRepository.save(invitacion);

    // Enviar correo
    await this.emailService.enviarCorreo(
      inviteDto.email,
      'invitacion_integrante',
      {
        codigoInvitacion: codigo,
        tipoAcceso: inviteDto.tipoAcceso,
      },
    );

    return { message: 'Invitación enviada con éxito' };
  }

  async register(registerDto: RegisterIntegranteDto): Promise<Integrante> {
    const { codigo, username, password, nombreCompleto } = registerDto;

    // Buscar invitación válida
    const invitacion = await this.invitacionRepository.findOne({
      where: {
        codigo,
        expiresAt: MoreThan(new Date()),
      },
    });

    if (!invitacion) {
      throw new BadRequestException(
        'El código de invitación es inválido o ha expirado',
      );
    }

    // Verificar si el username ya está en uso
    const existingUsername = await this.userRepository.findOne({
      where: { username },
    });
    if (existingUsername) {
      throw new ConflictException('El nombre de usuario ya está en uso');
    }

    // Obtener el rol correspondiente
    const rolName =
      invitacion.tipoAcceso === TipoAcceso.BACKEND
        ? RoleType.ADMIN
        : RoleType.RECEPCIONISTA;
    const rol = await this.rolRepository.findOne({ where: { name: rolName } });
    if (!rol) {
      throw new NotFoundException(`Rol ${rolName} no encontrado`);
    }

    // Encriptar contraseña
    const hashedPassword = await this.hashService.hash(password);

    // Crear usuario
    const user = this.userRepository.create({
      username,
      email: invitacion.email,
      password: hashedPassword,
      nombreCompleto,
      rol,
      isActive: true,
    });

    await this.userRepository.save(user);

    // Crear integrante
    const integrante = this.integranteRepository.create({
      user,
      tipoAcceso: invitacion.tipoAcceso,
    });
    await this.integranteRepository.save(integrante);

    // Borrar la invitación
    await this.invitacionRepository.remove(invitacion);

    return integrante;
  }

  async findAll(): Promise<Integrante[]> {
    return this.integranteRepository.find({ relations: ['user', 'user.rol'] });
  }
}
