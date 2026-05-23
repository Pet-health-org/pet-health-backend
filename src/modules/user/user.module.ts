import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { User } from './entities/user.entity';
import { RolModule } from '../rol/rol.module';
import { PropietarioModule } from '../propietario/propietario.module';

@Module({
  imports: [TypeOrmModule.forFeature([User]), RolModule, PropietarioModule],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
