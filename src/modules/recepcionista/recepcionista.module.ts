import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RecepcionistaController } from './recepcionista.controller';
import { Recepcionista } from './entities/recepcionista.entity';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Recepcionista]),
    UserModule,
  ],
  controllers: [RecepcionistaController],
})
export class RecepcionistaModule {}