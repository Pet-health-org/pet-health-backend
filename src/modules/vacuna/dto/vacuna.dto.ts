import {
  IsString,
  IsNotEmpty,
  IsUUID,
  IsOptional,
  IsDateString,
  MaxLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateVacunaDto {
  @ApiProperty({ example: 'uuid-historia' })
  @IsUUID()
  @IsNotEmpty()
  historiaClinicaId: string;

  @ApiProperty({ example: 'uuid-inventario' })
  @IsUUID()
  @IsNotEmpty()
  inventarioId: string;

  @ApiProperty({ example: 'Vacuna antirrábica' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  nombre: string;

  @ApiProperty({ example: '2026-04-24T10:00:00Z' })
  @IsDateString()
  @IsNotEmpty()
  fechaAplicacion: string;

  @ApiPropertyOptional({ example: '2027-04-24T10:00:00Z' })
  @IsOptional()
  @IsDateString()
  fechaProximoRefuerzo?: string;

  @ApiProperty({ example: '1/1' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  dosis: string;

  @ApiPropertyOptional({ example: 'LOTE-2026' })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  lote?: string;
}

export class UpdateVacunaDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  historiaClinicaId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  inventarioId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(100)
  nombre?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  fechaAplicacion?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  fechaProximoRefuerzo?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(20)
  dosis?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(50)
  lote?: string;
}