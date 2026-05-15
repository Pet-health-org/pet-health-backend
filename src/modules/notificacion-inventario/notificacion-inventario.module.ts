import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificacionInventarioController } from './notificacion-inventario.controller';
import { NotificacionInventarioService } from './notificacion-inventario.service';
import { NotificacionInventario } from './entities/notificacion-inventario.entity';
import { InventarioModule } from '../inventario/inventario.module';
import { NotificacionModule } from '../notificacion/notificacion.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([NotificacionInventario]),
    InventarioModule,
    NotificacionModule,
  ],
  controllers: [NotificacionInventarioController],
  providers: [NotificacionInventarioService],
  exports: [NotificacionInventarioService],
})
export class NotificacionInventarioModule {}