import { Module } from '@nestjs/common';
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
        const transportOptions: nodemailer.TransportOptions = {
          host: smtp.host,
          port: smtp.port,
          secure: smtp.secure,
          auth:
            smtp.user && smtp.password
              ? { user: smtp.user, pass: smtp.password }
              : undefined,
          connectionTimeout: 10000,
          greetingTimeout: 10000,
          socketTimeout: 15000,
        };

        if (smtp.secure) {
          transportOptions.tls = {
            rejectUnauthorized: true,
          };
        }

        return nodemailer.createTransport(transportOptions);
      },
      inject: [ConfigService],
    },
    EmailService,
  ],
  exports: [EmailService],
})
export class EmailModule {}
