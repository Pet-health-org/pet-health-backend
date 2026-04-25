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
  Req,
  BadRequestException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiConsumes } from '@nestjs/swagger';
import { UserService } from './user.service';
import { CreateUserDto, UpdateUserDto } from './dto/user.dto';
import { User, UserStatus } from './entities/user.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { RoleType } from '../rol/entities/rol.entity';

@ApiTags('Usuarios')
@ApiBearerAuth()
@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @Roles(RoleType.ADMIN)
  @ApiOperation({ summary: 'Crear un nuevo usuario (solo admin)' })
  @ApiResponse({ status: 201, description: 'Usuario creado exitosamente', type: User })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  @ApiResponse({ status: 409, description: 'Usuario ya existe' })
  create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.userService.create(createUserDto);
  }

  @Get()
  @Roles(RoleType.ADMIN, RoleType.RECEPCIONISTA)
  @ApiOperation({ summary: 'Obtener todos los usuarios (admin y recepción)' })
  @ApiResponse({ status: 200, description: 'Usuarios obtenidos exitosamente', type: [User] })
  findAll(): Promise<User[]> {
    return this.userService.findAll();
  }

  @Get('profile')
  @ApiOperation({ summary: 'Obtener perfil del usuario autenticado' })
  @ApiResponse({ status: 200, description: 'Perfil obtenido exitosamente', type: User })
  getProfile(@Req() req: any): Promise<User> {
    return this.userService.findOne(req.user.id);
  }

  @Get(':id')
  @Roles(RoleType.ADMIN, RoleType.RECEPCIONISTA)
  @ApiOperation({ summary: 'Obtener un usuario por ID' })
  @ApiResponse({ status: 200, description: 'Usuario obtenido exitosamente', type: User })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
  findOne(@Param('id', ParseUUIDPipe) id: string): Promise<User> {
    return this.userService.findOne(id);
  }

  @Patch(':id')
  @Roles(RoleType.ADMIN)
  @ApiOperation({ summary: 'Actualizar un usuario (solo admin)' })
  @ApiResponse({ status: 200, description: 'Usuario actualizado exitosamente', type: User })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<User> {
    return this.userService.update(id, updateUserDto);
  }

  @Patch(':id/status/:status')
  @Roles(RoleType.ADMIN)
  @ApiOperation({ summary: 'Cambiar estado de un usuario (solo admin)' })
  @ApiResponse({ status: 200, description: 'Estado actualizado exitosamente', type: User })
  changeStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Param('status') status: string,
  ): Promise<User> {
    const validStatuses = ['activo', 'inactivo', 'bloqueado'];
    if (!validStatuses.includes(status)) {
      throw new BadRequestException('Estado no válido');
    }
    return this.userService.changeStatus(id, status as UserStatus);
  }

  @Delete(':id')
  @Roles(RoleType.ADMIN)
  @ApiOperation({ summary: 'Eliminar un usuario (solo admin)' })
  @ApiResponse({ status: 200, description: 'Usuario eliminado exitosamente' })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
  remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.userService.remove(id);
  }
}
