import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsUUID,
  IsDateString,
  MaxLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateNotificacionDto {
  @ApiProperty({ example: 'uuid-usuario' })
  @IsUUID()
  @IsNotEmpty()
  usuarioId: string;

  @ApiProperty({ example: 'Recordatorio: Su mascota tiene cita mañana' })
  @IsString()
  @IsNotEmpty()
  mensaje: string;

  @ApiProperty({ example: 'cliente@example.com' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  emailDestino: string;

  @ApiProperty({ example: 'email' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  tipoEnvio: string;

  @ApiPropertyOptional({ example: '2026-04-25T10:00:00Z' })
  @IsOptional()
  @IsDateString()
  fechaEnvio?: string;

  @ApiProperty({ example: 'pendiente' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  estado: string;

  @ApiPropertyOptional({ example: 'Error de conexión' })
  @IsOptional()
  @IsString()
  errorMsg?: string;
}

export class UpdateNotificacionDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  mensaje?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(150)
  emailDestino?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(20)
  tipoEnvio?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  fechaEnvio?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(20)
  estado?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  errorMsg?: string;
}

export class CreateNotificacionCitaDto {
  @ApiProperty({ example: 'uuid-cita' })
  @IsUUID()
  @IsNotEmpty()
  citaId: string;

  @ApiProperty({ example: '2026-04-24T09:00:00Z' })
  @IsDateString()
  @IsNotEmpty()
  fechaRecordatorio: string;
}

export class UpdateNotificacionCitaDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  fechaRecordatorio?: string;
}

export class CreateNotificacionInventarioDto {
  @ApiProperty({ example: 'uuid-inventario' })
  @IsUUID()
  @IsNotEmpty()
  inventarioId: string;

  @ApiProperty({ example: 'uuid-notificacion' })
  @IsUUID()
  @IsNotEmpty()
  notificacionId: string;

  @ApiProperty({ example: 'stock_bajo' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  tipoAlerta: string;
}

export class UpdateNotificacionInventarioDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  inventarioId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  notificacionId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(50)
  tipoAlerta?: string;
}
