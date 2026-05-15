import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { RolService } from './rol.service';
import { CreateRolDto, UpdateRolDto } from './dto/rol.dto';
import { Rol } from './entities/rol.entity';

@ApiTags('Roles')
@ApiBearerAuth()
@Controller('roles')
export class RolController {
  constructor(private readonly rolService: RolService) {}

  @Post()
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
