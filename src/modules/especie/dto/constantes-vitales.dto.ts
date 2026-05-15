import {
  IsString,
  IsNotEmpty,
  IsNumber,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class RangoConstanteDto {
  @ApiProperty({ example: 38.0 })
  @IsNumber()
  @IsNotEmpty()
  minimo: number;

  @ApiProperty({ example: 39.2 })
  @IsNumber()
  @IsNotEmpty()
  maximo: number;

  @ApiProperty({ example: '°C' })
  @IsString()
  @IsNotEmpty()
  unidad: string;
}

export class ConstantesVitalesDto {
  @ApiProperty({ type: RangoConstanteDto })
  @ValidateNested()
  @Type(() => RangoConstanteDto)
  temperatura: RangoConstanteDto;

  @ApiProperty({ type: RangoConstanteDto })
  @ValidateNested()
  @Type(() => RangoConstanteDto)
  frecuenciaCardiaca: RangoConstanteDto;

  @ApiProperty({ type: RangoConstanteDto })
  @ValidateNested()
  @Type(() => RangoConstanteDto)
  frecuenciaRespiratoria: RangoConstanteDto;
}
