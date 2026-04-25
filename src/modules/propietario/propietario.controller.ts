import { Controller, Get, Param, ParseUUIDPipe, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { UserService } from '../user/user.service';
import { User } from '../user/entities/user.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { RoleType } from '../rol/entities/rol.entity';

@ApiTags('Propietarios')
@ApiBearerAuth()
@Controller('propietarios')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(RoleType.ADMIN, RoleType.RECEPCIONISTA)
export class PropietarioController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @ApiOperation({ summary: 'Obtener todos los propietarios' })
  @ApiResponse({ status: 200, description: 'Propietarios obtenidos exitosamente', type: [User] })
  findAll(): Promise<User[]> {
    return this.userService.findByRol(RoleType.PROPIETARIO);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un propietario por ID' })
  @ApiResponse({ status: 200, description: 'Propietario obtenido exitosamente', type: User })
  @ApiResponse({ status: 404, description: 'Propietario no encontrado' })
  findOne(@Param('id', ParseUUIDPipe) id: string): Promise<User> {
    return this.userService.findOne(id);
  }
}
