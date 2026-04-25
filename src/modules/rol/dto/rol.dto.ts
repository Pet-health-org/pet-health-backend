import { IsString, IsEnum, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { RoleType } from '../entities/rol.entity';

export class CreateRolDto {
  @ApiProperty({ enum: RoleType, example: RoleType.VETERINARIO })
  name: RoleType;

  @ApiPropertyOptional({ example: 'Personal veterinario' })
  @IsOptional()
  @IsString()
  description?: string;
}

export class UpdateRolDto {
  @ApiPropertyOptional({ enum: RoleType, example: RoleType.VETERINARIO })
  @IsOptional()
  @IsEnum(RoleType)
  name?: RoleType;

  @ApiPropertyOptional({ example: 'Descripción actualizada' })
  @IsOptional()
  @IsString()
  description?: string;
}
