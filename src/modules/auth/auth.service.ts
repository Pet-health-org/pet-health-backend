import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UserService } from '../user/user.service';
import { LoginDto } from './dto/auth.dto';
import { JwtPayload } from './interfaces/jwt-payload.interface';

interface AuthUser {
  id: string;
  username: string;
  email: string;
  rol: string;
  rolId: string;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async validateUser(loginDto: LoginDto): Promise<AuthUser> {
    const user = await this.userService.validateCredentials(
      loginDto.username,
      loginDto.password,
    );
    if (!user) {
      throw new UnauthorizedException('Credenciales inválidas');
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
    const user = await this.userService.findOne(userId);
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
      expiresIn: expiresIn || 604800,
    });
  }
}
