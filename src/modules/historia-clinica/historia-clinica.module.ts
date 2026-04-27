import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HistoriaClinicaController } from './historia-clinica.controller';
import { HistoriaClinicaService } from './historia-clinica.service';
import { HistoriaClinica } from './entities/historia-clinica.entity';
import { MascotaModule } from '../mascota/mascota.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([HistoriaClinica]),
    MascotaModule,
  ],
  controllers: [HistoriaClinicaController],
  providers: [HistoriaClinicaService],
  exports: [HistoriaClinicaService],
})
export class HistoriaClinicaModule {}