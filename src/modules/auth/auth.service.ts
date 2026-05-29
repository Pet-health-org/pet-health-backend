import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserService } from '../user/user.service';
import { User } from '../user/entities/user.entity';
import { LoginDto } from './dto/auth.dto';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import type { IUserAuth, IUserReader } from '../../common/interfaces/iuser-service.interface';

const MAX_INTENTOS = 3;
const BLOQUEO_MINUTOS = 15;

interface AuthUser {
  id: string;
  username: string;
  email: string;
  rol: string;
  rolId: string;
}

@Injectable()
export class AuthService {
  private readonly userAuth: IUserAuth;
  private readonly userReader: IUserReader;

  constructor(
    userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {
    this.userAuth = userService;
    this.userReader = userService;
  }

  async validateUser(loginDto: LoginDto): Promise<AuthUser> {
    const user = await this.userAuth.findForAuth(loginDto.username);
    if (!user) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    if (user.bloqueadoHasta && new Date() < new Date(user.bloqueadoHasta)) {
      const minutosRestantes = Math.ceil(
        (new Date(user.bloqueadoHasta).getTime() - Date.now()) / 60000,
      );
      throw new UnauthorizedException(
        `Cuenta bloqueada. Intente nuevamente en ${minutosRestantes} minuto(s)`,
      );
    }

    const isValid = await this.userAuth.comparePassword(
      loginDto.password,
      user.password,
    );

    if (!isValid) {
      const nuevosIntentos = (user.intentosFallidos || 0) + 1;
      if (nuevosIntentos >= MAX_INTENTOS) {
        const bloqueoHasta = new Date(Date.now() + BLOQUEO_MINUTOS * 60 * 1000);
        await this.userRepository.update(user.id, {
          intentosFallidos: nuevosIntentos,
          bloqueadoHasta: bloqueoHasta,
        });
        throw new UnauthorizedException(
          'Cuenta bloqueada temporalmente por 15 minutos por múltiples intentos fallidos',
        );
      } else {
        await this.userRepository.update(user.id, {
          intentosFallidos: nuevosIntentos,
        });
        throw new UnauthorizedException('Credenciales inválidas');
      }
    }

    await this.userRepository.update(user.id, {
      intentosFallidos: 0,
      bloqueadoHasta: null,
    });

    if (user.status !== 'activo') {
      throw new UnauthorizedException('Usuario inactivo o bloqueado');
    }

    return {
      id: user.id,
      username: user.username,
      email: user.email,
      rol: user.rol.name,
      rolId: user.rol.id,
    };
  }

  async login(user: AuthUser): Promise<{ access_token: string }> {
    const payload: JwtPayload = {
      sub: user.id,
      username: user.username,
      rol: user.rol,
    };
    const token = await this.generarToken(payload);
    return { access_token: token };
  }

  async refreshToken(userId: string): Promise<{ access_token: string }> {
    const user = await this.userReader.findOne(userId);
    const payload: JwtPayload = {
      sub: user.id,
      username: user.username,
      rol: user.rol.name,
    };
    const token = await this.generarToken(payload);
    return { access_token: token };
  }

  private async generarToken(payload: JwtPayload): Promise<string> {
    const secret = this.configService.get<string>('jwt.secret');
    const expiresIn = this.configService.get<number>('jwt.expiresIn');

    if (!secret) {
      throw new Error(
        'JWT_SECRET no está configurado en las variables de entorno',
      );
    }

    return await this.jwtService.signAsync(payload, {
      secret,
      expiresIn: expiresIn || 1800,
    });
  }
}
