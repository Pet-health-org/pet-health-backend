import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { NotificacionController } from './notificacion.controller';
import { NotificacionService } from './notificacion.service';
import { Notificacion } from './entities/notificacion.entity';
import { Propietario } from '../propietario/entities/propietario.entity';
import { EmailModule } from '../email/email.module';
import { UserModule } from '../user/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([Notificacion, Propietario]), UserModule, ConfigModule, EmailModule],
  controllers: [NotificacionController],
  providers: [NotificacionService],
  exports: [NotificacionService],
})
export class NotificacionModule {}
