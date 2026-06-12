import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
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
  CreateNotificacionPropietarioDto,
} from './dto/notificacion.dto';
import { QueryNotificacionDto } from './dto/query-notificacion.dto';
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

  @Post('notificaciones/propietario')
  @UseGuards(RolesGuard)
  @Roles(RoleType.ADMIN, RoleType.RECEPCIONISTA, RoleType.VETERINARIO)
  @ApiOperation({ summary: 'Enviar notificacion a un propietario' })
  @ApiResponse({
    status: 201,
    description: 'Notificacion enviada al propietario',
    type: Notificacion,
  })
  @ApiResponse({ status: 404, description: 'Propietario no encontrado' })
  notificarPropietario(
    @Body() dto: CreateNotificacionPropietarioDto,
  ): Promise<Notificacion> {
    return this.notificacionService.notificarPropietario(dto);
  }

  @Get('notificaciones')
  @UseGuards(RolesGuard)
  @Roles(RoleType.ADMIN)
  @ApiOperation({
    summary: 'Obtener historial de notificaciones (filtrable y paginado)',
  })
  @ApiResponse({
    status: 200,
    description: 'Notificaciones obtenidas exitosamente',
  })
  findAll(@Query() query: QueryNotificacionDto) {
    return this.notificacionService.findAll(query);
  }

  @Get('notificaciones/usuario/:usuarioId')
  @UseGuards(RolesGuard)
  @Roles(RoleType.ADMIN)
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
  @UseGuards(RolesGuard)
  @Roles(RoleType.ADMIN)
  @ApiOperation({ summary: 'Obtener notificaciones por estado' })
  @ApiResponse({
    status: 200,
    description: 'Notificaciones obtenidas exitosamente',
    type: [Notificacion],
  })
  findByEstado(@Param('estado') estado: string): Promise<Notificacion[]> {
    return this.notificacionService.findByEstado(estado);
  }

  @Post('notificaciones/:id/reenviar')
  @UseGuards(RolesGuard)
  @Roles(RoleType.ADMIN, RoleType.RECEPCIONISTA)
  @ApiOperation({ summary: 'Reenviar una notificacion fallida' })
  @ApiResponse({
    status: 200,
    description: 'Notificacion reenviada exitosamente',
    type: Notificacion,
  })
  @ApiResponse({ status: 404, description: 'Notificacion no encontrada' })
  @ApiResponse({
    status: 400,
    description: 'Solo notificaciones fallidas pueden reenviarse',
  })
  reenviar(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<Notificacion> {
    return this.notificacionService.reenviar(id);
  }

  @Get('notificaciones/:id')
  @UseGuards(RolesGuard)
  @Roles(RoleType.ADMIN)
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
  @UseGuards(RolesGuard)
  @Roles(RoleType.ADMIN)
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
