import {
  Controller,
  Get,
  Param,
  Query,
  ParseUUIDPipe,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { VeterinarioService } from './veterinario.service';
import { User } from '../user/entities/user.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { RoleType } from '../rol/entities/rol.entity';

@ApiTags('Veterinarios')
@ApiBearerAuth()
@Controller('veterinarios')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(RoleType.ADMIN, RoleType.RECEPCIONISTA)
export class VeterinarioController {
  constructor(
    private readonly veterinarioService: VeterinarioService,
  ) {}

  @Get('disponibilidad')
  @ApiOperation({
    summary: 'Obtener disponibilidad de todos los veterinarios en una fecha',
  })
  @ApiQuery({ name: 'fecha', required: true, example: '2026-05-15' })
  @ApiResponse({
    status: 200,
    description: 'Disponibilidad obtenida exitosamente',
  })
  getDisponibilidadGeneral(@Query('fecha') fecha: string): Promise<any[]> {
    return this.veterinarioService.getDisponibilidadGeneral(fecha);
  }

  @Get(':id/disponibilidad')
  @ApiOperation({
    summary: 'Obtener disponibilidad de un veterinario en una fecha',
  })
  @ApiQuery({ name: 'fecha', required: true, example: '2026-05-15' })
  @ApiResponse({
    status: 200,
    description: 'Disponibilidad obtenida exitosamente',
  })
  @ApiResponse({ status: 404, description: 'Veterinario no encontrado' })
  getDisponibilidadVeterinario(
    @Param('id', ParseUUIDPipe) id: string,
    @Query('fecha') fecha: string,
  ): Promise<any> {
    return this.veterinarioService.getDisponibilidadVeterinario(id, fecha);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todos los veterinarios' })
  @ApiResponse({
    status: 200,
    description: 'Veterinarios obtenidos exitosamente',
    type: [User],
  })
  findAll(): Promise<User[]> {
    return this.veterinarioService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un veterinario por ID' })
  @ApiResponse({
    status: 200,
    description: 'Veterinario obtenido exitosamente',
    type: User,
  })
  @ApiResponse({ status: 404, description: 'Veterinario no encontrado' })
  findOne(@Param('id', ParseUUIDPipe) id: string): Promise<User> {
    return this.veterinarioService.findOne(id);
  }
}
