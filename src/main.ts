import { NestFactory } from '@nestjs/core';
import {
  BadRequestException,
  ValidationError,
  ValidationPipe,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

function formatValidationErrors(
  validationErrors: ValidationError[],
): Record<string, string[]> {
  return validationErrors.reduce<Record<string, string[]>>((errors, error) => {
    const messages = error.constraints ? Object.values(error.constraints) : [];
    if (messages.length > 0) {
      errors[error.property] = messages;
    }

    if (error.children && error.children.length > 0) {
      const childErrors = formatValidationErrors(error.children);
      for (const [field, fieldMessages] of Object.entries(childErrors)) {
        errors[`${error.property}.${field}`] = fieldMessages;
      }
    }

    return errors;
  }, {});
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);
  const port = configService.get<number>('app.port', 3000);
  const nodeEnv = configService.get<string>('app.nodeEnv', 'development');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
      exceptionFactory: (validationErrors: ValidationError[] = []) =>
        new BadRequestException({
          message: 'Errores de validacion',
          errors: formatValidationErrors(validationErrors),
        }),
    }),
  );

  if (nodeEnv !== 'production') {
    app.enableCors();
    const swaggerConfig = new DocumentBuilder()
      .setTitle('PetHealth API')
      .setDescription('API del sistema de gestión veterinaria PetHealth')
      .setVersion('1.0')
      .addBearerAuth()
      .build();
    const document = SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup('docs', app, document);
  }

  await app.listen(port);
  console.log(`Application running on http://localhost:${port}`);
  console.log(`Swagger documentation: http://localhost:${port}/docs`);
}
void bootstrap();
