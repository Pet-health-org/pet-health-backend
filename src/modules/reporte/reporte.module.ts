import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReporteController } from './reporte.controller';
import { ReporteService } from './reporte.service';
import { Reporte } from './entities/reporte.entity';
import { UserModule } from '../user/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([Reporte]), UserModule],
  controllers: [ReporteController],
  providers: [ReporteService],
  exports: [ReporteService],
})
export class ReporteModule {}
