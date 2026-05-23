import {
  Body,
  Controller,
  Get,
  ParseIntPipe,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import {
  VacunacionService,
  EsquemaVacunacionResponse,
} from './vacunacion.service';
import { CreateEsquemaVacunacionDto } from './dto/esquema-vacunacion.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { RoleType } from '../rol/entities/rol.entity';

@ApiTags('Vacunacion')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('vacunacion')
export class VacunacionController {
  constructor(private readonly vacunacionService: VacunacionService) {}

  @Post('esquemas')
  @UseGuards(RolesGuard)
  @Roles(RoleType.ADMIN)
  @ApiOperation({ summary: 'Crear esquemas de vacunacion por especie' })
  @ApiResponse({ status: 201, description: 'Esquema creado exitosamente' })
  createEsquema(
    @Body() createDto: CreateEsquemaVacunacionDto,
  ): Promise<EsquemaVacunacionResponse> {
    return this.vacunacionService.createEsquema(createDto);
  }

  @Get('esquemas/:especie')
  @ApiOperation({ summary: 'Obtener esquema de vacunacion por especie' })
  @ApiQuery({ name: 'edadMeses', required: false })
  @ApiQuery({ name: 'edadMinimaMeses', required: false })
  @ApiQuery({ name: 'edadMaximaMeses', required: false })
  @ApiResponse({ status: 200, description: 'Esquema obtenido exitosamente' })
  @ApiResponse({ status: 404, description: 'Esquema no encontrado' })
  findEsquema(
    @Param('especie') especie: string,
    @Query('edadMeses', new ParseIntPipe({ optional: true }))
    edadMeses?: number,
    @Query('edadMinimaMeses', new ParseIntPipe({ optional: true }))
    edadMinimaMeses?: number,
    @Query('edadMaximaMeses', new ParseIntPipe({ optional: true }))
    edadMaximaMeses?: number,
  ): Promise<EsquemaVacunacionResponse> {
    return this.vacunacionService.findEsquema(
      especie,
      edadMeses,
      edadMinimaMeses,
      edadMaximaMeses,
    );
  }
}
