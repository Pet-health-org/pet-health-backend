import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  ParseUUIDPipe,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { PropietarioResponse, PropietarioService } from './propietario.service';
import { CreatePropietarioDto } from './dto/propietario.dto';
import { Propietario } from './entities/propietario.entity';
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
  constructor(private readonly propietarioService: PropietarioService) {}

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo propietario' })
  @ApiResponse({
    status: 201,
    description: 'Propietario creado exitosamente',
    type: Propietario,
  })
  @ApiResponse({ status: 400, description: 'Datos invalidos' })
  @ApiResponse({
    status: 409,
    description: 'Numero de identificacion, email o usuario duplicado',
  })
  create(
    @Body() createDto: CreatePropietarioDto,
  ): Promise<PropietarioResponse> {
    return this.propietarioService.create(createDto);
  }

  @Get()
  @ApiOperation({ summary: 'Buscar propietarios' })
  @ApiQuery({ name: 'q', required: false })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 20 })
  @ApiResponse({
    status: 200,
    description: 'Propietarios obtenidos exitosamente',
    type: [Propietario],
  })
  findAll(
    @Query('q') q?: string,
    @Query('page', new ParseIntPipe({ optional: true })) page = 1,
    @Query('limit', new ParseIntPipe({ optional: true })) limit = 20,
  ): Promise<PropietarioResponse[]> {
    return this.propietarioService.search(q, page, limit);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un propietario por ID' })
  @ApiResponse({
    status: 200,
    description: 'Propietario obtenido exitosamente',
    type: Propietario,
  })
  @ApiResponse({ status: 404, description: 'Propietario no encontrado' })
  findOne(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<PropietarioResponse> {
    return this.propietarioService.findOne(id);
  }
}
