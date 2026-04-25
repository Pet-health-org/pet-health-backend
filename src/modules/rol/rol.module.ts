import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RolController } from './rol.controller';
import { RolService } from './rol.service';
import { Rol } from './entities/rol.entity';
import { User } from '../user/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Rol, User])],
  controllers: [RolController],
  providers: [RolService],
  exports: [RolService],
})
export class RolModule {}
