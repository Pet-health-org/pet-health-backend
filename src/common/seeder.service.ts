import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Rol } from '../modules/rol/entities/rol.entity';
import { User } from '../modules/user/entities/user.entity';
import { RoleType } from '../modules/rol/entities/rol.entity';
import { UserStatus } from '../modules/user/entities/user.entity';
import { Especie } from '../modules/especie/entities/especie.entity';
import { Raza } from '../modules/raza/entities/raza.entity';
import { HashService } from './hash.service';

@Injectable()
export class SeederService implements OnModuleInit {
  constructor(
    @InjectRepository(Rol)
    private readonly rolRepository: Repository<Rol>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Especie)
    private readonly especieRepository: Repository<Especie>,
    @InjectRepository(Raza)
    private readonly razaRepository: Repository<Raza>,
    private readonly hashService: HashService,
    private readonly configService: ConfigService,
  ) {}

  async onModuleInit() {
    await this.seedRoles();
    await this.seedAdminUser();
    await this.seedEspecies();
    await this.seedRazas();
  }

  private async seedRoles(): Promise<void> {
    const roles: RoleType[] = [
      RoleType.ADMIN,
      RoleType.VETERINARIO,
      RoleType.RECEPCIONISTA,
      RoleType.PROPIETARIO,
    ];

    for (const roleName of roles) {
      const existingRol = await this.rolRepository.findOne({
        where: { name: roleName },
      });
      if (!existingRol) {
        const rol = this.rolRepository.create({
          name: roleName,
          description: this.getRoleDescription(roleName),
        });
        await this.rolRepository.save(rol);
        console.log(`Rol creado: ${roleName}`);
      }
    }
  }

  private async seedAdminUser(): Promise<void> {
    const adminRol = await this.rolRepository.findOne({
      where: { name: RoleType.ADMIN },
    });

    if (!adminRol) {
      console.error('No se encontró el rol ADMIN para crear el usuario admin');
      return;
    }

    const adminEmail = this.configService.get<string>('seeder.adminEmail', 'admin@pethealth.com');
    const adminUsername = this.configService.get<string>('seeder.adminUsername', 'admin');
    const adminPassword = this.configService.get<string>('seeder.adminPassword', 'Admin123!');

    const existingAdmin = await this.userRepository.findOne({
      where: { email: adminEmail },
    });

    if (!existingAdmin) {
      const hashedPassword = await this.hashService.hash(adminPassword);
      const adminUser = this.userRepository.create({
        username: adminUsername,
        email: adminEmail,
        password: hashedPassword,
        rol: adminRol,
        status: UserStatus.ACTIVO,
        isActive: true,
      });
      await this.userRepository.save(adminUser);
      console.log(`Usuario admin creado: ${adminEmail}`);
    }
  }

  private async seedEspecies(): Promise<void> {
    const especiesData = [
      {
        nombre: 'Perro',
        observaciones: 'Canis lupus familiaris',
        constantesVitales: this.getDefaultConstantes('Perro'),
      },
      {
        nombre: 'Gato',
        observaciones: 'Felis catus',
        constantesVitales: this.getDefaultConstantes('Gato'),
      },
      {
        nombre: 'Ave',
        observaciones: 'Clase Aves',
        constantesVitales: this.getDefaultConstantes('Ave'),
      },
    ];

    for (const data of especiesData) {
      const existing = await this.especieRepository.findOne({
        where: { nombre: data.nombre },
      });
      if (!existing) {
        await this.especieRepository.save(
          this.especieRepository.create({
            ...data,
            constantesVitales: JSON.stringify(data.constantesVitales),
          }),
        );
        console.log(`Especie creada: ${data.nombre}`);
      } else if (!existing.constantesVitales) {
        existing.constantesVitales = JSON.stringify(data.constantesVitales);
        await this.especieRepository.save(existing);
        console.log(`Constantes vitales creadas para: ${data.nombre}`);
      }
    }
  }

  private async seedRazas(): Promise<void> {
    const perro = await this.especieRepository.findOne({
      where: { nombre: 'Perro' },
    });
    const gato = await this.especieRepository.findOne({
      where: { nombre: 'Gato' },
    });
    const ave = await this.especieRepository.findOne({
      where: { nombre: 'Ave' },
    });

    const razasPorEspecie: { especie: typeof perro; nombres: string[] }[] = [
      {
        especie: perro,
        nombres: [
          'Labrador Retriever',
          'Pastor Alemán',
          'Bulldog Francés',
          'Golden Retriever',
          'Beagle',
          'Caniche',
          'Chihuahua',
          'Yorkshire Terrier',
          'Boxer',
          'Husky Siberiano',
          'Pug',
          'Shih Tzu',
          'Border Collie',
          'Dálmata',
          'Doberman',
          'Rottweiler',
          'Gran Danés',
          'Schnauzer',
          'Pomerania',
          'West Highland White Terrier',
        ],
      },
      {
        especie: gato,
        nombres: [
          'Persa',
          'Siames',
          'Maine Coon',
          'Bengalí',
          'Sphynx',
          'Ragdoll',
          'Exótico',
          'Azul Ruso',
          'British Shorthair',
          'Scottish Fold',
          'Abisinio',
          'Birmano',
          'Oriental',
          'Cornish Rex',
          'Bombay',
        ],
      },
      {
        especie: ave,
        nombres: [
          'Canario',
          'Periquito',
          'Agapornis',
          'Cacatúa',
          'Loro',
          'Ninfa',
          'Diamante Mandarín',
          'Papagayo',
          'Guacamayo',
          'Lorito',
          'Jilguero',
          'Cardenal',
          'Tórtola',
          'Myna',
          'Pinzón',
        ],
      },
    ];

    for (const grupo of razasPorEspecie) {
      if (!grupo.especie) continue;
      for (const nombre of grupo.nombres) {
        const existing = await this.razaRepository.findOne({
          where: { nombre, especieId: grupo.especie.id },
        });
        if (!existing) {
          await this.razaRepository.save(
            this.razaRepository.create({
              nombre,
              especieId: grupo.especie.id,
            }),
          );
          console.log(`Raza creada: ${nombre}`);
        }
      }
    }
  }

  private getRoleDescription(roleName: RoleType): string {
    const descriptions: Record<RoleType, string> = {
      [RoleType.ADMIN]: 'Administrador del sistema - acceso total',
      [RoleType.VETERINARIO]: 'Personal veterinario - atención médica',
      [RoleType.RECEPCIONISTA]: 'Personal de recepción - gestión de citas',
      [RoleType.PROPIETARIO]: 'Propietario de mascotas - cliente',
    };
    return descriptions[roleName];
  }

  private getDefaultConstantes(nombre: string) {
    const constantes = {
      Perro: {
        temperatura: { minimo: 38.0, maximo: 39.2, unidad: '°C' },
        frecuenciaCardiaca: { minimo: 60, maximo: 140, unidad: 'lpm' },
        frecuenciaRespiratoria: { minimo: 10, maximo: 35, unidad: 'rpm' },
      },
      Gato: {
        temperatura: { minimo: 38.0, maximo: 39.2, unidad: '°C' },
        frecuenciaCardiaca: { minimo: 140, maximo: 220, unidad: 'lpm' },
        frecuenciaRespiratoria: { minimo: 20, maximo: 40, unidad: 'rpm' },
      },
      Ave: {
        temperatura: { minimo: 40.0, maximo: 42.0, unidad: '°C' },
        frecuenciaCardiaca: { minimo: 150, maximo: 400, unidad: 'lpm' },
        frecuenciaRespiratoria: { minimo: 15, maximo: 60, unidad: 'rpm' },
      },
    };

    return constantes[nombre];
  }
}
