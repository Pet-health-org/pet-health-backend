import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { JwtPayload } from '../interfaces/jwt-payload.interface';
import { UserService } from '../../user/user.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UserService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET') || 'default_secret',
    });
  }

  async validate(payload: JwtPayload): Promise<any> {
    const user = await this.userService.findOne(payload.sub);
    if (!user || user.status !== 'activo') {
      throw new UnauthorizedException('Usuario no autorizado');
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
