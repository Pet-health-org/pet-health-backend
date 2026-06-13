# Guía de Estudio — PetHealth Backend

## Tecnologías y Herramientas Principales

| Tecnología | Propósito |
|---|---|
| **NestJS** | Framework de Node.js para construir APIs modulares y escalables |
| **TypeORM** | ORM para conectar y operar con la base de datos MySQL |
| **MySQL2** | Driver de base de datos MySQL |
| **Passport + JWT** | Autenticación y autorización basada en tokens |
| **BCrypt** | Hashing de contraseñas |
| **class-validator / class-transformer** | Validación y transformación de DTOs |
| **Swagger (OpenAPI)** | Documentación interactiva de la API |
| **Nodemailer** | Envío de correos electrónicos |
| **TypeScript** | Tipado estático para mayor seguridad y mantenibilidad |

---

## 1. Arquitectura General (NestJS)

Es un backend modular basado en **NestJS**. Cada módulo agrupa controlador, servicio, entidades y DTOs. El punto de entrada es `src/main.ts`.

### `main.ts` — Punto de entrada

```typescript
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Validación global con whitelist (rechaza campos no definidos)
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Swagger solo en desarrollo
  if (nodeEnv !== 'production') {
    app.enableCors();
    const config = new DocumentBuilder()
      .setTitle('PetHealth API')
      .addBearerAuth()
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('docs', app, document);
  }

  await app.listen(port);
}
```

**Conceptos clave:**
- `ValidationPipe` global: Aplica validaciones a todos los DTOs. `whitelist: true` elimina campos no definidos. `forbidNonWhitelisted: true` lanza error si se envía un campo extra.
- `Swagger`: Genera automáticamente documentación interactiva en `/docs`.
- `enableCors()`: Solo se activa en desarrollo para permitir orígenes cruzados.

### `app.module.ts` — Módulo raíz

```typescript
@Module({
  imports: [
    DatabaseModule,       // Configuración de MySQL
    SharedModule,         // Servicios globales (HashService)
    AuthModule,           // Autenticación JWT
    UserModule,           // CRUD de usuarios
    AuditoriaModule,      // Auditoría de acciones
    // ... otros módulos (CitaModule, MascotaModule, etc.)
  ],
  providers: [SeederService], // Seed de datos iniciales
})
export class AppModule {}
```

---

## 2. SEGURIDAD — Módulo de Autenticación (`auth`)

### Estrategias Passport

**`local.strategy.ts`** — Validación de credenciales (username + password):
```typescript
@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  async validate(username: string, password: string): Promise<any> {
    return await this.authService.validateUser({ username, password });
  }
}
```

**`jwt.strategy.ts`** — Validación del token JWT en cada request protegido:
```typescript
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UserService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('jwt.secret'),
    });
  }

  async validate(payload: JwtPayload): Promise<any> {
    const user = await this.userService.findOne(payload.sub);
    if (!user || user.status !== 'activo') {
      throw new UnauthorizedException('Usuario no autorizado');
    }
    return { id: user.id, username: user.username, rol: user.rol.name };
  }
}
```

### Guards (Guardianes de Rutas)

**`local-auth.guard.ts`** — Protege el login. Usa Passport con estrategia `'local'`:
```typescript
@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {}
```

**`jwt-auth.guard.ts`** — Protege rutas que requieren autenticación. Usa estrategia `'jwt'`:
```typescript
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  handleRequest(err, user, info) {
    if (err || !user)
      throw err || new UnauthorizedException('No autorizado');
    return user;
  }
}
```

**`roles.guard.ts`** — Control de acceso por rol (autorización):
```typescript
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<RoleType[]>(
      ROLES_KEY, [context.getHandler(), context.getClass()]
    );
    if (!requiredRoles) return true;

    const { user } = context.switchToHttp().getRequest();
    const hasRole = requiredRoles.some((role) => user.rol === role);
    if (!hasRole)
      throw new ForbiddenException('No tienes permisos para acceder a este recurso');
    return true;
  }
}
```

