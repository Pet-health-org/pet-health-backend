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
import { NotificacionInventarioService } from './notificacion-inventario.service';
import {
  CreateNotificacionInventarioDto,
  UpdateNotificacionInventarioDto,
} from '../notificacion/dto/notificacion.dto';
import { NotificacionInventario } from './entities/notificacion-inventario.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { RoleType } from '../rol/entities/rol.entity';

@ApiTags('Notificaciones Inventario')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller()
export class NotificacionInventarioController {
  constructor(private readonly service: NotificacionInventarioService) {}

  @Post('notificaciones-inventario')
  @UseGuards(RolesGuard)
  @Roles(RoleType.ADMIN)
  @ApiOperation({ summary: 'Crear notificación de inventario' })
  @ApiResponse({
    status: 201,
    description: 'Notificación creada',
    type: NotificacionInventario,
  })
  create(@Body() createDto: CreateNotificacionInventarioDto) {
    return this.service.create(createDto);
  }

  @Get('notificaciones-inventario')
  @ApiOperation({ summary: 'Obtener todas las notificaciones de inventario' })
  @ApiResponse({ status: 200, type: [NotificacionInventario] })
  findAll() {
    return this.service.findAll();
  }

  @Get('notificaciones-inventario/:id')
  @ApiOperation({ summary: 'Obtener una notificación por ID' })
  @ApiResponse({ status: 200, type: NotificacionInventario })
  @ApiResponse({ status: 404, description: 'No encontrada' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.service.findOne(id);
  }

  @Patch('notificaciones-inventario/:id')
  @UseGuards(RolesGuard)
  @Roles(RoleType.ADMIN)
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateDto: UpdateNotificacionInventarioDto,
  ) {
    return this.service.update(id, updateDto);
  }

  @Delete('notificaciones-inventario/:id')
  @UseGuards(RolesGuard)
  @Roles(RoleType.ADMIN)
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.service.remove(id);
  }
}