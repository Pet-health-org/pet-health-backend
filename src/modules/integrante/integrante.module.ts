import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IntegranteService } from './integrante.service';
import { IntegranteController } from './integrante.controller';
import { Integrante } from './entities/integrante.entity';
import { Invitacion } from './entities/invitacion.entity';
import { EmailModule } from '../email/email.module';

@Module({
  imports: [TypeOrmModule.forFeature([Integrante, Invitacion]), EmailModule],
  controllers: [IntegranteController],
  providers: [IntegranteService],
  exports: [IntegranteService],
})
export class IntegranteModule {}
