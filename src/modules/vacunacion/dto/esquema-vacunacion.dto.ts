import {
  IsArray,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { TipoVacunaEsquema } from '../entities/esquema-vacunacion.entity';

export class VacunaEsquemaDto {
  @ApiProperty({ example: 'Rabia' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  nombreVacuna: string;

  @ApiProperty({
    enum: TipoVacunaEsquema,
    example: TipoVacunaEsquema.OBLIGATORIA,
  })
  @IsEnum(TipoVacunaEsquema)
  tipo: TipoVacunaEsquema;

  @ApiProperty({ example: 3 })
  @IsInt()
  @Min(0)
  edadMinimaMeses: number;

  @ApiPropertyOptional({ example: 12 })
  @IsOptional()
  @IsInt()
  @Min(0)
  edadMaximaMeses?: number;

  @ApiProperty({ example: 365 })
  @IsInt()
  @Min(1)
  intervaloRefuerzoDias: number;

  @ApiPropertyOptional({ example: 'Refuerzo anual recomendado' })
  @IsOptional()
  @IsString()
  descripcion?: string;
}

export class CreateEsquemaVacunacionDto {
  @ApiProperty({ example: 'perro' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  especie: string;

  @ApiProperty({ type: [VacunaEsquemaDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => VacunaEsquemaDto)
  vacunas: VacunaEsquemaDto[];
}
