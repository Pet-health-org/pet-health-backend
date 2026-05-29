import { registerAs } from '@nestjs/config';

export function parseJwtExpiresInToSeconds(value: string | undefined): number {
  const rawValue = value || '1800';
  const numericValue = Number(rawValue);
  if (Number.isFinite(numericValue)) {
    return numericValue;
  }

  const match = rawValue.match(/^(\d+)(s|m|h|d)$/i);
  if (!match) {
    return 1800;
  }

  const amount = Number(match[1]);
  const unit = match[2].toLowerCase();
  const multipliers: Record<string, number> = {
    s: 1,
    m: 60,
    h: 60 * 60,
    d: 24 * 60 * 60,
  };

  return amount * multipliers[unit];
}

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
  expiresIn: parseJwtExpiresInToSeconds(process.env.JWT_EXPIRES_IN),
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
  saltRounds: parseInt(process.env.HASH_SALT_ROUNDS || '12', 10),
}));

export const paginationConfig = registerAs('pagination', () => ({
  defaultLimit: parseInt(process.env.PAGINATION_DEFAULT_LIMIT || '20', 10),
  maxLimit: parseInt(process.env.PAGINATION_MAX_LIMIT || '20', 10),
}));

export const smtpConfig = registerAs('smtp', () => ({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587', 10),
  user: process.env.SMTP_USER || '',
  password: process.env.SMTP_PASSWORD || '',
  from: process.env.SMTP_FROM || 'noreply@pethealth.com',
  secure: process.env.SMTP_SECURE === 'true',
}));

const configurations = [
  databaseConfig,
  jwtConfig,
  appConfig,
  horarioConfig,
  hashConfig,
  paginationConfig,
  smtpConfig,
];

export default configurations;
