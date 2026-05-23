import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CitaController } from './cita.controller';
import { CitaService } from './cita.service';
import { Cita } from './entities/cita.entity';
import { MascotaModule } from '../mascota/mascota.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Cita]),
    MascotaModule,
  ],
  controllers: [CitaController],
  providers: [CitaService],
  exports: [CitaService],
})
export class CitaModule {}