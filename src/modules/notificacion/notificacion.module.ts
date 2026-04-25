import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificacionController } from './notificacion.controller';
import { NotificacionService } from './notificacion.service';
import { Notificacion } from './entities/notificacion.entity';
import { NotificacionCita } from './entities/notificacion-cita.entity';
import { NotificacionInventario } from './entities/notificacion-inventario.entity';
import { UserModule } from '../user/user.module';
import { MascotaModule } from '../mascota/mascota.module';
import { InventarioModule } from '../inventario/inventario.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Notificacion,
      NotificacionCita,
      NotificacionInventario,
    ]),
    UserModule,
    MascotaModule,
    InventarioModule,
  ],
  controllers: [NotificacionController],
  providers: [NotificacionService],
  exports: [NotificacionService],
})
export class NotificacionModule {}
