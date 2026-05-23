import { Module } from '@nestjs/common';
import { VeterinarioController } from './veterinario.controller';
import { UserModule } from '../user/user.module';
import { HorarioModule } from '../horario/horario.module';

@Module({
  imports: [UserModule, HorarioModule],
  controllers: [VeterinarioController],
})
export class VeterinarioModule {}
