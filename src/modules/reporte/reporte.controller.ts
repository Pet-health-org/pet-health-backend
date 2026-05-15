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
import { ReporteService } from './reporte.service';
import { CreateReporteDto, UpdateReporteDto } from './dto/reporte.dto';
import { Reporte } from './entities/reporte.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { RoleType } from '../rol/entities/rol.entity';

@ApiTags('Reportes')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('reportes')
export class ReporteController {
  constructor(private readonly reporteService: ReporteService) {}

  @Post()
  @Roles(RoleType.ADMIN)
  @ApiOperation({ summary: 'Crear un nuevo reporte' })
  @ApiResponse({
    status: 201,
    description: 'Reporte creado exitosamente',
    type: Reporte,
  })
  create(@Body() createDto: CreateReporteDto): Promise<Reporte> {
    return this.reporteService.create(createDto);
  }

  @Get()
  @Roles(RoleType.ADMIN)
  @ApiOperation({ summary: 'Obtener todos los reportes' })
  @ApiResponse({
    status: 200,
    description: 'Reportes obtenidos exitosamente',
    type: [Reporte],
  })
  findAll(): Promise<Reporte[]> {
    return this.reporteService.findAll();
  }

  @Get('tipo/:tipoReporte')
  @Roles(RoleType.ADMIN)
  @ApiOperation({ summary: 'Obtener reportes por tipo' })
  @ApiResponse({
    status: 200,
    description: 'Reportes obtenidos exitosamente',
    type: [Reporte],
  })
  findByTipo(@Param('tipoReporte') tipoReporte: string): Promise<Reporte[]> {
    return this.reporteService.findByTipo(tipoReporte);
  }

  @Get('admin/:adminId')
  @Roles(RoleType.ADMIN)
  @ApiOperation({ summary: 'Obtener reportes por administrador' })
  @ApiResponse({
    status: 200,
    description: 'Reportes obtenidos exitosamente',
    type: [Reporte],
  })
  findByAdmin(
    @Param('adminId', ParseUUIDPipe) adminId: string,
  ): Promise<Reporte[]> {
    return this.reporteService.findByAdmin(adminId);
  }

  @Get(':id')
  @Roles(RoleType.ADMIN)
  @ApiOperation({ summary: 'Obtener un reporte por ID' })
  @ApiResponse({
    status: 200,
    description: 'Reporte obtenido exitosamente',
    type: Reporte,
  })
  @ApiResponse({ status: 404, description: 'Reporte no encontrado' })
  findOne(@Param('id', ParseUUIDPipe) id: string): Promise<Reporte> {
    return this.reporteService.findOne(id);
  }

  @Patch(':id')
  @Roles(RoleType.ADMIN)
  @ApiOperation({ summary: 'Actualizar un reporte' })
  @ApiResponse({
    status: 200,
    description: 'Reporte actualizado exitosamente',
    type: Reporte,
  })
  @ApiResponse({ status: 404, description: 'Reporte no encontrado' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateDto: UpdateReporteDto,
  ): Promise<Reporte> {
    return this.reporteService.update(id, updateDto);
  }

  @Delete(':id')
  @Roles(RoleType.ADMIN)
  @ApiOperation({ summary: 'Eliminar un reporte' })
  @ApiResponse({ status: 200, description: 'Reporte eliminado exitosamente' })
  @ApiResponse({ status: 404, description: 'Reporte no encontrado' })
  remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.reporteService.remove(id);
  }
}
