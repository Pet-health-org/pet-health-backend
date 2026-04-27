import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PropietarioController } from './propietario.controller';
import { Propietario } from './entities/propietario.entity';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Propietario]),
    UserModule,
  ],
  controllers: [PropietarioController],
})
export class PropietarioModule {}