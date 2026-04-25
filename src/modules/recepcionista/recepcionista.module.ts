import { Module } from '@nestjs/common';
import { UserModule } from '../user/user.module';
import { RecepcionistaController } from './recepcionista.controller';

@Module({
  imports: [UserModule],
  controllers: [RecepcionistaController],
})
export class RecepcionistaModule {}
