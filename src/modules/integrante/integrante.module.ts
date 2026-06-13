import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IntegranteService } from './integrante.service';
import { IntegranteController } from './integrante.controller';
import { Integrante } from './entities/integrante.entity';
import { Invitacion } from './entities/invitacion.entity';
import { EmailModule } from '../email/email.module';
import { UserModule } from '../user/user.module';
import { RolModule } from '../rol/rol.module';
import { SharedModule } from '../../common/shared.module';
import { User } from '../user/entities/user.entity';
import { Rol } from '../rol/entities/rol.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Integrante, Invitacion, User, Rol]),
    EmailModule,
    UserModule,
    RolModule,
    SharedModule,
  ],
  controllers: [IntegranteController],
  providers: [IntegranteService],
  exports: [IntegranteService],
})
export class IntegranteModule {}
