import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InventarioController } from './inventario.controller';
import { InventarioService } from './inventario.service';
import { Inventario } from './entities/inventario.entity';
import { ProveedorModule } from '../proveedor/proveedor.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Inventario]),
    ProveedorModule,
  ],
  controllers: [InventarioController],
  providers: [InventarioService],
  exports: [InventarioService],
})
export class InventarioModule {}
