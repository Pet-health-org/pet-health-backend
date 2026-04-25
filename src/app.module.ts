import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Rol } from './modules/rol/entities/rol.entity';
import { User } from './modules/user/entities/user.entity';
import { Admin } from './modules/user/entities/admin.entity';
import { Veterinario } from './modules/user/entities/veterinario.entity';
import { Recepcionista } from './modules/user/entities/recepcionista.entity';
import { Propietario } from './modules/user/entities/propietario.entity';
import { RolModule } from './modules/rol/rol.module';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { AdminModule } from './modules/admin/admin.module';
import { VeterinarioModule } from './modules/veterinario/veterinario.module';
import { RecepcionistaModule } from './modules/recepcionista/recepcionista.module';
import { PropietarioModule } from './modules/propietario/propietario.module';
import { SeederService } from './common/seeder.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_NAME'),
        entities: [
          Rol,
          User,
          Admin,
          Veterinario,
          Recepcionista,
          Propietario,
        ],
        synchronize: configService.get<boolean>('DB_SYNCHRONIZE'),
        logging: configService.get<boolean>('DB_LOGGING'),
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([Rol, User, Admin, Veterinario, Recepcionista, Propietario]),
    RolModule,
    UserModule,
    AuthModule,
    AdminModule,
    VeterinarioModule,
    RecepcionistaModule,
    PropietarioModule,
  ],
  controllers: [AppController],
  providers: [AppService, SeederService],
})
export class AppModule {}
