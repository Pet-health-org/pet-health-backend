import { IsString, IsOptional, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateEspecieDto {
  @ApiProperty({ example: 'Canino' })
  @IsString()
  @MaxLength(50)
  nombre: string;

  @ApiPropertyOptional({ example: 'FC: 60-120 lpm, Temp: 38-39.2°C' })
  @IsOptional()
  @IsString()
  constantesVitales?: string;

  @ApiPropertyOptional({ example: 'Familia Canidae' })
  @IsOptional()
  @IsString()
  observaciones?: string;
}

export class UpdateEspecieDto {
  @ApiPropertyOptional({ example: 'Canino' })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  nombre?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  constantesVitales?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  observaciones?: string;
}