### Decorador `@Roles()`

```typescript
export const ROLES_KEY = 'roles';
export const Roles = (...roles: RoleType[]) => SetMetadata(ROLES_KEY, roles);
```

**Uso típico:**
```typescript
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(RoleType.ADMIN, RoleType.VETERINARIO)
@Get()
findAll() { ... }
```

### `auth.service.ts` — Lógica de autenticación

```typescript
@Injectable()
export class AuthService {
  // Bloqueo por intentos fallidos
  async validateUser(loginDto: LoginDto): Promise<AuthUser> {
    const user = await this.userAuth.findForAuth(loginDto.username);

    // 1. Verifica si la cuenta está bloqueada
    if (user.bloqueadoHasta && new Date() < new Date(user.bloqueadoHasta))
      throw new UnauthorizedException(`Cuenta bloqueada...`);

    // 2. Compara contraseña con bcrypt
    const isValid = await this.userAuth.comparePassword(loginDto.password, user.password);

    // 3. Si falla, incrementa intentos — bloquea si llega a 3
    if (!isValid) {
      const nuevosIntentos = (user.intentosFallidos || 0) + 1;
      if (nuevosIntentos >= MAX_INTENTOS) {
        // Bloquea por 15 minutos
        const bloqueoHasta = new Date(Date.now() + 15 * 60 * 1000);
        await this.userRepository.update(user.id, { intentosFallidos: nuevosIntentos, bloqueadoHasta });
        throw new UnauthorizedException('Cuenta bloqueada temporalmente por 15 minutos');
      }
      // 4. Si éxito, reinicia contador
      await this.userRepository.update(user.id, { intentosFallidos: 0, bloqueadoHasta: null });
    }
  }

  async login(user: AuthUser): Promise<{ access_token: string }> {
    const payload: JwtPayload = { sub: user.id, username: user.username, rol: user.rol };
    const token = await this.jwtService.signAsync(payload, { secret, expiresIn });
    return { access_token: token, expires_in: expiresIn };
  }
}
```

**Medidas de seguridad clave en Auth:**
1. **Hash de contraseñas** con BCrypt (12 rondas de salt)
2. **3 intentos fallidos** → bloqueo de 15 minutos
3. **JWT con expiración** configurable (por defecto 1800s = 30 min)
4. **Verificación de estado activo** del usuario antes de autenticar
5. **Roles guard** separa autenticación de autorización
6. **`toJSON()` en entidad User** excluye el campo `password` de cualquier serialización

### `auth.controller.ts`

```typescript
@Post('login')
@UseGuards(LocalAuthGuard)  // Primero valida credenciales
async login(@Request() req, @Body() _loginDto: LoginDto) {
  return this.authService.login(req.user);  // req.user viene de LocalStrategy
}

@Post('refresh')
@UseGuards(JwtAuthGuard)   // Requiere token válido
async refreshToken(@Request() req) {
  return this.authService.refreshToken(req.user.id);
}
```

---

## 3. Hash de Contraseñas

### `hash.service.ts`

```typescript
@Injectable()
export class HashService {
  constructor(
    @Inject(hashConfig.KEY)
    private readonly config: ConfigType<typeof hashConfig>,
  ) {}

  async hash(password: string): Promise<string> {
    return await bcrypt.hash(password, this.config.saltRounds);  // 12 rounds
  }

  async compare(password: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(password, hash);
  }
}
```

**BCrypt es un algoritmo de hash lento** diseñado específicamente para contraseñas. El número de `saltRounds` (12) determina cuántas iteraciones se hacen —más rounds = más seguro pero más lento.

---

## 4. Módulo de Usuarios (`user`)

### Entidad `User`

