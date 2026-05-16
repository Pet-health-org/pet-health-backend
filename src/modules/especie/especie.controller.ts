import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Put,
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
import { EspecieService } from './especie.service';
import { CreateEspecieDto, UpdateEspecieDto } from './dto/especie.dto';
import { ConstantesVitalesDto } from './dto/constantes-vitales.dto';
import { Especie } from './entities/especie.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { RoleType } from '../rol/entities/rol.entity';

@ApiTags('Especies')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller()
export class EspecieController {
  constructor(private readonly especieService: EspecieService) {}

  @Post('especies')
  @UseGuards(RolesGuard)
  @Roles(RoleType.ADMIN)
  @ApiOperation({ summary: 'Crear una nueva especie' })
  @ApiResponse({
    status: 201,
    description: 'Especie creada exitosamente',
    type: Especie,
  })
  create(@Body() createDto: CreateEspecieDto): Promise<Especie> {
    return this.especieService.create(createDto);
  }

  @Get('especies')
  @ApiOperation({ summary: 'Obtener todas las especies' })
  @ApiResponse({
    status: 200,
    description: 'Especies obtenidas exitosamente',
    type: [Especie],
  })
  findAll(): Promise<Especie[]> {
    return this.especieService.findAll();
  }

  @Get('especies/:id')
  @ApiOperation({ summary: 'Obtener una especie por ID' })
  @ApiResponse({
    status: 200,
    description: 'Especie obtenida exitosamente',
    type: Especie,
  })
  @ApiResponse({ status: 404, description: 'Especie no encontrada' })
  findOne(@Param('id', ParseUUIDPipe) id: string): Promise<Especie> {
    return this.especieService.findOne(id);
  }

  @Get('especies/:especieId/constantes')
  @ApiOperation({
    summary: 'Obtener rangos de constantes vitales de una especie',
  })
  @ApiResponse({
    status: 200,
    description: 'Rangos de constantes vitales obtenidos exitosamente',
    type: ConstantesVitalesDto,
  })
  @ApiResponse({ status: 404, description: 'Especie no encontrada' })
  getConstantes(
    @Param('especieId', ParseUUIDPipe) especieId: string,
  ): Promise<ConstantesVitalesDto> {
    return this.especieService.getConstantes(especieId);
  }

  @Put('especies/:especieId/constantes')
  @UseGuards(RolesGuard)
  @Roles(RoleType.ADMIN)
  @ApiOperation({
    summary: 'Actualizar rangos de constantes vitales de una especie',
  })
  @ApiResponse({
    status: 200,
    description: 'Rangos de constantes vitales actualizados exitosamente',
    type: ConstantesVitalesDto,
  })
  @ApiResponse({ status: 404, description: 'Especie no encontrada' })
  updateConstantes(
    @Param('especieId', ParseUUIDPipe) especieId: string,
    @Body() constantesDto: ConstantesVitalesDto,
  ): Promise<ConstantesVitalesDto> {
    return this.especieService.updateConstantes(especieId, constantesDto);
  }

  @Patch('especies/:id')
  @UseGuards(RolesGuard)
  @Roles(RoleType.ADMIN)
  @ApiOperation({ summary: 'Actualizar una especie' })
  @ApiResponse({
    status: 200,
    description: 'Especie actualizada exitosamente',
    type: Especie,
  })
  @ApiResponse({ status: 404, description: 'Especie no encontrada' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateDto: UpdateEspecieDto,
  ): Promise<Especie> {
    return this.especieService.update(id, updateDto);
  }

  @Delete('especies/:id')
  @UseGuards(RolesGuard)
  @Roles(RoleType.ADMIN)
  @ApiOperation({ summary: 'Eliminar una especie' })
  @ApiResponse({ status: 200, description: 'Especie eliminada exitosamente' })
  @ApiResponse({ status: 404, description: 'Especie no encontrada' })
  remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.especieService.remove(id);
  }
}
