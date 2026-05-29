import { Module } from '@nestjs/common';
import { VeterinarioController } from './veterinario.controller';
import { VeterinarioService } from './veterinario.service';
import { UserModule } from '../user/user.module';
import { HorarioModule } from '../horario/horario.module';

@Module({
  imports: [UserModule, HorarioModule],
  controllers: [VeterinarioController],
  providers: [VeterinarioService],
})
export class VeterinarioModule {}
