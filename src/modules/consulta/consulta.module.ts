import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConsultaController } from './consulta.controller';
import { ConsultaService } from './consulta.service';
import { Consulta } from './entities/consulta.entity';
import { MascotaModule } from '../mascota/mascota.module';
import { RazaModule } from '../raza/raza.module';
import { EspecieModule } from '../especie/especie.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Consulta]),
    MascotaModule,
    RazaModule,
    EspecieModule,
  ],
  controllers: [ConsultaController],
  providers: [ConsultaService],
  exports: [ConsultaService],
})
export class ConsultaModule {}
