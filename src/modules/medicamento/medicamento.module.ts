import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MedicamentoController } from './medicamento.controller';
import { MedicamentoService } from './medicamento.service';
import { Medicamento } from './entities/medicamento.entity';
import { HistoriaClinicaModule } from '../historia-clinica/historia-clinica.module';
import { InventarioModule } from '../inventario/inventario.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Medicamento]),
    HistoriaClinicaModule,
    InventarioModule,
  ],
  controllers: [MedicamentoController],
  providers: [MedicamentoService],
  exports: [MedicamentoService],
})
export class MedicamentoModule {}