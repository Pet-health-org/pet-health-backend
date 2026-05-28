import { IsOptional, IsString, IsUUID, IsInt, Min, IsEnum } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export enum FiltroEstado {
  ENVIADO = 'enviado',
  FALLIDO = 'fallido',
}

export enum FiltroTipo {
  CONFIRMACION = 'confirmacion_cita',
  RECORDATORIO = 'recordatorio_cita',
  ALERTA = 'alerta_vacuna',
}

export class QueryNotificacionDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  propietarioId?: string;

  @ApiPropertyOptional({ enum: FiltroTipo })
  @IsOptional()
  @IsEnum(FiltroTipo)
  tipo?: FiltroTipo;

  @ApiPropertyOptional({ enum: FiltroEstado })
  @IsOptional()
  @IsEnum(FiltroEstado)
  estado?: FiltroEstado;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  @Min(1)
  page?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  @Min(1)
  limit?: number;
}
