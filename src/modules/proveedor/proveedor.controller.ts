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
import { ProveedorService } from './proveedor.service';
import { CreateProveedorDto, UpdateProveedorDto } from './dto/proveedor.dto';
import { Proveedor } from './entities/proveedor.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { RoleType } from '../rol/entities/rol.entity';

@ApiTags('Proveedores')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller()
export class ProveedorController {
  constructor(private readonly proveedorService: ProveedorService) {}

  @Post('proveedores')
  @UseGuards(RolesGuard)
  @Roles(RoleType.ADMIN)
  @ApiOperation({ summary: 'Crear un nuevo proveedor' })
  @ApiResponse({
    status: 201,
    description: 'Proveedor creado exitosamente',
    type: Proveedor,
  })
  create(@Body() createDto: CreateProveedorDto): Promise<Proveedor> {
    return this.proveedorService.create(createDto);
  }

  @Get('proveedores')
  @ApiOperation({ summary: 'Obtener todos los proveedores' })
  @ApiResponse({
    status: 200,
    description: 'Proveedores obtenidos exitosamente',
    type: [Proveedor],
  })
  findAll(): Promise<Proveedor[]> {
    return this.proveedorService.findAll();
  }

  @Get('proveedores/:id')
  @ApiOperation({ summary: 'Obtener un proveedor por ID' })
  @ApiResponse({
    status: 200,
    description: 'Proveedor obtenido exitosamente',
    type: Proveedor,
  })
  @ApiResponse({ status: 404, description: 'Proveedor no encontrado' })
  findOne(@Param('id', ParseUUIDPipe) id: string): Promise<Proveedor> {
    return this.proveedorService.findOne(id);
  }

  @Patch('proveedores/:id')
  @UseGuards(RolesGuard)
  @Roles(RoleType.ADMIN)
  @ApiOperation({ summary: 'Actualizar un proveedor' })
  @ApiResponse({
    status: 200,
    description: 'Proveedor actualizado exitosamente',
    type: Proveedor,
  })
  @ApiResponse({ status: 404, description: 'Proveedor no encontrado' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateDto: UpdateProveedorDto,
  ): Promise<Proveedor> {
    return this.proveedorService.update(id, updateDto);
  }

  @Delete('proveedores/:id')
  @UseGuards(RolesGuard)
  @Roles(RoleType.ADMIN)
  @ApiOperation({ summary: 'Eliminar un proveedor' })
  @ApiResponse({ status: 200, description: 'Proveedor eliminado exitosamente' })
  @ApiResponse({ status: 404, description: 'Proveedor no encontrado' })
  remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.proveedorService.remove(id);
  }
}