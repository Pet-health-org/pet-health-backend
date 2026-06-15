import { Module, Logger } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EmailService } from './email.service';
import * as nodemailer from 'nodemailer';

@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: 'EMAIL_TRANSPORT',
      useFactory: (configService: ConfigService) => {
        const smtp = configService.get('smtp');
        if (!smtp.user || !smtp.password) {
          Logger.warn(
            'SMTP_USER o SMTP_PASSWORD no configurados. Usando transporte local simulado.',
            'EmailModule',
          );
          return nodemailer.createTransport({ jsonTransport: true });
        }
        return nodemailer.createTransport({
          host: smtp.host,
          port: smtp.port,
          secure: smtp.secure,
          auth: { user: smtp.user, pass: smtp.password },
        });
      },
      inject: [ConfigService],
    },
    EmailService,
  ],
  exports: [EmailService],
})
export class EmailModule {}
