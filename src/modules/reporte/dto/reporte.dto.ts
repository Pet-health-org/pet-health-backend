import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsDateString,
  MaxLength,
  IsUUID,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateReporteDto {
  @ApiPropertyOptional({ example: 'uuid-admin' })
  @IsUUID()
  @IsOptional()
  adminId?: string;

  @ApiProperty({ example: 'citas' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  tipoReporte: string;

  @ApiProperty({ example: '2026-04-24T00:00:00Z' })
  @IsDateString()
  @IsNotEmpty()
  fechaGeneracion: string;

  @ApiPropertyOptional({ example: 'abr 2026' })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  periodo?: string;

  @ApiProperty({ example: '{"total_citas": 50}' })
  @IsString()
  @IsNotEmpty()
  contenido: string;

  @ApiProperty({ example: 'pdf' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  formato: string;
}

export class UpdateReporteDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(50)
  tipoReporte?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  fechaGeneracion?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(50)
  periodo?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  contenido?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(20)
  formato?: string;
}
