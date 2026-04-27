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
import { CitaService } from './cita.service';
import { CreateCitaDto, UpdateCitaDto } from './dto/cita.dto';
import { Cita } from './entities/cita.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { RoleType } from '../rol/entities/rol.entity';

@ApiTags('Citas')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller()
export class CitaController {
  constructor(private readonly citaService: CitaService) {}

  @Post('citas')
  @UseGuards(RolesGuard)
  @Roles(RoleType.ADMIN, RoleType.RECEPCIONISTA)
  @ApiOperation({ summary: 'Crear una nueva cita' })
  @ApiResponse({
    status: 201,
    description: 'Cita creada exitosamente',
    type: Cita,
  })
  create(@Body() createDto: CreateCitaDto): Promise<Cita> {
    return this.citaService.create(createDto);
  }

  @Get('citas')
  @ApiOperation({ summary: 'Obtener todas las citas' })
  @ApiResponse({
    status: 200,
    description: 'Citas obtenidas exitosamente',
    type: [Cita],
  })
  findAll(): Promise<Cita[]> {
    return this.citaService.findAll();
  }

  @Get('citas/mascota/:mascotaId')
  @ApiOperation({ summary: 'Obtener citas por mascota' })
  @ApiResponse({
    status: 200,
    description: 'Citas obtenidas exitosamente',
    type: [Cita],
  })
  findByMascota(
    @Param('mascotaId', ParseUUIDPipe) mascotaId: string,
  ): Promise<Cita[]> {
    return this.citaService.findByMascota(mascotaId);
  }

  @Get('citas/veterinario/:veterinarioId')
  @ApiOperation({ summary: 'Obtener citas por veterinario' })
  @ApiResponse({
    status: 200,
    description: 'Citas obtenidas exitosamente',
    type: [Cita],
  })
  findByVeterinario(
    @Param('veterinarioId', ParseUUIDPipe) veterinarioId: string,
  ): Promise<Cita[]> {
    return this.citaService.findByVeterinario(veterinarioId);
  }

  @Get('citas/:id')
  @ApiOperation({ summary: 'Obtener una cita por ID' })
  @ApiResponse({
    status: 200,
    description: 'Cita obtenida exitosamente',
    type: Cita,
  })
  @ApiResponse({ status: 404, description: 'Cita no encontrada' })
  findOne(@Param('id', ParseUUIDPipe) id: string): Promise<Cita> {
    return this.citaService.findOne(id);
  }

  @Patch('citas/:id')
  @ApiOperation({ summary: 'Actualizar una cita' })
  @ApiResponse({
    status: 200,
    description: 'Cita actualizada exitosamente',
    type: Cita,
  })
  @ApiResponse({ status: 404, description: 'Cita no encontrada' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateDto: UpdateCitaDto,
  ): Promise<Cita> {
    return this.citaService.update(id, updateDto);
  }

  @Delete('citas/:id')
  @UseGuards(RolesGuard)
  @Roles(RoleType.ADMIN, RoleType.RECEPCIONISTA)
  @ApiOperation({ summary: 'Eliminar una cita' })
  @ApiResponse({ status: 200, description: 'Cita eliminada exitosamente' })
  @ApiResponse({ status: 404, description: 'Cita no encontrada' })
  remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.citaService.remove(id);
  }
}