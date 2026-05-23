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
import { MedicamentoService } from './medicamento.service';
import {
  CreateMedicamentoDto,
  UpdateMedicamentoDto,
} from './dto/medicamento.dto';
import { Medicamento } from './entities/medicamento.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { RoleType } from '../rol/entities/rol.entity';

@ApiTags('Medicamentos')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller()
export class MedicamentoController {
  constructor(private readonly medicamentoService: MedicamentoService) {}

  @Post('medicamentos')
  @UseGuards(RolesGuard)
  @Roles(RoleType.ADMIN, RoleType.VETERINARIO)
  @ApiOperation({ summary: 'Registrar un nuevo medicamento' })
  @ApiResponse({
    status: 201,
    description: 'Medicamento registrado exitosamente',
    type: Medicamento,
  })
  create(@Body() createDto: CreateMedicamentoDto): Promise<Medicamento> {
    return this.medicamentoService.create(createDto);
  }

  @Get('medicamentos')
  @ApiOperation({ summary: 'Obtener todos los medicamentos' })
  @ApiResponse({
    status: 200,
    description: 'Medicamentos obtenidos exitosamente',
    type: [Medicamento],
  })
  findAll(): Promise<Medicamento[]> {
    return this.medicamentoService.findAll();
  }

  @Get('medicamentos/historia/:historiaClinicaId')
  @ApiOperation({ summary: 'Obtener medicamentos por historia clínica' })
  @ApiResponse({
    status: 200,
    description: 'Medicamentos obtenidos exitosamente',
    type: [Medicamento],
  })
  findByHistoriaClinica(
    @Param('historiaClinicaId', ParseUUIDPipe) historiaClinicaId: string,
  ): Promise<Medicamento[]> {
    return this.medicamentoService.findByHistoriaClinica(historiaClinicaId);
  }

  @Get('medicamentos/:id')
  @ApiOperation({ summary: 'Obtener un medicamento por ID' })
  @ApiResponse({
    status: 200,
    description: 'Medicamento obtenido exitosamente',
    type: Medicamento,
  })
  @ApiResponse({ status: 404, description: 'Medicamento no encontrado' })
  findOne(@Param('id', ParseUUIDPipe) id: string): Promise<Medicamento> {
    return this.medicamentoService.findOne(id);
  }

  @Patch('medicamentos/:id')
  @UseGuards(RolesGuard)
  @Roles(RoleType.ADMIN, RoleType.VETERINARIO)
  @ApiOperation({ summary: 'Actualizar un medicamento' })
  @ApiResponse({
    status: 200,
    description: 'Medicamento actualizado exitosamente',
    type: Medicamento,
  })
  @ApiResponse({ status: 404, description: 'Medicamento no encontrado' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateDto: UpdateMedicamentoDto,
  ): Promise<Medicamento> {
    return this.medicamentoService.update(id, updateDto);
  }

  @Delete('medicamentos/:id')
  @UseGuards(RolesGuard)
  @Roles(RoleType.ADMIN)
  @ApiOperation({ summary: 'Eliminar un medicamento' })
  @ApiResponse({
    status: 200,
    description: 'Medicamento eliminado exitosamente',
  })
  @ApiResponse({ status: 404, description: 'Medicamento no encontrado' })
  remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.medicamentoService.remove(id);
  }
}