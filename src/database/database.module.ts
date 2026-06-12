import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { existsSync, readFileSync } from 'fs';
import { resolve } from 'path';
import configurations from '../config/configuration';
import { entities } from './entities';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: configurations,
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get<string>('database.host'),
        port: configService.get<number>('database.port'),
        username: configService.get<string>('database.username'),
        password: configService.get<string>('database.password'),
        database: configService.get<string>('database.name'),
        entities: entities,
        synchronize: configService.get<boolean>('database.synchronize'),
        logging: configService.get<boolean>('database.logging'),
        ssl: (() => {
          if (!configService.get<boolean>('database.ssl')) {
            return false;
          }

          const caInline = configService.get<string>('database.sslCa');
          const caPath = configService.get<string>('database.sslCaPath', 'CA');
          const resolvedPath = resolve(process.cwd(), caPath);
          const caFile = existsSync(resolvedPath)
            ? readFileSync(resolvedPath, 'utf8')
            : '';
          const ca = caInline || caFile;

          return ca
            ? { rejectUnauthorized: true, ca }
            : { rejectUnauthorized: true };
        })(),
        connectorPackage: 'mysql2',
      }),
      inject: [ConfigService],
    }),
  ],
  exports: [TypeOrmModule],
})
export class DatabaseModule {}
