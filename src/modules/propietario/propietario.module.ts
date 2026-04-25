import { Module } from '@nestjs/common';
import { UserModule } from '../user/user.module';
import { PropietarioController } from './propietario.controller';

@Module({
  imports: [UserModule],
  controllers: [PropietarioController],
})
export class PropietarioModule {}
