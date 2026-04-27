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
import { VacunaService } from './vacuna.service';
import { CreateVacunaDto, UpdateVacunaDto } from './dto/vacuna.dto';
import { Vacuna } from './entities/vacuna.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { RoleType } from '../rol/entities/rol.entity';

@ApiTags('Vacunas')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller()
export class VacunaController {
  constructor(private readonly VacunaService: VacunaService) {}

  @Post('vacunas')
  @UseGuards(RolesGuard)
  @Roles(RoleType.ADMIN, RoleType.VETERINARIO)
  @ApiOperation({ summary: 'Registrar una nueva vacuna' })
  @ApiResponse({
    status: 201,
    description: 'Vacuna registrada exitosamente',
    type: Vacuna,
  })
  create(@Body() createDto: CreateVacunaDto): Promise<Vacuna> {
    return this.VacunaService.create(createDto);
  }

  @Get('vacunas')
  @ApiOperation({ summary: 'Obtener todas las vacunas' })
  @ApiResponse({
    status: 200,
    description: 'Vacunas obtenidas exitosamente',
    type: [Vacuna],
  })
  findAll(): Promise<Vacuna[]> {
    return this.VacunaService.findAll();
  }

  @Get('vacunas/historia/:historiaClinicaId')
  @ApiOperation({ summary: 'Obtener vacunas por historia clínica' })
  @ApiResponse({
    status: 200,
    description: 'Vacunas obtenidas exitosamente',
    type: [Vacuna],
  })
  findByHistoriaClinica(
    @Param('historiaClinicaId', ParseUUIDPipe) historiaClinicaId: string,
  ): Promise<Vacuna[]> {
    return this.VacunaService.findByHistoriaClinica(historiaClinicaId);
  }

  @Get('vacunas/:id')
  @ApiOperation({ summary: 'Obtener una vacuna por ID' })
  @ApiResponse({
    status: 200,
    description: 'Vacuna obtenida exitosamente',
    type: Vacuna,
  })
  @ApiResponse({ status: 404, description: 'Vacuna no encontrada' })
  findOne(@Param('id', ParseUUIDPipe) id: string): Promise<Vacuna> {
    return this.VacunaService.findOne(id);
  }

  @Patch('vacunas/:id')
  @UseGuards(RolesGuard)
  @Roles(RoleType.ADMIN, RoleType.VETERINARIO)
  @ApiOperation({ summary: 'Actualizar una vacuna' })
  @ApiResponse({
    status: 200,
    description: 'Vacuna actualizada exitosamente',
    type: Vacuna,
  })
  @ApiResponse({ status: 404, description: 'Vacuna no encontrada' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateDto: UpdateVacunaDto,
  ): Promise<Vacuna> {
    return this.VacunaService.update(id, updateDto);
  }

  @Delete('vacunas/:id')
  @UseGuards(RolesGuard)
  @Roles(RoleType.ADMIN)
  @ApiOperation({ summary: 'Eliminar una vacuna' })
  @ApiResponse({ status: 200, description: 'Vacuna eliminada exitosamente' })
  @ApiResponse({ status: 404, description: 'Vacuna no encontrada' })
  remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.VacunaService.remove(id);
  }
}