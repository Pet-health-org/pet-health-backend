import {
  IsString,
  IsNotEmpty,
  IsUUID,
  IsOptional,
  MaxLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateMedicamentoDto {
  @ApiProperty({ example: 'uuid-historia' })
  @IsUUID()
  @IsNotEmpty()
  historiaClinicaId: string;

  @ApiProperty({ example: 'uuid-inventario' })
  @IsUUID()
  @IsNotEmpty()
  inventarioId: string;

  @ApiProperty({ example: 'Amoxicilina' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  nombre: string;

  @ApiProperty({ example: 'Oral' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  viaAdministracion: string;

  @ApiPropertyOptional({ example: '500mg' })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  dosis?: string;
}

export class UpdateMedicamentoDto {
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
  @IsString()
  @MaxLength(50)
  viaAdministracion?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(50)
  dosis?: string;
}