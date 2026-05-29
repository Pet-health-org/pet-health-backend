import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { UpdateUserDto } from '../user/dto/user.dto';
import { User } from '../user/entities/user.entity';
import { RoleType } from '../rol/entities/rol.entity';

@Injectable()
export class AdminService {
  constructor(private readonly userService: UserService) {}

  async findAll(): Promise<User[]> {
    return this.userService.findByRol(RoleType.ADMIN);
  }

  async findOne(id: string): Promise<User> {
    return this.userService.findOne(id);
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    return this.userService.update(id, updateUserDto);
  }

  async remove(id: string): Promise<void> {
    await this.userService.remove(id);
  }
}
