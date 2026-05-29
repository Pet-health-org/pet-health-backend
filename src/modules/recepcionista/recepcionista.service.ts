import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { User } from '../user/entities/user.entity';
import { RoleType } from '../rol/entities/rol.entity';

@Injectable()
export class RecepcionistaService {
  constructor(private readonly userService: UserService) {}

  async findAll(): Promise<User[]> {
    return this.userService.findByRol(RoleType.RECEPCIONISTA);
  }

  async findOne(id: string): Promise<User> {
    return this.userService.findOne(id);
  }
}
