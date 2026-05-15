import {
  IsString,
  IsNotEmpty,
  IsOptional,
  MaxLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateRecepcionistaDto {
  @ApiProperty({ example: 'recep_juan' })
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty({ example: 'recep@example.com' })
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

  @ApiPropertyOptional({ example: '1234567890' })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  telefonoDirecto?: string;
}

export class UpdateRecepcionistaDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  nombreCompleto?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(50)
  telefonoDirecto?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  observaciones?: string;
}