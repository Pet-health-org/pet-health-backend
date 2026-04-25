import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UserService } from '../user/user.service';
import { LoginDto } from './dto/auth.dto';
import { JwtPayload } from './interfaces/jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async validateUser(loginDto: LoginDto): Promise<any> {
    const user = await this.userService.validateCredentials(
      loginDto.username,
      loginDto.password,
    );
    if (!user) {
      throw new UnauthorizedException('Credenciales inválidas');
    }
    const { password, ...result } = user;
    return result;
  }

  async login(user: any): Promise<{ access_token: string }> {
    const payload: JwtPayload = {
      sub: user.id,
      username: user.username,
      rol: user.rol,
    };
    const secret = this.configService.get<string>('JWT_SECRET') || 'default_secret';
    const expiresIn = this.configService.get<number>('JWT_EXPIRES_IN') || 604800;
    const token = await this.jwtService.signAsync(payload as any, {
      secret,
      expiresIn,
    });
    return {
      access_token: token,
    };
  }

  async refreshToken(userId: string): Promise<{ access_token: string }> {
    const user = await this.userService.findOne(userId);
    const payload: JwtPayload = {
      sub: user.id,
      username: user.username,
      rol: user.rol.name,
    };
    const secret = this.configService.get<string>('JWT_SECRET') || 'default_secret';
    const expiresIn = this.configService.get<number>('JWT_EXPIRES_IN') || 604800;
    const token = await this.jwtService.signAsync(payload as any, {
      secret,
      expiresIn,
    });
    return {
      access_token: token,
    };
  }
}
