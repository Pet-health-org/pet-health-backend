import {
  IsString,
  IsNotEmpty,
  IsOptional,
  MaxLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateVeterinarioDto {
  @ApiProperty({ example: 'vet_juan' })
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty({ example: 'vet@example.com' })
  @IsString()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: 'password123' })
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiPropertyOptional({ example: 'Juan Pérez' })
  @IsOptional()
  @IsString()
  nombreCompleto?: string;

  @ApiPropertyOptional({ example: 'Cirugía general' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  especialidad?: string;

  @ApiPropertyOptional({ example: 'LIC-12345' })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  numeroLicencia?: string;
}

export class UpdateVeterinarioDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  nombreCompleto?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(100)
  especialidad?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(50)
  numeroLicencia?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  curriculum?: string;
}