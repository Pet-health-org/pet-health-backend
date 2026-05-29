import { Module } from '@nestjs/common';
import { RecepcionistaController } from './recepcionista.controller';
import { RecepcionistaService } from './recepcionista.service';
import { UserModule } from '../user/user.module';

@Module({
  imports: [UserModule],
  controllers: [RecepcionistaController],
  providers: [RecepcionistaService],
})
export class RecepcionistaModule {}
