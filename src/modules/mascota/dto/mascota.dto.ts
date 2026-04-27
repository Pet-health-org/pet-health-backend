import {
  IsString,
  IsNotEmpty,
  IsUUID,
  IsOptional,
  IsNumber,
  Min,
  MaxLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateMascotaDto {
  @ApiProperty({ example: 'uuid-propietario' })
  @IsUUID()
  @IsNotEmpty()
  propietarioId: string;

  @ApiProperty({ example: 'uuid-raza' })
  @IsUUID()
  @IsNotEmpty()
  razaId: string;

  @ApiProperty({ example: 'Firulais' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  nombre: string;

  @ApiProperty({ example: 3 })
  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  edad: number;

  @ApiProperty({ example: 'macho' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  sexo: string;

  @ApiProperty({ example: 15.5 })
  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  peso: number;

  @ApiPropertyOptional({ example: 'Café' })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  color?: string;
}

export class UpdateMascotaDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  propietarioId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  razaId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(100)
  nombre?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Min(0)
  edad?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(20)
  sexo?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Min(0)
  peso?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(255)
  color?: string;
}