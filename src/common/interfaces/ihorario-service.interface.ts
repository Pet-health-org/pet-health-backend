export interface IHorarioService {
  validarHorarioLaboral(fechaHora: Date): void;
  validarSinConflicto(veterinarioId: string, fechaHora: Date): Promise<void>;
  obtenerBloquesOcupados(
    veterinarioId: string,
    fecha: Date,
  ): Promise<{ inicio: Date; fin: Date }[]>;
  obtenerHorariosAlternativos(
    veterinarioId: string,
    fecha: Date,
    limite?: number,
  ): Promise<string[]>;
}
