import {
  IsString,
  IsNotEmpty,
  IsUUID,
  IsOptional,
  IsDateString,
  MaxLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateCitaDto {
  @ApiProperty({ example: 'uuid-mascota' })
  @IsUUID()
  @IsNotEmpty()
  mascotaId: string;

  @ApiProperty({ example: 'uuid-veterinario' })
  @IsUUID()
  @IsNotEmpty()
  veterinarioId: string;

  @ApiProperty({ example: '2026-04-25T10:00:00Z' })
  @IsDateString()
  @IsNotEmpty()
  fechaHora: string;

  @ApiProperty({ example: 'Vacunación anual' })
  @IsString()
  @IsNotEmpty()
  motivo: string;

  @ApiProperty({ example: 'pendiente' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  estado: string;
}

export class UpdateCitaDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  mascotaId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  veterinarioId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  fechaHora?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  motivo?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(50)
  estado?: string;
}