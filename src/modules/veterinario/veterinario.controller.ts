import {
  Controller,
  Get,
  Param,
  Query,
  ParseUUIDPipe,
  UseGuards,
  Inject,
} from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { UserService } from '../user/user.service';
import { User } from '../user/entities/user.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { RoleType } from '../rol/entities/rol.entity';
import { HorarioService } from '../horario/horario.service';
import { horarioConfig } from '../../config/configuration';

@ApiTags('Veterinarios')
@ApiBearerAuth()
@Controller('veterinarios')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(RoleType.ADMIN, RoleType.RECEPCIONISTA)
export class VeterinarioController {
  constructor(
    private readonly userService: UserService,
    private readonly horarioService: HorarioService,
    @Inject(horarioConfig.KEY)
    private readonly horarioConf: ConfigType<typeof horarioConfig>,
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
  async getDisponibilidadGeneral(@Query('fecha') fecha: string): Promise<any> {
    const fechaDate = new Date(fecha + 'T00:00:00Z');
    const veterinarios = await this.userService.findByRol(RoleType.VETERINARIO);
    const resultado: any[] = [];

    for (const vet of veterinarios) {
      const bloques = await this.generarBloquesDisponibilidad(
        vet.id,
        fechaDate,
      );
      resultado.push({
        veterinarioId: vet.id,
        veterinarioNombre: vet.nombreCompleto || vet.username,
        fecha,
        bloques,
      });
    }

    return resultado;
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
  async getDisponibilidadVeterinario(
    @Param('id', ParseUUIDPipe) id: string,
    @Query('fecha') fecha: string,
  ): Promise<any> {
    await this.userService.findOne(id);
    const fechaDate = new Date(fecha + 'T00:00:00Z');
    const bloques = await this.generarBloquesDisponibilidad(id, fechaDate);

    return {
      veterinarioId: id,
      fecha,
      bloques,
    };
  }

  private async generarBloquesDisponibilidad(
    veterinarioId: string,
    fecha: Date,
  ): Promise<any[]> {
    const dia = fecha.getDay();
    if (dia === 0) {
      return [];
    }

    const bloquesOcupados = await this.horarioService.obtenerBloquesOcupados(
      veterinarioId,
      fecha,
    );

    const bloques: any[] = [];
    const inicioJornada = new Date(fecha);
    inicioJornada.setHours(this.horarioConf.horaInicio, 0, 0, 0);
    const finJornada = new Date(fecha);
    finJornada.setHours(this.horarioConf.horaFin, 0, 0, 0);

    let inicioBloque = new Date(inicioJornada);

    while (inicioBloque < finJornada) {
      const finBloque = new Date(
        inicioBloque.getTime() + this.horarioConf.duracionMinutos * 60 * 1000,
      );

      const ocupado = bloquesOcupados.some((bloque) => {
        return inicioBloque < bloque.fin && finBloque > bloque.inicio;
      });

      bloques.push({
        inicio: inicioBloque.toISOString(),
        fin: finBloque.toISOString(),
        estado: ocupado ? 'ocupado' : 'disponible',
      });

      inicioBloque = new Date(finBloque);
    }

    return bloques;
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todos los veterinarios' })
  @ApiResponse({
    status: 200,
    description: 'Veterinarios obtenidos exitosamente',
    type: [User],
  })
  findAll(): Promise<User[]> {
    return this.userService.findByRol(RoleType.VETERINARIO);
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
    return this.userService.findOne(id);
  }
}
