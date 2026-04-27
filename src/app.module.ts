import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Rol } from './modules/rol/entities/rol.entity';
import { User } from './modules/user/entities/user.entity';
import { RolModule } from './modules/rol/rol.module';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { AdminModule } from './modules/admin/admin.module';
import { VeterinarioModule } from './modules/veterinario/veterinario.module';
import { RecepcionistaModule } from './modules/recepcionista/recepcionista.module';
import { PropietarioModule } from './modules/propietario/propietario.module';
import { EspecieModule } from './modules/especie/especie.module';
import { RazaModule } from './modules/raza/raza.module';
import { MascotaModule } from './modules/mascota/mascota.module';
import { CitaModule } from './modules/cita/cita.module';
import { HistoriaClinicaModule } from './modules/historia-clinica/historia-clinica.module';
import { VacunaModule } from './modules/vacuna/vacuna.module';
import { MedicamentoModule } from './modules/medicamento/medicamento.module';
import { ProveedorModule } from './modules/proveedor/proveedor.module';
import { InventarioModule } from './modules/inventario/inventario.module';
import { ReporteModule } from './modules/reporte/reporte.module';
import { NotificacionModule } from './modules/notificacion/notificacion.module';
import { NotificacionInventarioModule } from './modules/notificacion-inventario/notificacion-inventario.module';
import { SeederService } from './common/seeder.service';

@Module({
  imports: [
    DatabaseModule,
    TypeOrmModule.forFeature([Rol, User]),
    RolModule,
    UserModule,
    AuthModule,
    AdminModule,
    VeterinarioModule,
    RecepcionistaModule,
    PropietarioModule,
    EspecieModule,
    RazaModule,
    MascotaModule,
    CitaModule,
    HistoriaClinicaModule,
    VacunaModule,
    MedicamentoModule,
    ProveedorModule,
    InventarioModule,
    ReporteModule,
    NotificacionModule,
    NotificacionInventarioModule,
  ],
  controllers: [AppController],
  providers: [AppService, SeederService],
})
export class AppModule {}