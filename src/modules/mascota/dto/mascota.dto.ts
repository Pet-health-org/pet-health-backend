import {
  IsString,
  IsNotEmpty,
  IsUUID,
  IsOptional,
  IsNumber,
  IsEnum,
  IsPositive,
  Min,
  MaxLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { EspecieMascota } from '../entities/mascota.entity';

export class CreateMascotaDto {
  @ApiProperty({ example: 'uuid-propietario' })
  @IsUUID()
  @IsNotEmpty()
  propietarioId: string;

  @ApiPropertyOptional({ example: 'uuid-raza' })
  @IsOptional()
  @IsUUID()
  razaId?: string;

  @ApiProperty({ example: 'Firulais' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  nombre: string;

  @ApiProperty({ enum: EspecieMascota, example: EspecieMascota.PERRO })
  @IsEnum(EspecieMascota)
  @IsNotEmpty()
  especie: EspecieMascota;

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
  @IsPositive()
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
  @IsEnum(EspecieMascota)
  especie?: EspecieMascota;

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
  @IsPositive()
  peso?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(255)
  color?: string;
}
