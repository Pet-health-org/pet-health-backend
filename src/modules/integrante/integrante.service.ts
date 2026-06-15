import {
  Injectable,
  BadRequestException,
  ConflictException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThan } from 'typeorm';
import { Invitacion } from './entities/invitacion.entity';
import { Integrante } from './entities/integrante.entity';
import { InviteIntegranteDto } from './dto/invite-integrante.dto';
import { RegisterIntegranteDto } from './dto/register-integrante.dto';
import { EmailService } from '../email/email.service';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';

@Injectable()
export class IntegranteService {
  private readonly logger = new Logger(IntegranteService.name);

  constructor(
    @InjectRepository(Invitacion)
    private readonly invitacionRepository: Repository<Invitacion>,
    @InjectRepository(Integrante)
    private readonly integranteRepository: Repository<Integrante>,
    private readonly emailService: EmailService,
  ) {}

  async invite(
    inviteDto: InviteIntegranteDto,
  ): Promise<{ message: string }> {
    const existingIntegrante = await this.integranteRepository.findOne({
      where: { email: inviteDto.email },
    });
    if (existingIntegrante) {
      throw new ConflictException(
        'El correo ya está registrado como integrante en el sistema',
      );
    }

    const existingInvitacion = await this.invitacionRepository.findOne({
      where: { email: inviteDto.email, expiresAt: MoreThan(new Date()) },
    });
    if (existingInvitacion) {
      throw new ConflictException(
        'Ya existe una invitación activa para este correo',
      );
    }

    const codigo = crypto.randomBytes(4).toString('hex').toUpperCase();

    const invitacion = this.invitacionRepository.create({
      email: inviteDto.email,
      codigo,
      tipoAcceso: inviteDto.tipoAcceso,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
    });

    await this.invitacionRepository.save(invitacion);

    try {
      await this.emailService.enviarCorreo(
        inviteDto.email,
        'invitacion_integrante',
        {
          codigoInvitacion: codigo,
          tipoAcceso: inviteDto.tipoAcceso,
        },
      );
    } catch (error) {
      this.logger.error(
        `No se pudo enviar el correo de invitación a ${inviteDto.email}`,
      );
    }

    return { message: 'Invitación enviada con éxito' };
  }

  async register(registerDto: RegisterIntegranteDto): Promise<Integrante> {
    const { codigo, username, password, nombreCompleto } = registerDto;

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

    const existingUsername = await this.integranteRepository.findOne({
      where: { username },
    });
    if (existingUsername) {
      throw new ConflictException('El nombre de usuario ya está en uso');
    }

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    const integrante = this.integranteRepository.create({
      email: invitacion.email,
      username,
      password: hashedPassword,
      nombreCompleto,
      tipoAcceso: invitacion.tipoAcceso,
      isActive: true,
    });

    await this.integranteRepository.save(integrante);

    await this.invitacionRepository.remove(invitacion);

    return integrante;
  }

  async findAll(): Promise<Integrante[]> {
    return this.integranteRepository.find();
  }
}
