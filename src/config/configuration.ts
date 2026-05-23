import { registerAs } from '@nestjs/config';
export const databaseConfig = registerAs('database', () => ({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306', 10),
  username: process.env.DB_USERNAME || 'root',
  password: process.env.DB_PASSWORD || '',
  name: process.env.DB_NAME || 'pethealth',
  synchronize: process.env.DB_SYNCHRONIZE === 'true',
  logging: process.env.DB_LOGGING === 'true',
}));

export const jwtConfig = registerAs('jwt', () => ({
  secret: process.env.JWT_SECRET || '',
  expiresIn: parseInt(process.env.JWT_EXPIRES_IN || '604800', 10),
}));

export const appConfig = registerAs('app', () => ({
  port: parseInt(process.env.PORT || '3000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
}));

export const horarioConfig = registerAs('horario', () => ({
  duracionMinutos: parseInt(process.env.HORARIO_DURACION_MINUTOS || '30', 10),
  horaInicio: parseInt(process.env.HORARIO_HORA_INICIO || '7', 10),
  horaFin: parseInt(process.env.HORARIO_HORA_FIN || '19', 10),
}));

export const hashConfig = registerAs('hash', () => ({
  saltRounds: parseInt(process.env.HASH_SALT_ROUNDS || '10', 10),
}));

export const paginationConfig = registerAs('pagination', () => ({
  defaultLimit: parseInt(process.env.PAGINATION_DEFAULT_LIMIT || '20', 10),
  maxLimit: parseInt(process.env.PAGINATION_MAX_LIMIT || '20', 10),
}));

const configurations = [
  databaseConfig,
  jwtConfig,
  appConfig,
  horarioConfig,
  hashConfig,
  paginationConfig,
];

export default configurations;
