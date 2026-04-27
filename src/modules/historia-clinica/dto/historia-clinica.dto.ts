import {
  IsString,
  IsNotEmpty,
  IsUUID,
  IsOptional,
  IsDateString,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateHistoriaClinicaDto {
  @ApiProperty({ example: 'uuid-mascota' })
  @IsUUID()
  @IsNotEmpty()
  mascotaId: string;

  @ApiPropertyOptional({ example: 'uuid-rata' })
  @IsOptional()
  @IsUUID()
  citaId?: string;

  @ApiProperty({ example: '2026-04-24T10:00:00Z' })
  @IsDateString()
  @IsNotEmpty()
  fecha: string;

  @ApiProperty({ example: 'Chequeo general, sano' })
  @IsString()
  @IsNotEmpty()
  diagnostico: string;

  @ApiProperty({ example: 'Vacuna anual aplicada' })
  @IsString()
  @IsNotEmpty()
  tratamiento: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  observaciones?: string;
}

export class UpdateHistoriaClinicaDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  mascotaId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  citaId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  fecha?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  diagnostico?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  tratamiento?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  observaciones?: string;
}