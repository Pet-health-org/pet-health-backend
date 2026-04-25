import { Module } from '@nestjs/common';
import { UserModule } from '../user/user.module';
import { VeterinarioController } from './veterinario.controller';

@Module({
  imports: [UserModule],
  controllers: [VeterinarioController],
})
export class VeterinarioModule {}
