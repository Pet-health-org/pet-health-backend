import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { IntegranteService } from './integrante.service';
import { InviteIntegranteDto } from './dto/invite-integrante.dto';
import { RegisterIntegranteDto } from './dto/register-integrante.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { RoleType } from '../rol/entities/rol.entity';

@ApiTags('Integrantes')
@Controller('integrantes')
export class IntegranteController {
  constructor(private readonly integranteService: IntegranteService) {}

  @Post('invite')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleType.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Enviar invitación a un integrante (Solo Admin)' })
  @ApiResponse({ status: 201, description: 'Invitación enviada.' })
  invite(@Body() inviteDto: InviteIntegranteDto) {
    return this.integranteService.invite(inviteDto);
  }

  @Post('register')
  @ApiOperation({ summary: 'Registrarse usando un código de invitación' })
  @ApiResponse({
    status: 201,
    description: 'Integrante registrado exitosamente.',
  })
  register(@Body() registerDto: RegisterIntegranteDto) {
    return this.integranteService.register(registerDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleType.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Listar todos los integrantes (Solo Admin)' })
  @ApiResponse({ status: 200, description: 'Lista de integrantes retornada.' })
  findAll() {
    return this.integranteService.findAll();
  }
}