```typescript
@Entity('users')
@Unique(['email'])
@Unique(['username'])
export class User {
  @PrimaryGeneratedColumn('uuid')  id: string;
  @Column()                        username: string;
  @Column()                        email: string;
  @Column()                        password: string;            // Hasheada con bcrypt
  @Column({ type: 'enum', enum: UserStatus, default: 'activo' }) status: UserStatus;
  @Column({ default: 0 })          intentosFallidos: number;
  @Column({ nullable: true })      bloqueadoHasta: Date | null;
  @ManyToOne(() => Rol)            rol: Rol;                    // Relación N:1 con roles

  toJSON() {  // Excluye password de respuestas JSON
    const { password, ...user } = this;
    return user;
  }
}
```

### `user.service.ts`

```typescript
async create(createUserDto: CreateUserDto): Promise<User> {
  // 1. Verifica que el rol existe
  const rol = await this.rolService.findByName(rolId);

  // 2. Verifica unicidad de email y username
  if (await this.userRepository.findOne({ where: { email } }))
    throw new ConflictException('El email ya está registrado');

  // 3. Hashea la contraseña ANTES de guardar
  const hashedPassword = await this.hashService.hash(password);
  const user = this.userRepository.create({ ...createUserDto, password: hashedPassword, rol });
  return await this.userRepository.save(user);
}
```

**Patrón de interfaz segregada:**
```typescript
interface IUserReader { findAll(), findOne(), findByEmail(), ... }
interface IUserWriter { create(), update(), remove() }
interface IUserAuth { validateCredentials(), findForAuth(), comparePassword() }
interface IUserService extends IUserReader, IUserWriter, IUserAuth {}
```

---

## 5. Módulo de Roles (`rol`)

### Entidad `Rol`

```typescript
export enum RoleType {
  ADMIN = 'admin',
  VETERINARIO = 'veterinario',
  RECEPCIONISTA = 'recepcionista',
  PROPIETARIO = 'propietario',
}

@Entity('roles')
export class Rol {
  @PrimaryGeneratedColumn('uuid')  id: string;
  @Column({ type: 'enum', enum: RoleType, unique: true })  name: RoleType;
  @Column({ nullable: true })       description: string;
}
```

---

## 6. Auditoría (`auditoria`)

### Entidad `Auditoria`

```typescript
@Entity('auditoria')
@Index('IDX_auditoria_usuario', ['usuarioId'])
@Index('IDX_auditoria_accion', ['accion'])
@Index('IDX_auditoria_fecha', ['fecha'])
export class Auditoria {
  @PrimaryGeneratedColumn('uuid')  id: string;
  @Column('uuid')                  usuarioId: string;
  @Column()                        accion: string;
  @Column('timestamp')             fecha: Date;
  @Column({ nullable: true })      ip: string | null;
  @Column('uuid', { nullable: true }) registroId: string | null;
  @ManyToOne(() => User)           usuario: User;
}
```

### Decorador `@AuditLog()`

```typescript
export const AuditLog = (action: string) => SetMetadata(AUDIT_LOG_KEY, action);
```

### Interceptor `AuditLogInterceptor`

```typescript
@Injectable()
export class AuditLogInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const action = this.reflector.get<string>(AUDIT_LOG_KEY, context.getHandler());
    if (!action) return next.handle();

    return next.handle().pipe(
      tap((result) => {
        this.auditoriaService.log({
          usuarioId: user?.id,
          accion: action,
          ip: request.ip,
          registroId: result?.id || request.params.id,
        });
      }),
    );
  }
}
```

**Uso:** Se declara como `APP_INTERCEPTOR` global en `AuditoriaModule`, pero solo registra cuando se usa el decorador `@AuditLog()` en un controlador.

```typescript
@Patch(':id')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(RoleType.ADMIN)
@AuditLog('MODIFICAR_USUARIO')   // <-- Se registra automáticamente
update(@Param('id') id: string, @Body() dto: UpdateUserDto) { ... }
```

---

## 7. Configuración Centralizada (`config/configuration.ts`)

Usa `registerAs()` de `@nestjs/config` para crear namespaces de configuración:

