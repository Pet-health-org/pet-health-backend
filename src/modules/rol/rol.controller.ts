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
import { RolService } from './rol.service';
import { CreateRolDto, UpdateRolDto } from './dto/rol.dto';
import { Rol, RoleType } from './entities/rol.entity';
import { AuditLog } from '../auditoria/decorators/audit-log.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@ApiTags('Roles')
@ApiBearerAuth()
@Controller('roles')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(RoleType.ADMIN)
export class RolController {
  constructor(private readonly rolService: RolService) {}

  @Post()
  @AuditLog('CREAR_ROL')
  @ApiOperation({ summary: 'Crear un nuevo rol' })
  @ApiResponse({
    status: 201,
    description: 'Rol creado exitosamente',
    type: Rol,
  })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  @ApiResponse({ status: 409, description: 'El rol ya existe' })
  create(@Body() createRolDto: CreateRolDto): Promise<Rol> {
    return this.rolService.create(createRolDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todos los roles' })
  @ApiResponse({
    status: 200,
    description: 'Roles obtenidos exitosamente',
    type: [Rol],
  })
  findAll(): Promise<Rol[]> {
    return this.rolService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un rol por ID' })
  @ApiResponse({
    status: 200,
    description: 'Rol obtenido exitosamente',
    type: Rol,
  })
  @ApiResponse({ status: 404, description: 'Rol no encontrado' })
  findOne(@Param('id', ParseUUIDPipe) id: string): Promise<Rol> {
    return this.rolService.findOne(id);
  }

  @Patch(':id')
  @AuditLog('MODIFICAR_ROL')
  @ApiOperation({ summary: 'Actualizar un rol' })
  @ApiResponse({
    status: 200,
    description: 'Rol actualizado exitosamente',
    type: Rol,
  })
  @ApiResponse({ status: 404, description: 'Rol no encontrado' })
  @ApiResponse({ status: 409, description: 'Nombre de rol duplicado' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateRolDto: UpdateRolDto,
  ): Promise<Rol> {
    return this.rolService.update(id, updateRolDto);
  }

  @Delete(':id')
  @AuditLog('ELIMINAR_ROL')
  @ApiOperation({ summary: 'Eliminar un rol' })
  @ApiResponse({ status: 200, description: 'Rol eliminado exitosamente' })
  @ApiResponse({ status: 404, description: 'Rol no encontrado' })
  @ApiResponse({
    status: 409,
    description: 'No se puede eliminar el rol porque tiene usuarios asignados',
  })
  remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.rolService.remove(id);
  }
}
