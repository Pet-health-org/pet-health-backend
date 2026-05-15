import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PropietarioController } from './propietario.controller';
import { PropietarioService } from './propietario.service';
import { RolModule } from '../rol/rol.module';
import { User } from '../user/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User]), RolModule],
  controllers: [PropietarioController],
  providers: [PropietarioService],
  exports: [PropietarioService],
})
export class PropietarioModule {}
