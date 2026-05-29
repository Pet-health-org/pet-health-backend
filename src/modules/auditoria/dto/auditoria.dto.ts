import { IsOptional, IsString, IsUUID, IsInt, Min } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class QueryAuditoriaDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  usuarioId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  accion?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  fechaInicio?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  fechaFin?: string;

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

export class CreateAuditoriaDto {
  @IsUUID()
  usuarioId: string;

  @IsString()
  accion: string;

  @IsOptional()
  @IsString()
  ip?: string;

  @IsOptional()
  @IsUUID()
  registroId?: string;
}
