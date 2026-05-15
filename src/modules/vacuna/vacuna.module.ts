import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VacunaController } from './vacuna.controller';
import { VacunaService } from './vacuna.service';
import { Vacuna } from './entities/vacuna.entity';
import { HistoriaClinicaModule } from '../historia-clinica/historia-clinica.module';
import { InventarioModule } from '../inventario/inventario.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Vacuna]),
    HistoriaClinicaModule,
    InventarioModule,
  ],
  controllers: [VacunaController],
  providers: [VacunaService],
  exports: [VacunaService],
})
export class VacunaModule {}