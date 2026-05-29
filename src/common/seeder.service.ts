import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Rol } from '../modules/rol/entities/rol.entity';
import { User } from '../modules/user/entities/user.entity';
import { RoleType } from '../modules/rol/entities/rol.entity';
import { UserStatus } from '../modules/user/entities/user.entity';
import { Especie } from '../modules/especie/entities/especie.entity';
import { Raza } from '../modules/raza/entities/raza.entity';

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

    const existingAdmin = await this.userRepository.findOne({
      where: { email: 'admin@pethealth.com' },
    });

    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash('Admin123!', 10);
      const adminUser = this.userRepository.create({
        username: 'admin',
        email: 'admin@pethealth.com',
        password: hashedPassword,
        rol: adminRol,
        status: UserStatus.ACTIVO,
        isActive: true,
      });
      await this.userRepository.save(adminUser);
      console.log('Usuario admin creado: admin@pethealth.com / Admin123!');
    }
  }

  private async seedEspecies(): Promise<void> {
    const especiesData = [
      { nombre: 'Perro', observaciones: 'Canis lupus familiaris' },
      { nombre: 'Gato', observaciones: 'Felis catus' },
      { nombre: 'Ave', observaciones: 'Clase Aves' },
    ];

    for (const data of especiesData) {
      const existing = await this.especieRepository.findOne({
        where: { nombre: data.nombre },
      });
      if (!existing) {
        await this.especieRepository.save(
          this.especieRepository.create(data),
        );
        console.log(`Especie creada: ${data.nombre}`);
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
}
