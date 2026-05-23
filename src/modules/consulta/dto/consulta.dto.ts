import {
  IsString,
  IsNotEmpty,
  IsUUID,
  IsOptional,
  IsNumber,
  IsArray,
  IsInt,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ValorConstanteDto {
  @ApiProperty({ example: 38.5 })
  @IsNumber()
  @IsNotEmpty()
  valor: number;

  @ApiProperty({ example: '°C' })
  @IsString()
  @IsNotEmpty()
  unidad: string;
}

export class ConstantesVitalesIngresoDto {
  @ApiProperty({ type: ValorConstanteDto })
  @ValidateNested()
  @Type(() => ValorConstanteDto)
  temperatura: ValorConstanteDto;

  @ApiProperty({ type: ValorConstanteDto })
  @ValidateNested()
  @Type(() => ValorConstanteDto)
  frecuenciaCardiaca: ValorConstanteDto;

  @ApiProperty({ type: ValorConstanteDto })
  @ValidateNested()
  @Type(() => ValorConstanteDto)
  frecuenciaRespiratoria: ValorConstanteDto;
}

export class AlertaConstanteDto {
  @ApiProperty({ example: 'temperatura' })
  constante: string;

  @ApiProperty({ example: 39.5 })
  valorIngresado: number;

  @ApiProperty({ example: 38.0 })
  minimoEsperado: number;

  @ApiProperty({ example: 39.2 })
  maximoEsperado: number;

  @ApiProperty({ example: '°C' })
  unidad: string;
}

export class InsumoConsultaDto {
  @ApiProperty({ example: 'uuid-inventario' })
  @IsUUID()
  @IsNotEmpty()
  inventarioId: string;

  @ApiProperty({ example: 1 })
  @IsInt()
  @Min(1)
  cantidad: number;
}

export class CreateConsultaDto {
  @ApiProperty({ example: 'uuid-mascota' })
  @IsUUID()
  @IsNotEmpty()
  mascotaId: string;

  @ApiProperty({ example: 'Chequeo general' })
  @IsString()
  @IsNotEmpty()
  motivo: string;

  @ApiPropertyOptional({ example: 'Paciente activo, buen estado general' })
  @IsOptional()
  @IsString()
  anamnesis?: string;

  @ApiPropertyOptional({ type: ConstantesVitalesIngresoDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => ConstantesVitalesIngresoDto)
  constantesVitales?: ConstantesVitalesIngresoDto;

  @ApiProperty({ example: 'Paciente sano' })
  @IsString()
  @IsNotEmpty()
  diagnostico: string;

  @ApiProperty({ example: 'Vacuna anual aplicada' })
  @IsString()
  @IsNotEmpty()
  tratamiento: string;

  @ApiPropertyOptional({ example: 'Requiere control en 6 meses' })
  @IsOptional()
  @IsString()
  observaciones?: string;

  @ApiPropertyOptional({
    example: 'El paciente presenta taquicardia fisiológica por estrés',
  })
  @IsOptional()
  @IsString()
  justificacion?: string;

  @ApiPropertyOptional({ type: [InsumoConsultaDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => InsumoConsultaDto)
  insumosUtilizados?: InsumoConsultaDto[];
}

export class ConsultaResponseDto {
  id: string;
  mascotaId: string;
  motivo: string;
  anamnesis: string;
  constantesVitales: string;
  diagnostico: string;
  tratamiento: string;
  observaciones: string;
  justificacion: string;
  fecha: Date;
  createdAt: Date;
  alertas?: AlertaConstanteDto[];
}
