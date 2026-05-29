import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { UserService } from '../user/user.service';
import { User } from '../user/entities/user.entity';
import { RoleType } from '../rol/entities/rol.entity';
import { HorarioService } from '../horario/horario.service';
import { horarioConfig } from '../../config/configuration';

@Injectable()
export class VeterinarioService {
  constructor(
    private readonly userService: UserService,
    private readonly horarioService: HorarioService,
    @Inject(horarioConfig.KEY)
    private readonly horarioConf: ConfigType<typeof horarioConfig>,
  ) {}

  async findAll(): Promise<User[]> {
    return this.userService.findByRol(RoleType.VETERINARIO);
  }

  async findOne(id: string): Promise<User> {
    return this.userService.findOne(id);
  }

  async getDisponibilidadGeneral(fecha: string): Promise<any[]> {
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

  async getDisponibilidadVeterinario(
    id: string,
    fecha: string,
  ): Promise<any> {
    await this.findOne(id);
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
}
