import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VeterinarioController } from './veterinario.controller';
import { Veterinario } from './entities/veterinario.entity';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Veterinario]),
    UserModule,
  ],
  controllers: [VeterinarioController],
})
export class VeterinarioModule {}