```typescript
export const databaseConfig = registerAs('database', () => ({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306', 10),
  username: process.env.DB_USERNAME || 'root',
  password: process.env.DB_PASSWORD || '',
  name: process.env.DB_NAME || 'pethealth',
  synchronize: process.env.DB_SYNCHRONIZE === 'true',
}));

export const jwtConfig = registerAs('jwt', () => ({
  secret: process.env.JWT_SECRET || '',
  expiresIn: parseJwtExpiresInToSeconds(process.env.JWT_EXPIRES_IN),
}));

export const hashConfig = registerAs('hash', () => ({
  saltRounds: parseInt(process.env.HASH_SALT_ROUNDS || '12', 10),
}));
```

**Acceso tipado en servicios:**
```typescript
@Inject(jwtConfig.KEY)
private readonly config: ConfigType<typeof jwtConfig>
```

---

## 8. Base de Datos (`database/database.module.ts`)

```typescript
@Module({
  imports: [
    ConfigModule.forRoot({ load: configurations, isGlobal: true }),
    TypeOrmModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get<string>('database.host'),
        port: configService.get<number>('database.port'),
        username: configService.get<string>('database.username'),
        password: configService.get<string>('database.password'),
        database: configService.get<string>('database.name'),
        entities: entities,
        synchronize: configService.get<boolean>('database.synchronize'),
        connectorPackage: 'mysql2',
      }),
      inject: [ConfigService],
    }),
  ],
})
export class DatabaseModule {}
```

**⚠️ `synchronize: true`** solo en desarrollo. En producción se usa `false` y las migraciones se manejan manualmente.

---

## 9. Módulo de Email (`email`)

```typescript
@Module({
  providers: [
    {
      provide: 'EMAIL_TRANSPORT',
      useFactory: (configService: ConfigService) => {
        const smtp = configService.get('smtp');
        return nodemailer.createTransport({
          host: smtp.host, port: smtp.port,
          secure: smtp.secure,
          auth: { user: smtp.user, pass: smtp.password },
        });
      },
      inject: [ConfigService],
    },
    EmailService,
  ],
  exports: [EmailService],
})
export class EmailModule {}
```

El servicio usa **plantillas Handlebars** (`.hbs`) para renderizar correos con variables como `{{nombrePropietario}}`, `{{fecha}}`, etc.

---

## 10. Seeder de Datos Iniciales (`seeder.service.ts`)

```typescript
@Injectable()
export class SeederService implements OnModuleInit {
  async onModuleInit() {
    await this.seedRoles();       // Crea: admin, veterinario, recepcionista, propietario
    await this.seedAdminUser();   // admin@pethealth.com / Admin123!
    await this.seedEspecies();    // Perro, Gato, Ave
    await this.seedRazas();       // Razas vinculadas a cada especie
  }
}
```

---

## 11. DTOs y Validación

### `user.dto.ts` (ejemplo)

```typescript
export class CreateUserDto {
  @IsString() @MinLength(3) @MaxLength(50)
  username: string;

  @IsEmail()
  email: string;

  @IsString() @MinLength(6)
  password: string;

  @IsEnum(RoleType)
  rolId: RoleType;
}
```

### `auth.dto.ts`

```typescript
export class LoginDto {
  @IsString()
  username: string;

  @IsString() @MinLength(6)
  password: string;
}
```

**class-validator** provee decoradores como `@IsEmail()`, `@MinLength()`, `@IsEnum()`, `@IsUUID()`, `@IsOptional()`. NestJS los ejecuta automáticamente mediante el `ValidationPipe` global.

---

## 12. Medidas de Seguridad — Resumen

| Medida | Implementación | Archivo |
|---|---|---|
| Contraseñas hasheadas | BCrypt con 12 salt rounds | `hash.service.ts` |
| Contraseña excluida de respuestas | Método `toJSON()` | `user.entity.ts:104` |
| Bloqueo por intentos fallidos | 3 intentos → bloqueo 15 min | `auth.service.ts:63-73` |
| Validación de entrada | `ValidationPipe` global + DTOs | `main.ts:38-52` |
| JWT con expiración | Token expira en 30 min | `configuration.ts:37-39` |
| Autenticación por token | Passport JWT Strategy | `jwt.strategy.ts` |
| Autorización por roles | `RolesGuard` + decorador `@Roles()` | `roles.guard.ts` |
| Auditoría de acciones | `AuditLogInterceptor` | `audit-log.interceptor.ts` |
| CORS solo en desarrollo | Condicional en `main.ts` | `main.ts:54` |
| Sanitización de IPs | Se registra IP en logs de auditoría | `audit-log.interceptor.ts:38` |

