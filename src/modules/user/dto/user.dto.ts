import { IsString, IsEmail, IsEnum, IsOptional, MinLength, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { RoleType } from '../../rol/entities/rol.entity';

export class CreateUserDto {
  @ApiProperty({ example: 'juan_perez' })
  @IsString()
  @MinLength(3)
  @MaxLength(50)
  username: string;

  @ApiProperty({ example: 'juan@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'password123' })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({ enum: RoleType, example: RoleType.PROPIETARIO })
  @IsEnum(RoleType)
  rolId: RoleType;

  @ApiPropertyOptional({ example: 'Juan Pérez' })
  @IsOptional()
  @IsString()
  nombreCompleto?: string;
}

export class UpdateUserDto {
  @ApiPropertyOptional({ example: 'juan_perez_new' })
  @IsOptional()
  @IsString()
  username?: string;

  @ApiPropertyOptional({ example: 'juan.new@example.com' })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({ description: 'Solo si se desea cambiar contraseña' })
  @IsOptional()
  @IsString()
  password?: string;

  @ApiPropertyOptional({ enum: RoleType, example: RoleType.VETERINARIO })
  @IsOptional()
  @IsEnum(RoleType)
  rolId?: RoleType;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  isActive?: boolean;

  @ApiPropertyOptional({ example: 'activo' })
  @IsOptional()
  @IsString()
  status?: string;
}
