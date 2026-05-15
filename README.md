# Pet Health Backend (NestJS + TypeORM + MySQL)

Backend del sistema PetHealth. API REST con autenticacion JWT, Swagger en desarrollo y persistencia en MySQL via TypeORM.

## Requisitos

- Node.js (recomendado: LTS)
- MySQL 8+ (o compatible)
- npm

## Configuracion

1. Instalar dependencias:
   ```bash
   npm install
   ```
2. Crear `.env` a partir de `.env.example` (raiz del repo).
3. Asegurar que MySQL esta corriendo y que la BD existe (`DB_NAME`).

Variables principales (ver `.env.example`):

- DB: `DB_HOST`, `DB_PORT`, `DB_USERNAME`, `DB_PASSWORD`, `DB_NAME`
- TypeORM: `DB_SYNCHRONIZE` (en dev puede ir `true`), `DB_LOGGING`
- JWT: `JWT_SECRET`, `JWT_EXPIRES_IN`
- App: `PORT`, `NODE_ENV`

## Ejecutar

- Desarrollo (watch):
  ```bash
  npm run start:dev
  ```
- Produccion:
  ```bash
  npm run build
  npm run start:prod
  ```

Cuando `NODE_ENV != production`:

- Swagger: `http://localhost:<PORT>/docs`
- CORS habilitado

## Seed (usuario admin)

En el arranque, el `SeederService` crea roles y un usuario admin si no existen.

- Email: `admin@pethealth.com`
- Password: `Admin123!`

## Autenticacion (JWT)

1. Login:
   - `POST /auth/login`
   - Body:
     ```json
     { "username": "admin@pethealth.com", "password": "Admin123!" }
     ```
   - Respuesta:
     ```json
     { "access_token": "<jwt>" }
     ```
2. Usar token en requests:
   - Header: `Authorization: Bearer <jwt>`

## Roles

Roles definidos:

- `admin`
- `veterinario`
- `recepcionista`
- `propietario`

Cada endpoint documenta roles requeridos en Swagger.

## Endpoints (resumen)

### Propietarios

Nota: un "propietario" se maneja como un `user` con rol `propietario`.

- `POST /propietarios` (admin, recepcionista)
  - Crea un propietario (valida email, campos obligatorios y unicidad de `numeroIdentificacion`).
  - `201` OK: retorna el objeto creado con `id` UUID.
  - `409` si `numeroIdentificacion` ya existe (tambien valida duplicados de `email` y `username`).
  - Seguridad: nunca retorna `password` (se hashea con bcrypt).

- `GET /propietarios?q=<termino>&page=1&limit=20` (admin, recepcionista)
  - Busca simultaneamente en `nombreCompleto`, `numeroIdentificacion`, `telefono`.
  - Busqueda parcial (`LIKE %termino%`).
  - Paginacion con maximo 20 por pagina.
  - Siempre retorna `200` con array (puede ser `[]`).

- `GET /propietarios/:id` (admin, recepcionista)

### Mascotas

- `POST /mascotas` (admin, recepcionista, propietario)
  - Verifica que `propietarioId` exista (si no: `404`).
  - `peso` debe ser > 0.
  - `especie` controlada (enum): `perro`, `gato`, `ave`, `otro`.
  - `id` se genera automaticamente (UUID).

### Especies y constantes vitales

- `GET /especies/:especieId/constantes` (autenticado)
  - Retorna rangos de temperatura, frecuencia cardíaca y frecuencia respiratoria con valores `minimo`, `maximo`, `unidad`.
  - Los rangos se almacenan como JSON estructurado en la entidad `Especie`.
  - `404` si la especie no existe o no tiene rangos definidos.

- `PUT /especies/:especieId/constantes` (admin)
  - Body esperado:
    ```json
    {
      "temperatura": { "minimo": 38.0, "maximo": 39.2, "unidad": "°C" },
      "frecuenciaCardiaca": { "minimo": 60, "maximo": 120, "unidad": "lpm" },
      "frecuenciaRespiratoria": { "minimo": 10, "maximo": 30, "unidad": "rpm" }
    }
    ```

