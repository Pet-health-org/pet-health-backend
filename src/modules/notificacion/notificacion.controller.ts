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
import {
  CreateNotificacionDto,
  UpdateNotificacionDto,
  CreateNotificacionCitaDto,
  UpdateNotificacionCitaDto,
  CreateNotificacionInventarioDto,
  UpdateNotificacionInventarioDto,
} from './dto/notificacion.dto';
import { Notificacion } from './entities/notificacion.entity';
import { NotificacionCita } from './entities/notificacion-cita.entity';
import { NotificacionInventario } from './entities/notificacion-inventario.entity';
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
  createNotificacion(
    @Body() createDto: CreateNotificacionDto,
  ): Promise<Notificacion> {
    return this.notificacionService.createNotificacion(createDto);
  }

  @Get('notificaciones')
  @ApiOperation({ summary: 'Obtener todas las notificaciones' })
  @ApiResponse({
    status: 200,
    description: 'Notificaciones obtenidas exitosamente',
    type: [Notificacion],
  })
  findAllNotificaciones(): Promise<Notificacion[]> {
    return this.notificacionService.findAllNotificaciones();
  }

  @Get('notificaciones/usuario/:usuarioId')
  @ApiOperation({ summary: 'Obtener notificaciones por usuario' })
  @ApiResponse({
    status: 200,
    description: 'Notificaciones obtenidas exitosamente',
    type: [Notificacion],
  })
  findNotificacionesByUsuario(
    @Param('usuarioId', ParseUUIDPipe) usuarioId: string,
  ): Promise<Notificacion[]> {
    return this.notificacionService.findNotificacionesByUsuario(usuarioId);
  }

  @Get('notificaciones/estado/:estado')
  @ApiOperation({ summary: 'Obtener notificaciones por estado' })
  @ApiResponse({
    status: 200,
    description: 'Notificaciones obtenidas exitosamente',
    type: [Notificacion],
  })
  findNotificacionesByEstado(
    @Param('estado') estado: string,
  ): Promise<Notificacion[]> {
    return this.notificacionService.findNotificacionesByEstado(estado);
  }

  @Get('notificaciones/:id')
  @ApiOperation({ summary: 'Obtener una notificacion por ID' })
  @ApiResponse({
    status: 200,
    description: 'Notificacion obtenida exitosamente',
    type: Notificacion,
  })
  @ApiResponse({ status: 404, description: 'Notificacion no encontrada' })
  findOneNotificacion(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<Notificacion> {
    return this.notificacionService.findOneNotificacion(id);
  }

  @Patch('notificaciones/:id')
  @ApiOperation({ summary: 'Actualizar una notificacion' })
  @ApiResponse({
    status: 200,
    description: 'Notificacion actualizada exitosamente',
    type: Notificacion,
  })
  @ApiResponse({ status: 404, description: 'Notificacion no encontrada' })
  updateNotificacion(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateDto: UpdateNotificacionDto,
  ): Promise<Notificacion> {
    return this.notificacionService.updateNotificacion(id, updateDto);
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
  removeNotificacion(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.notificacionService.removeNotificacion(id);
  }

  @Post('notificaciones-cita')
  @UseGuards(RolesGuard)
  @Roles(RoleType.ADMIN, RoleType.RECEPCIONISTA)
  @ApiOperation({ summary: 'Crear recordatorio de cita' })
  @ApiResponse({
    status: 201,
    description: 'Recordatorio creado exitosamente',
    type: NotificacionCita,
  })
  createNotificacionCita(
    @Body() createDto: CreateNotificacionCitaDto,
  ): Promise<NotificacionCita> {
    return this.notificacionService.createNotificacionCita(createDto);
  }

  @Get('notificaciones-cita')
  @ApiOperation({ summary: 'Obtener todos los recordatorios de citas' })
  @ApiResponse({
    status: 200,
    description: 'Recordatorios obtenidos exitosamente',
    type: [NotificacionCita],
  })
  findAllNotificacionesCita(): Promise<NotificacionCita[]> {
    return this.notificacionService.findAllNotificacionesCita();
  }

  @Get('notificaciones-cita/:id')
  @ApiOperation({ summary: 'Obtener un recordatorio por ID' })
  @ApiResponse({
    status: 200,
    description: 'Recordatorio obtenido exitosamente',
    type: NotificacionCita,
  })
  @ApiResponse({ status: 404, description: 'Recordatorio no encontrado' })
  findOneNotificacionCita(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<NotificacionCita> {
    return this.notificacionService.findOneNotificacionCita(id);
  }

  @Patch('notificaciones-cita/:id')
  @ApiOperation({ summary: 'Actualizar un recordatorio' })
  @ApiResponse({
    status: 200,
    description: 'Recordatorio actualizado exitosamente',
    type: NotificacionCita,
  })
  @ApiResponse({ status: 404, description: 'Recordatorio no encontrado' })
  updateNotificacionCita(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateDto: UpdateNotificacionCitaDto,
  ): Promise<NotificacionCita> {
    return this.notificacionService.updateNotificacionCita(id, updateDto);
  }

  @Delete('notificaciones-cita/:id')
  @UseGuards(RolesGuard)
  @Roles(RoleType.ADMIN)
  @ApiOperation({ summary: 'Eliminar un recordatorio' })
  @ApiResponse({
    status: 200,
    description: 'Recordatorio eliminado exitosamente',
  })
  @ApiResponse({ status: 404, description: 'Recordatorio no encontrado' })
  removeNotificacionCita(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<void> {
    return this.notificacionService.removeNotificacionCita(id);
  }

  @Post('notificaciones-inventario')
  @UseGuards(RolesGuard)
  @Roles(RoleType.ADMIN)
  @ApiOperation({ summary: 'Crear alerta de inventario' })
  @ApiResponse({
    status: 201,
    description: 'Alerta creada exitosamente',
    type: NotificacionInventario,
  })
  createNotificacionInventario(
    @Body() createDto: CreateNotificacionInventarioDto,
  ): Promise<NotificacionInventario> {
    return this.notificacionService.createNotificacionInventario(createDto);
  }

  @Get('notificaciones-inventario')
  @ApiOperation({ summary: 'Obtener todas las alertas de inventario' })
  @ApiResponse({
    status: 200,
    description: 'Alertas obtenidas exitosamente',
    type: [NotificacionInventario],
  })
  findAllNotificacionesInventario(): Promise<NotificacionInventario[]> {
    return this.notificacionService.findAllNotificacionesInventario();
  }

  @Get('notificaciones-inventario/:id')
  @ApiOperation({ summary: 'Obtener una alerta por ID' })
  @ApiResponse({
    status: 200,
    description: 'Alerta obtenida exitosamente',
    type: NotificacionInventario,
  })
  @ApiResponse({ status: 404, description: 'Alerta no encontrada' })
  findOneNotificacionInventario(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<NotificacionInventario> {
    return this.notificacionService.findOneNotificacionInventario(id);
  }

  @Patch('notificaciones-inventario/:id')
  @ApiOperation({ summary: 'Actualizar una alerta' })
  @ApiResponse({
    status: 200,
    description: 'Alerta actualizada exitosamente',
    type: NotificacionInventario,
  })
  @ApiResponse({ status: 404, description: 'Alerta no encontrada' })
  updateNotificacionInventario(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateDto: UpdateNotificacionInventarioDto,
  ): Promise<NotificacionInventario> {
    return this.notificacionService.updateNotificacionInventario(id, updateDto);
  }

  @Delete('notificaciones-inventario/:id')
  @UseGuards(RolesGuard)
  @Roles(RoleType.ADMIN)
  @ApiOperation({ summary: 'Eliminar una alerta' })
  @ApiResponse({ status: 200, description: 'Alerta eliminada exitosamente' })
  @ApiResponse({ status: 404, description: 'Alerta no encontrada' })
  removeNotificacionInventario(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<void> {
    return this.notificacionService.removeNotificacionInventario(id);
  }
}
