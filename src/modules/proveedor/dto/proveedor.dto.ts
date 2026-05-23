import {
  IsString,
  IsNotEmpty,
  IsOptional,
  MaxLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateProveedorDto {
  @ApiProperty({ example: 'Distribuidora Veterinaria XYZ' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  nombreEmpresa: string;

  @ApiProperty({ example: 'Juan Pérez' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  contacto: string;

  @ApiProperty({ example: '+1234567890' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  telefono: string;

  @ApiProperty({ example: 'contacto@distribuidora.com' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  correo: string;

  @ApiProperty({ example: 'Calle Principal #123' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  direccion: string;

  @ApiProperty({ example: 'Crédito 30 días' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  condicionesPago: string;
}

export class UpdateProveedorDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(150)
  nombreEmpresa?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(100)
  contacto?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(20)
  telefono?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(150)
  correo?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(255)
  direccion?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(100)
  condicionesPago?: string;
}