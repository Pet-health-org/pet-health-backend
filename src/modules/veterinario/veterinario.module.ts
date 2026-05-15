import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VeterinarioController } from './veterinario.controller';
import { Veterinario } from './entities/veterinario.entity';
import { UserModule } from '../user/user.module';
import { CitaModule } from '../cita/cita.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Veterinario]),
    UserModule,
    CitaModule,
  ],
  controllers: [VeterinarioController],
})
export class VeterinarioModule {}