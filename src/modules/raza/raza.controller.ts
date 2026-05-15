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
import { RazaService } from './raza.service';
import { CreateRazaDto, UpdateRazaDto } from './dto/raza.dto';
import { Raza } from './entities/raza.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { RoleType } from '../rol/entities/rol.entity';

@ApiTags('Razas')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller()
export class RazaController {
  constructor(private readonly razaService: RazaService) {}

  @Post('razas')
  @UseGuards(RolesGuard)
  @Roles(RoleType.ADMIN)
  @ApiOperation({ summary: 'Crear una nueva raza' })
  @ApiResponse({
    status: 201,
    description: 'Raza creada exitosamente',
    type: Raza,
  })
  create(@Body() createDto: CreateRazaDto): Promise<Raza> {
    return this.razaService.create(createDto);
  }

  @Get('razas')
  @ApiOperation({ summary: 'Obtener todas las razas' })
  @ApiResponse({
    status: 200,
    description: 'Razas obtenidas exitosamente',
    type: [Raza],
  })
  findAll(): Promise<Raza[]> {
    return this.razaService.findAll();
  }

  @Get('razas/especie/:especieId')
  @ApiOperation({ summary: 'Obtener razas por especie' })
  @ApiResponse({
    status: 200,
    description: 'Razas obtenidas exitosamente',
    type: [Raza],
  })
  findByEspecie(
    @Param('especieId', ParseUUIDPipe) especieId: string,
  ): Promise<Raza[]> {
    return this.razaService.findByEspecie(especieId);
  }

  @Get('razas/:id')
  @ApiOperation({ summary: 'Obtener una raza por ID' })
  @ApiResponse({
    status: 200,
    description: 'Raza obtenida exitosamente',
    type: Raza,
  })
  @ApiResponse({ status: 404, description: 'Raza no encontrada' })
  findOne(@Param('id', ParseUUIDPipe) id: string): Promise<Raza> {
    return this.razaService.findOne(id);
  }

  @Patch('razas/:id')
  @UseGuards(RolesGuard)
  @Roles(RoleType.ADMIN)
  @ApiOperation({ summary: 'Actualizar una raza' })
  @ApiResponse({
    status: 200,
    description: 'Raza actualizada exitosamente',
    type: Raza,
  })
  @ApiResponse({ status: 404, description: 'Raza no encontrada' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateDto: UpdateRazaDto,
  ): Promise<Raza> {
    return this.razaService.update(id, updateDto);
  }

  @Delete('razas/:id')
  @UseGuards(RolesGuard)
  @Roles(RoleType.ADMIN)
  @ApiOperation({ summary: 'Eliminar una raza' })
  @ApiResponse({ status: 200, description: 'Raza eliminada exitosamente' })
  @ApiResponse({ status: 404, description: 'Raza no encontrada' })
  remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.razaService.remove(id);
  }
}