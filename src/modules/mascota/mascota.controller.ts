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
import { MascotaService } from './mascota.service';
import { CreateMascotaDto, UpdateMascotaDto } from './dto/mascota.dto';
import { Mascota } from './entities/mascota.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { RoleType } from '../rol/entities/rol.entity';

@ApiTags('Mascotas')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller()
export class MascotaController {
  constructor(private readonly mascotaService: MascotaService) {}

  @Post('mascotas')
  @UseGuards(RolesGuard)
  @Roles(RoleType.ADMIN, RoleType.RECEPCIONISTA, RoleType.PROPIETARIO)
  @ApiOperation({ summary: 'Crear una nueva mascota' })
  @ApiResponse({
    status: 201,
    description: 'Mascota creada exitosamente',
    type: Mascota,
  })
  create(@Body() createDto: CreateMascotaDto): Promise<Mascota> {
    return this.mascotaService.create(createDto);
  }

  @Get('mascotas')
  @ApiOperation({ summary: 'Obtener todas las mascotas' })
  @ApiResponse({
    status: 200,
    description: 'Mascotas obtenidas exitosamente',
    type: [Mascota],
  })
  findAll(): Promise<Mascota[]> {
    return this.mascotaService.findAll();
  }

  @Get('mascotas/propietario/:propietarioId')
  @ApiOperation({ summary: 'Obtener mascotas por propietario' })
  @ApiResponse({
    status: 200,
    description: 'Mascotas obtenidas exitosamente',
    type: [Mascota],
  })
  findByPropietario(
    @Param('propietarioId', ParseUUIDPipe) propietarioId: string,
  ): Promise<Mascota[]> {
    return this.mascotaService.findByPropietario(propietarioId);
  }

  @Get('mascotas/:id')
  @ApiOperation({ summary: 'Obtener una mascota por ID' })
  @ApiResponse({
    status: 200,
    description: 'Mascota obtenida exitosamente',
    type: Mascota,
  })
  @ApiResponse({ status: 404, description: 'Mascota no encontrada' })
  findOne(@Param('id', ParseUUIDPipe) id: string): Promise<Mascota> {
    return this.mascotaService.findOne(id);
  }

  @Patch('mascotas/:id')
  @ApiOperation({ summary: 'Actualizar una mascota' })
  @ApiResponse({
    status: 200,
    description: 'Mascota actualizada exitosamente',
    type: Mascota,
  })
  @ApiResponse({ status: 404, description: 'Mascota no encontrada' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateDto: UpdateMascotaDto,
  ): Promise<Mascota> {
    return this.mascotaService.update(id, updateDto);
  }

  @Delete('mascotas/:id')
  @UseGuards(RolesGuard)
  @Roles(RoleType.ADMIN, RoleType.RECEPCIONISTA)
  @ApiOperation({ summary: 'Eliminar una mascota' })
  @ApiResponse({ status: 200, description: 'Mascota eliminada exitosamente' })
  @ApiResponse({ status: 404, description: 'Mascota no encontrada' })
  remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.mascotaService.remove(id);
  }
}