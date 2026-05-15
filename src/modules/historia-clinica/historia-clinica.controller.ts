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
import { HistoriaClinicaService } from './historia-clinica.service';
import {
  CreateHistoriaClinicaDto,
  UpdateHistoriaClinicaDto,
} from './dto/historia-clinica.dto';
import { HistoriaClinica } from './entities/historia-clinica.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { RoleType } from '../rol/entities/rol.entity';

@ApiTags('Historias Clínicas')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller()
export class HistoriaClinicaController {
  constructor(private readonly historiaClinicaService: HistoriaClinicaService) {}

  @Post('historias-clinicas')
  @UseGuards(RolesGuard)
  @Roles(RoleType.ADMIN, RoleType.VETERINARIO)
  @ApiOperation({ summary: 'Crear una nueva historia clínica' })
  @ApiResponse({
    status: 201,
    description: 'Historia clínica creada exitosamente',
    type: HistoriaClinica,
  })
  create(
    @Body() createDto: CreateHistoriaClinicaDto,
  ): Promise<HistoriaClinica> {
    return this.historiaClinicaService.create(createDto);
  }

  @Get('historias-clinicas')
  @ApiOperation({ summary: 'Obtener todas las historias clínicas' })
  @ApiResponse({
    status: 200,
    description: 'Historias clínicas obtenidas exitosamente',
    type: [HistoriaClinica],
  })
  findAll(): Promise<HistoriaClinica[]> {
    return this.historiaClinicaService.findAll();
  }

  @Get('historias-clinicas/mascota/:mascotaId')
  @ApiOperation({ summary: 'Obtener historias clínicas por mascota' })
  @ApiResponse({
    status: 200,
    description: 'Historias clínicas obtenidas exitosamente',
    type: [HistoriaClinica],
  })
  findByMascota(
    @Param('mascotaId', ParseUUIDPipe) mascotaId: string,
  ): Promise<HistoriaClinica[]> {
    return this.historiaClinicaService.findByMascota(mascotaId);
  }

  @Get('historias-clinicas/:id')
  @ApiOperation({ summary: 'Obtener una historia clínica por ID' })
  @ApiResponse({
    status: 200,
    description: 'Historia clínica obtenida exitosamente',
    type: HistoriaClinica,
  })
  @ApiResponse({ status: 404, description: 'Historia clínica no encontrada' })
  findOne(@Param('id', ParseUUIDPipe) id: string): Promise<HistoriaClinica> {
    return this.historiaClinicaService.findOne(id);
  }

  @Patch('historias-clinicas/:id')
  @UseGuards(RolesGuard)
  @Roles(RoleType.ADMIN, RoleType.VETERINARIO)
  @ApiOperation({ summary: 'Actualizar una historia clínica' })
  @ApiResponse({
    status: 200,
    description: 'Historia clínica actualizada exitosamente',
    type: HistoriaClinica,
  })
  @ApiResponse({ status: 404, description: 'Historia clínica no encontrada' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateDto: UpdateHistoriaClinicaDto,
  ): Promise<HistoriaClinica> {
    return this.historiaClinicaService.update(id, updateDto);
  }

  @Delete('historias-clinicas/:id')
  @UseGuards(RolesGuard)
  @Roles(RoleType.ADMIN)
  @ApiOperation({ summary: 'Eliminar una historia clínica' })
  @ApiResponse({
    status: 200,
    description: 'Historia clínica eliminada exitosamente',
  })
  @ApiResponse({ status: 404, description: 'Historia clínica no encontrada' })
  remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.historiaClinicaService.remove(id);
  }
}