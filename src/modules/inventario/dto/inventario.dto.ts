import {
  IsString,
  IsNotEmpty,
  IsUUID,
  IsOptional,
  IsNumber,
  Min,
  MaxLength,
  IsDateString,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateInventarioDto {
  @ApiProperty({ example: 'uuid-proveedor' })
  @IsUUID()
  @IsNotEmpty()
  proveedorId: string;

  @ApiProperty({ example: 'Vacuna antirrábica' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  nombreProducto: string;

  @ApiProperty({ example: 'vacuna' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  tipo: string;

  @ApiProperty({ example: 100 })
  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  stockActual: number;

  @ApiProperty({ example: 20 })
  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  stockMinimo: number;

  @ApiPropertyOptional({ example: '2027-04-24T00:00:00Z' })
  @IsOptional()
  @IsDateString()
  fechaVencimiento?: string;

  @ApiProperty({ example: 25.5 })
  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  precioUnitario: number;
}

export class UpdateInventarioDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  proveedorId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(150)
  nombreProducto?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(50)
  tipo?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Min(0)
  stockActual?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Min(0)
  stockMinimo?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  fechaVencimiento?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Min(0)
  precioUnitario?: number;
}