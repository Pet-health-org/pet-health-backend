import { IsEmail, IsEnum, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { TipoAcceso } from '../entities/invitacion.entity';

export class InviteIntegranteDto {
  @ApiProperty({ example: 'usuario@example.com' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ enum: TipoAcceso, example: TipoAcceso.BACKEND })
  @IsEnum(TipoAcceso)
  @IsNotEmpty()
  tipoAcceso: TipoAcceso;
}
