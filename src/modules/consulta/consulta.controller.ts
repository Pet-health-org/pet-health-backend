import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { ConsultaService } from './consulta.service';
import { CreateConsultaDto, ConsultaResponseDto } from './dto/consulta.dto';
import { Consulta } from './entities/consulta.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { RoleType } from '../rol/entities/rol.entity';

@ApiTags('Consultas')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller()
export class ConsultaController {
  constructor(private readonly consultaService: ConsultaService) {}

  @Post('consultas')
  @UseGuards(RolesGuard)
  @Roles(RoleType.ADMIN, RoleType.VETERINARIO)
  @ApiOperation({
    summary: 'Crear una nueva consulta con validación de constantes vitales',
  })
  @ApiResponse({
    status: 201,
    description: 'Consulta creada exitosamente',
    type: Consulta,
  })
  @ApiResponse({
    status: 400,
    description: 'Constantes vitales fuera de rango sin justificación',
  })
  create(@Body() createDto: CreateConsultaDto): Promise<Consulta> {
    return this.consultaService.create(createDto);
  }
}
