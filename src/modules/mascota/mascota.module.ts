import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MascotaController } from './mascota.controller';
import { MascotaService } from './mascota.service';
import { Mascota } from './entities/mascota.entity';
import { UserModule } from '../user/user.module';
import { EspecieModule } from '../especie/especie.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Mascota]),
    UserModule,
    EspecieModule,
  ],
  controllers: [MascotaController],
  providers: [MascotaService],
  exports: [MascotaService],
})
export class MascotaModule {}
