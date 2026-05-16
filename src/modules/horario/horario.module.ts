import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HorarioService } from './horario.service';
import { Cita } from '../cita/entities/cita.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Cita])],
  providers: [HorarioService],
  exports: [HorarioService],
})
export class HorarioModule {}