### Citas

- `POST /citas` (admin, recepcionista)
  - Valida horario laboral (lunes a sábado 7:00 AM - 7:00 PM).
  - Valida que el veterinario no tenga otra cita en el mismo horario (duración mínima 30 min).
  - Si hay conflicto → `409 Conflict` con:
    - `conflictoCon`: la cita existente que genera el solapamiento
    - `horariosAlternativos`: hasta 3 bloques disponibles de 30 min en el mismo día
  - `201 Created` en éxito.
  - Dispara automáticamente notificación por correo al propietario vía `NotificacionService`.

### Disponibilidad de veterinarios

- `GET /veterinarios/:id/disponibilidad?fecha=2026-05-15`
  - Retorna bloques de 30 min con estado `disponible` u `ocupado`.
  - Horario laboral: lunes a sábado 7:00 AM - 7:00 PM. Domingos retorna `[]`.

- `GET /veterinarios/disponibilidad?fecha=2026-05-15`
  - Mismo formato pero para todos los veterinarios.

### Consultas

- `POST /consultas` (admin, veterinario)
  - Campos: `mascotaId`, `motivo`, `anamnesis`, `constantesVitales`, `diagnostico`, `tratamiento`, `observaciones`, `justificacion`.
  - `fecha` se asigna automáticamente con la hora del servidor.
  - Valida cada constante vital contra los rangos definidos en la especie de la mascota (vía Raza → Especie).
  - Si hay valores fuera de rango:
    - Sin `justificacion` → `400 Bad Request` con detalle de alertas.
    - Con `justificacion` → `201 Created` e incluye campo `alertas` en la respuesta.
  - `constantesVitales` esperado (opcional):
    ```json
    {
      "temperatura": { "valor": 38.5, "unidad": "°C" },
      "frecuenciaCardiaca": { "valor": 85, "unidad": "lpm" },
      "frecuenciaRespiratoria": { "valor": 20, "unidad": "rpm" }
    }
    ```

## Errores de validacion (formato unificado)

Las validaciones de DTO se devuelven en un unico objeto con detalle por campo:

```json
{
  "message": "Errores de validacion",
  "errors": {
    "email": ["email must be an email"],
    "telefono": ["telefono should not be empty"]
  }
}
```

## Instrucciones para Frontend

### Base URL

Por defecto en desarrollo:

- `http://localhost:3000`

En el frontend usar:

- `API_BASE_URL=http://localhost:3000` (o variable equivalente)

### Flujo recomendado

1. Autenticar con `POST /auth/login` y guardar `access_token`.
2. En cada request protegida agregar:
   - `Authorization: Bearer <token>`
3. Manejo de respuestas:
   - `401`: token invalido/expirado
   - `403`: rol no autorizado para el endpoint
   - `409`: conflicto por duplicados (ej: `numeroIdentificacion`)
   - `400`: validaciones (usar `errors` para pintar mensajes por campo)

### Ejemplos rapidos (frontend)

- Buscar propietarios:
  - `GET /propietarios?q=juan&page=1&limit=20`
- Crear propietario:
  - `POST /propietarios`
  - Body (ejemplo):
    ```json
    {
      "username": "prop1",
      "email": "prop1@mail.com",
      "password": "Secret123!",
      "nombreCompleto": "Juan Perez",
      "numeroIdentificacion": "1020304050",
      "telefono": "3001234567"
    }
    ```
- Crear mascota:
  - `POST /mascotas`
  - Body (ejemplo):
    ```json
    {
      "propietarioId": "<uuid>",
      "nombre": "Firulais",
      "especie": "perro",
      "edad": 3,
      "sexo": "macho",
      "peso": 12.5
    }
    ```

## Documentacion tecnica (HU)

Detalle completo de HU-B01/B02/B03:

- `docs/HU-B01-B03-propietarios-mascotas.md`
