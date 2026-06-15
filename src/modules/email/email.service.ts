import { Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import * as fs from 'node:fs';
import * as path from 'node:path';

export type TipoPlantilla =
  | 'confirmacion_cita'
  | 'recordatorio_cita'
  | 'alerta_vacuna'
  | 'invitacion_integrante';

export interface DatosPlantilla {
  nombrePropietario?: string;
  nombreMascota?: string;
  fecha?: string;
  hora?: string;
  motivo?: string;
  codigoInvitacion?: string;
  tipoAcceso?: string;
}

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private asuntos: Record<string, string>;

  constructor(
    @Inject('EMAIL_TRANSPORT') private readonly transporter: nodemailer.Transporter,
    private readonly configService: ConfigService,
  ) {
    const asuntosPath = path.join(__dirname, 'handlebars', 'asuntos.json');
    try {
      this.asuntos = JSON.parse(fs.readFileSync(asuntosPath, 'utf-8'));
    } catch {
      this.asuntos = {};
    }
  }

  private renderizarTemplate(
    tipo: TipoPlantilla,
    datos: DatosPlantilla,
  ): { asunto: string; cuerpo: string } {
    const templatePath = path.join(__dirname, 'handlebars', `${tipo}.hbs`);
    let template: string;
    try {
      template = fs.readFileSync(templatePath, 'utf-8');
    } catch {
      this.logger.error(`Plantilla no encontrada: ${tipo}`);
      template = '';
    }

    const asunto = this.asuntos[tipo] || 'PetHealth';

    const reemplazar = (texto: string): string =>
      texto
        .replace(/\{\{nombrePropietario\}\}/g, datos.nombrePropietario || '')
        .replace(/\{\{nombreMascota\}\}/g, datos.nombreMascota || '')
        .replace(/\{\{fecha\}\}/g, datos.fecha || '')
        .replace(/\{\{hora\}\}/g, datos.hora || '')
        .replace(/\{\{motivo\}\}/g, datos.motivo || '')
        .replace(/\{\{codigoInvitacion\}\}/g, datos.codigoInvitacion || '')
        .replace(/\{\{tipoAcceso\}\}/g, datos.tipoAcceso || '');

    return {
      asunto: reemplazar(asunto),
      cuerpo: reemplazar(template),
    };
  }

  async enviarCorreo(
    destino: string,
    tipo: TipoPlantilla,
    datos: DatosPlantilla,
  ): Promise<void> {
    const { asunto, cuerpo } = this.renderizarTemplate(tipo, datos);

    try {
      const info = await this.transporter.sendMail({
        from: this.configService.get('smtp').from,
        to: destino,
        subject: asunto,
        html: cuerpo,
      });
      if (info.messageId) {
        this.logger.log(`Correo enviado a ${destino} | ID: ${info.messageId}`);
      } else {
        this.logger.warn(
          `Correo simulado (local) para ${destino}: ${JSON.stringify(datos)}`,
        );
      }
    } catch (error) {
      this.logger.error(
        `Error enviando correo a ${destino}: ${error.message}`,
      );
      this.logger.warn(
        `Usando fallback local. Datos: ${JSON.stringify(datos)}`,
      );
    }
  }
}
