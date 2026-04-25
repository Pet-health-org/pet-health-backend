import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Rol } from '../modules/rol/entities/rol.entity';
import { User } from '../modules/user/entities/user.entity';
import { RoleType } from '../modules/rol/entities/rol.entity';
import { UserStatus } from '../modules/user/entities/user.entity';

@Injectable()
export class SeederService implements OnModuleInit {
  constructor(
    @InjectRepository(Rol)
    private readonly rolRepository: Repository<Rol>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async onModuleInit() {
    await this.seedRoles();
    await this.seedAdminUser();
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
