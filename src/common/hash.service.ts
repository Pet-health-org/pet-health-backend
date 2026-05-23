import { Injectable, Inject } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { hashConfig } from '../config/configuration';

@Injectable()
export class HashService {
  constructor(
    @Inject(hashConfig.KEY)
    private readonly config: ConfigType<typeof hashConfig>,
  ) {}

  async hash(password: string): Promise<string> {
    return await bcrypt.hash(password, this.config.saltRounds);
  }

  async compare(password: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(password, hash);
  }
}
