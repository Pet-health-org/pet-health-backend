import { Controller, Get, Param, ParseUUIDPipe, Patch, Body, Delete, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { UserService } from '../user/user.service';
import { UpdateUserDto } from '../user/dto/user.dto';
import { User } from '../user/entities/user.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { RoleType } from '../rol/entities/rol.entity';

@ApiTags('Administradores')
@ApiBearerAuth()
@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(RoleType.ADMIN)
export class AdminController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @ApiOperation({ summary: 'Obtener todos los administradores' })
  @ApiResponse({ status: 200, description: 'Administradores obtenidos exitosamente', type: [User] })
  findAll(): Promise<User[]> {
    return this.userService.findByRol(RoleType.ADMIN);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un administrador por ID' })
  @ApiResponse({ status: 200, description: 'Administrador obtenido exitosamente', type: User })
  @ApiResponse({ status: 404, description: 'Administrador no encontrado' })
  findOne(@Param('id', ParseUUIDPipe) id: string): Promise<User> {
    return this.userService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar un administrador' })
  @ApiResponse({ status: 200, description: 'Administrador actualizado exitosamente', type: User })
  @ApiResponse({ status: 404, description: 'Administrador no encontrado' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<User> {
    return this.userService.update(id, updateUserDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un administrador' })
  @ApiResponse({ status: 200, description: 'Administrador eliminado exitosamente' })
  @ApiResponse({ status: 404, description: 'Administrador no encontrado' })
  remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.userService.remove(id);
  }
}
