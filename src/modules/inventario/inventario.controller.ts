import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { InventarioService } from './inventario.service';
import { CreateInventarioDto, UpdateInventarioDto } from './dto/inventario.dto';
import { Inventario } from './entities/inventario.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { RoleType } from '../rol/entities/rol.entity';

@ApiTags('Inventario')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller()
export class InventarioController {
  constructor(private readonly inventarioService: InventarioService) {}

  @Post('inventario')
  @UseGuards(RolesGuard)
  @Roles(RoleType.ADMIN, RoleType.RECEPCIONISTA)
  @ApiOperation({ summary: 'Crear un nuevo producto en inventario' })
  @ApiResponse({
    status: 201,
    description: 'Producto creado exitosamente',
    type: Inventario,
  })
  create(@Body() createDto: CreateInventarioDto): Promise<Inventario> {
    return this.inventarioService.create(createDto);
  }

  @Get('inventario')
  @ApiOperation({ summary: 'Obtener todo el inventario' })
  @ApiResponse({
    status: 200,
    description: 'Inventario obtenido exitosamente',
    type: [Inventario],
  })
  findAll(): Promise<Inventario[]> {
    return this.inventarioService.findAll();
  }

  @Get('inventario/bajo-stock')
  @ApiOperation({ summary: 'Obtener productos con stock bajo' })
  @ApiResponse({
    status: 200,
    description: 'Productos obtenidos exitosamente',
    type: [Inventario],
  })
  findBajoStock(): Promise<Inventario[]> {
    return this.inventarioService.findBajoStock();
  }

  @Get('inventario/proveedor/:proveedorId')
  @ApiOperation({ summary: 'Obtener inventario por proveedor' })
  @ApiResponse({
    status: 200,
    description: 'Inventario obtenido exitosamente',
    type: [Inventario],
  })
  findByProveedor(
    @Param('proveedorId', ParseUUIDPipe) proveedorId: string,
  ): Promise<Inventario[]> {
    return this.inventarioService.findByProveedor(proveedorId);
  }

  @Get('inventario/tipo/:tipo')
  @ApiOperation({ summary: 'Obtener inventario por tipo' })
  @ApiResponse({
    status: 200,
    description: 'Inventario obtenido exitosamente',
    type: [Inventario],
  })
  findByTipo(@Param('tipo') tipo: string): Promise<Inventario[]> {
    return this.inventarioService.findByTipo(tipo);
  }

  @Get('inventario/:id')
  @ApiOperation({ summary: 'Obtener un producto por ID' })
  @ApiResponse({
    status: 200,
    description: 'Producto obtenido exitosamente',
    type: Inventario,
  })
  @ApiResponse({ status: 404, description: 'Producto no encontrado' })
  findOne(@Param('id', ParseUUIDPipe) id: string): Promise<Inventario> {
    return this.inventarioService.findOne(id);
  }

  @Patch('inventario/:id')
  @UseGuards(RolesGuard)
  @Roles(RoleType.ADMIN, RoleType.RECEPCIONISTA)
  @ApiOperation({ summary: 'Actualizar un producto' })
  @ApiResponse({
    status: 200,
    description: 'Producto actualizado exitosamente',
    type: Inventario,
  })
  @ApiResponse({ status: 404, description: 'Producto no encontrado' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateDto: UpdateInventarioDto,
  ): Promise<Inventario> {
    return this.inventarioService.update(id, updateDto);
  }

  @Patch('inventario/:id/stock')
  @UseGuards(RolesGuard)
  @Roles(RoleType.ADMIN, RoleType.RECEPCIONISTA)
  @ApiOperation({ summary: 'Actualizar stock de un producto' })
  @ApiResponse({
    status: 200,
    description: 'Stock actualizado exitosamente',
    type: Inventario,
  })
  updateStock(
    @Param('id', ParseUUIDPipe) id: string,
    @Body('stockActual') stockActual: number,
  ): Promise<Inventario> {
    return this.inventarioService.updateStock(id, stockActual);
  }

  @Delete('inventario/:id')
  @UseGuards(RolesGuard)
  @Roles(RoleType.ADMIN)
  @ApiOperation({ summary: 'Eliminar un producto' })
  @ApiResponse({ status: 200, description: 'Producto eliminado exitosamente' })
  @ApiResponse({ status: 404, description: 'Producto no encontrado' })
  remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.inventarioService.remove(id);
  }
}