import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RazaController } from './raza.controller';
import { RazaService } from './raza.service';
import { Raza } from './entities/raza.entity';
import { EspecieModule } from '../especie/especie.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Raza]),
    EspecieModule,
  ],
  controllers: [RazaController],
  providers: [RazaService],
  exports: [RazaService],
})
export class RazaModule {}