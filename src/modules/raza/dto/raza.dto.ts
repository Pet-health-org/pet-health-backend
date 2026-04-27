import {
  IsString,
  IsNotEmpty,
  IsOptional,
  MaxLength,
  IsUUID,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateRazaDto {
  @ApiProperty({ example: 'Labrador Retriever' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  nombre: string;

  @ApiPropertyOptional({ example: 'Tamaño mediano-grande, pelaje denso' })
  @IsOptional()
  @IsString()
  caracteristicas?: string;

  @ApiProperty({ example: 'uuid-especie' })
  @IsUUID()
  @IsNotEmpty()
  especieId: string;
}

export class UpdateRazaDto {
  @ApiPropertyOptional({ example: 'Labrador Retriever' })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  nombre?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  caracteristicas?: string;

  @ApiPropertyOptional()
  @IsUUID()
  @IsOptional()
  especieId?: string;
}