import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VacunacionController } from './vacunacion.controller';
import { VacunacionService } from './vacunacion.service';
import { EsquemaVacunacion } from './entities/esquema-vacunacion.entity';
import { AlertaVacuna } from './entities/alerta-vacuna.entity';
import { Vacuna } from '../vacuna/entities/vacuna.entity';
import { NotificacionModule } from '../notificacion/notificacion.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([EsquemaVacunacion, AlertaVacuna, Vacuna]),
    NotificacionModule,
  ],
  controllers: [VacunacionController],
  providers: [VacunacionService],
  exports: [VacunacionService],
})
export class VacunacionModule {}
