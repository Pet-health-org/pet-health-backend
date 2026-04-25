import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { UserService } from '../../user/user.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly userService: UserService) {
    super({
      usernameField: 'username',
      passwordField: 'password',
    });
  }

  async validate(username: string, password: string): Promise<any> {
    const user = await this.userService.validateCredentials(username, password);
    if (!user) {
      throw new UnauthorizedException('Credenciales inválidas');
    }
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
}
