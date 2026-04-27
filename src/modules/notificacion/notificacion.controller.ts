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
import { NotificacionService } from './notificacion.service';
import { CreateNotificacionDto, UpdateNotificacionDto } from './dto/notificacion.dto';
import { Notificacion } from './entities/notificacion.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { RoleType } from '../rol/entities/rol.entity';

@ApiTags('Notificaciones')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller()
export class NotificacionController {
  constructor(private readonly notificacionService: NotificacionService) {}

  @Post('notificaciones')
  @UseGuards(RolesGuard)
  @Roles(RoleType.ADMIN, RoleType.RECEPCIONISTA, RoleType.VETERINARIO)
  @ApiOperation({ summary: 'Crear una nueva notificacion' })
  @ApiResponse({
    status: 201,
    description: 'Notificacion creada exitosamente',
    type: Notificacion,
  })
  create(@Body() createDto: CreateNotificacionDto): Promise<Notificacion> {
    return this.notificacionService.create(createDto);
  }

  @Get('notificaciones')
  @ApiOperation({ summary: 'Obtener todas las notificaciones' })
  @ApiResponse({
    status: 200,
    description: 'Notificaciones obtenidas exitosamente',
    type: [Notificacion],
  })
  findAll(): Promise<Notificacion[]> {
    return this.notificacionService.findAll();
  }

  @Get('notificaciones/usuario/:usuarioId')
  @ApiOperation({ summary: 'Obtener notificaciones por usuario' })
  @ApiResponse({
    status: 200,
    description: 'Notificaciones obtenidas exitosamente',
    type: [Notificacion],
  })
  findByUsuario(
    @Param('usuarioId', ParseUUIDPipe) usuarioId: string,
  ): Promise<Notificacion[]> {
    return this.notificacionService.findByUsuario(usuarioId);
  }

  @Get('notificaciones/estado/:estado')
  @ApiOperation({ summary: 'Obtener notificaciones por estado' })
  @ApiResponse({
    status: 200,
    description: 'Notificaciones obtenidas exitosamente',
    type: [Notificacion],
  })
  findByEstado(
    @Param('estado') estado: string,
  ): Promise<Notificacion[]> {
    return this.notificacionService.findByEstado(estado);
  }

  @Get('notificaciones/:id')
  @ApiOperation({ summary: 'Obtener una notificacion por ID' })
  @ApiResponse({
    status: 200,
    description: 'Notificacion obtenida exitosamente',
    type: Notificacion,
  })
  @ApiResponse({ status: 404, description: 'Notificacion no encontrada' })
  findOne(@Param('id', ParseUUIDPipe) id: string): Promise<Notificacion> {
    return this.notificacionService.findOne(id);
  }

  @Patch('notificaciones/:id')
  @ApiOperation({ summary: 'Actualizar una notificacion' })
  @ApiResponse({
    status: 200,
    description: 'Notificacion actualizada exitosamente',
    type: Notificacion,
  })
  @ApiResponse({ status: 404, description: 'Notificacion no encontrada' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateDto: UpdateNotificacionDto,
  ): Promise<Notificacion> {
    return this.notificacionService.update(id, updateDto);
  }

  @Delete('notificaciones/:id')
  @UseGuards(RolesGuard)
  @Roles(RoleType.ADMIN)
  @ApiOperation({ summary: 'Eliminar una notificacion' })
  @ApiResponse({
    status: 200,
    description: 'Notificacion eliminada exitosamente',
  })
  @ApiResponse({ status: 404, description: 'Notificacion no encontrada' })
  remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.notificacionService.remove(id);
  }
}