---

## 13. Flujo Completo de Autenticación

```
1. POST /auth/login  { username, password }
2. LocalAuthGuard → LocalStrategy.validate(username, password)
3. AuthService.validateUser():
   a. Busca usuario por username/email
   b. Verifica si está bloqueado (intentosFallidos >= 3)
   c. Compara contraseña con bcrypt
   d. Si falla: incrementa intentos, posible bloqueo
   e. Si ok: reinicia intentos, verifica status 'activo'
4. AuthService.login(): genera JWT { sub, username, rol }
5. Devuelve { access_token, expires_in }

Para rutas protegidas:
6. GET /api/recurso  (Authorization: Bearer <token>)
7. JwtAuthGuard → JwtStrategy.validate(payload)
8. Busca usuario en BD, verifica que esté activo
9. RolesGuard (si aplica): verifica rol del usuario contra roles requeridos
10. Ejecuta el controlador con req.user disponible
```

---

## 14. Preguntas Frecuentes para Sustentación

### ¿Por qué NestJS?
Es un framework progresivo de Node.js que usa **decoradores** y **TypeScript** para organizar el código en módulos, controladores y servicios. Facilita inyección de dependencias, testing y escalabilidad.

### ¿Qué es un Guard?
Una clase que implementa `CanActivate` y decide si una ruta puede ejecutarse. Se usa para **autenticación** (JwtAuthGuard) y **autorización** (RolesGuard).

### ¿Cómo funciona Passport?
Passport es middleware de autenticación. NestJS lo integra con `@nestjs/passport`. Cada estrategia (`local`, `jwt`) define cómo validar credenciales. El guard ejecuta la estrategia y, si es exitosa, guarda el usuario en `req.user`.

### ¿Qué es un DTO y para qué sirve?
**Data Transfer Object**: define la estructura de datos que se espera en una petición. Se valida con `class-validator`. Protege contra inyección de campos maliciosos y documenta la API.

### ¿Qué es un Interceptor?
Un interceptor envuelve la ejecución de un método. Puede transformar el resultado o ejecutar lógica antes/después. El `AuditLogInterceptor` registra en BD cada acción decorada con `@AuditLog()`.

### ¿Cómo se protege la contraseña?
Se usa **BCrypt** con 12 rondas de sal. Es un algoritmo **lento por diseño** que resiste ataques de fuerza bruta. El campo `password` se excluye de respuestas JSON mediante `toJSON()`.

### ¿Qué es JWT?
**JSON Web Token**: estándar para transmitir información de forma segura como un objeto JSON firmado. Contiene `sub` (ID usuario), `username`, `rol`. Se firma con un secreto y expira en 30 minutos.

### ¿Qué es TypeORM?
Es un **ORM** (Object-Relational Mapping) que mapea tablas MySQL a clases TypeScript usando decoradores como `@Entity()`, `@Column()`, `@ManyToOne()`, etc.

### ¿Cómo funciona el bloqueo de cuentas?
El campo `intentosFallidos` se incrementa en cada intento fallido. Al llegar a 3, se asigna `bloqueadoHasta` con fecha futura (+15 min). En cada intento de login se verifica si `bloqueadoHasta > ahora`.

### ¿Qué es el módulo de auditoría?
Cada acción sensible (`MODIFICAR_USUARIO`, `ELIMINAR_USUARIO`, `CAMBIAR_ESTADO_USUARIO`) se registra automáticamente en la tabla `auditoria` con: usuario que ejecutó, acción, IP, ID del registro afectado y timestamp.
