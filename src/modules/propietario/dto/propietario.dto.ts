import {
  IsEmail,
  IsString,
  IsNotEmpty,
  IsOptional,
  MinLength,
  MaxLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreatePropietarioDto {
  @ApiProperty({ example: 'juan_perez' })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(50)
  username: string;

  @ApiProperty({ example: 'juan@example.com' })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'password123' })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @ApiProperty({ example: 'Juan Perez' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  nombreCompleto: string;

  @ApiProperty({ example: '1020304050' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  numeroIdentificacion: string;

  @ApiPropertyOptional({ example: 'Calle 123' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  direccion?: string;

  @ApiProperty({ example: '1234567890' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  telefono: string;

  @ApiPropertyOptional({ example: 'Prefiere contacto por WhatsApp' })
  @IsOptional()
  @IsString()
  notas?: string;
}

export class UpdatePropietarioDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(100)
  nombreCompleto?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(50)
  numeroIdentificacion?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(100)
  direccion?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(50)
  telefono?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  notas?: string;
}
