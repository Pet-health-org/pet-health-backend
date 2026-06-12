# Pet Health Backend

API REST del sistema PetHealth, construida con NestJS, TypeORM y MySQL. Incluye autenticacion JWT, control por roles, Swagger en desarrollo, auditoria, notificaciones, historia clinica, consultas, vacunacion e inventario.

## Requisitos

- Node.js LTS
- MySQL 8 o compatible
- npm

## Configuracion local

1. Instalar dependencias:

```bash
npm install
```

2. Crear `.env` en la raiz tomando como base `.env.example`.

3. Crear la base de datos definida en `DB_NAME`.

4. Iniciar en desarrollo:

```bash
npm run start:dev
```

En desarrollo (`NODE_ENV != production`) queda disponible:

- API: `http://localhost:3000`
- Swagger: `http://localhost:3000/docs`

Si el puerto `3000` esta ocupado, cierra el proceso existente o cambia `PORT`.

## Variables principales

```env
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=changeme
DB_NAME=pet-health
DB_SYNCHRONIZE=true
DB_LOGGING=false
DB_SSL=false
DB_SSL_CA_PATH=CA
DB_SSL_CA=

JWT_SECRET=change_me_in_production
JWT_EXPIRES_IN=1800

PORT=3000
NODE_ENV=development

HASH_SALT_ROUNDS=12

PAGINATION_DEFAULT_LIMIT=20
PAGINATION_MAX_LIMIT=20

SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=
SMTP_PASSWORD=
SMTP_FROM=noreply@pethealth.com
SMTP_SECURE=false
```

`JWT_EXPIRES_IN` acepta segundos (`1800`) o sufijos (`30m`, `24h`, `7d`). Para HU-B13 se recomienda `1800` o `30m`.

Si usas Aiven, no subas el certificado CA al repo. Usa `DB_SSL_CA` como variable secreta en Render o pega el PEM localmente en tu entorno de despliegue.

## Seed inicial

Al arrancar, `SeederService` crea roles, especies base, razas y usuario administrador si no existen.

```json
{
  "username": "admin@pethealth.com",
  "password": "Admin123!"
}
```

Roles disponibles:

- `admin`
- `veterinario`
- `recepcionista`
- `propietario`

## Autenticacion

### Login

`POST /auth/login`

```json
{
  "username": "admin@pethealth.com",
  "password": "Admin123!"
}
```

Respuesta:

```json
{
  "access_token": "<jwt>",
  "expires_in": 1800
}
```

Enviar el token en endpoints protegidos:

```http
Authorization: Bearer <jwt>
```

### Refresh

`POST /auth/refresh`

Requiere JWT vigente y retorna un token nuevo.

## Formato de errores

Validaciones de DTO:

```json
{
  "message": "Errores de validacion",
  "errors": {
    "email": ["email must be an email"],
    "telefono": ["telefono should not be empty"]
  }
}
```

Codigos comunes:

- `400`: datos invalidos o regla de negocio incumplida.
- `401`: token ausente, invalido o expirado.
- `403`: rol no autorizado.
- `404`: recurso no encontrado.
- `409`: duplicado o conflicto de agenda.
- `422`: stock insuficiente.

## Endpoints

### Auth

| Metodo | Endpoint        | Uso                          |
| ------ | --------------- | ---------------------------- |
| POST   | `/auth/login`   | Inicia sesion y retorna JWT. |
| POST   | `/auth/refresh` | Refresca JWT vigente.        |

La cuenta se bloquea por 15 minutos tras 3 intentos fallidos.

### Propietarios

Un propietario se maneja como usuario con rol `propietario`.

| Metodo | Endpoint                        | Roles                | Uso                                          |
| ------ | ------------------------------- | -------------------- | -------------------------------------------- |
| POST   | `/propietarios`                 | admin, recepcionista | Crea propietario.                            |
| GET    | `/propietarios?q=&page=&limit=` | admin, recepcionista | Busca por nombre, identificacion o telefono. |
| GET    | `/propietarios/:id`             | admin, recepcionista | Obtiene propietario.                         |

Crear propietario:

```json
{
  "username": "juan_perez",
  "email": "juan@example.com",
  "password": "Secret123!",
  "nombreCompleto": "Juan Perez",
  "numeroIdentificacion": "1020304050",
  "direccion": "Calle 123",
  "telefono": "3001234567",
  "notas": "Prefiere WhatsApp"
}
```

Reglas:

- `numeroIdentificacion`, `email` y `username` son unicos.
- La respuesta no expone `password`.
- `GET /propietarios` retorna `200` con array, incluso `[]`.
- `limit` maximo: 20.

### Mascotas

| Metodo | Endpoint                               | Roles                             | Uso                            |
| ------ | -------------------------------------- | --------------------------------- | ------------------------------ |
| POST   | `/mascotas`                            | admin, recepcionista, propietario | Crea mascota.                  |
| GET    | `/mascotas`                            | autenticado                       | Lista mascotas.                |
| GET    | `/mascotas/propietario/:propietarioId` | autenticado                       | Lista mascotas de propietario. |
| GET    | `/mascotas/:id`                        | autenticado                       | Obtiene mascota.               |
| PATCH  | `/mascotas/:id`                        | admin, recepcionista, propietario | Actualiza mascota.             |
| DELETE | `/mascotas/:id`                        | admin                             | Elimina mascota.               |

Crear mascota:

```json
{
  "propietarioId": "<uuid-user-propietario>",
  "razaId": "<uuid-raza-opcional>",
  "nombre": "Firulais",
  "especie": "perro",
  "birthDate": "2023-04-24",
  "sexo": "macho",
  "peso": 15.5,
  "color": "Cafe",
  "observaciones": "Mascota rescatada"
}
```

Reglas:

- `propietarioId` debe existir.
- `especie`: `perro`, `gato`, `ave`, `otro`.
- `peso` debe ser mayor a 0.
- `edad` se calcula desde `birthDate`.

### Especies, razas y constantes vitales

| Metodo | Endpoint                          | Roles       | Uso                        |
| ------ | --------------------------------- | ----------- | -------------------------- |
| POST   | `/especies`                       | admin       | Crea especie.              |
| GET    | `/especies`                       | autenticado | Lista especies.            |
| GET    | `/especies/:id`                   | autenticado | Obtiene especie.           |
| PATCH  | `/especies/:id`                   | admin       | Actualiza especie.         |
| DELETE | `/especies/:id`                   | admin       | Elimina especie.           |
| GET    | `/especies/:especieId/constantes` | autenticado | Retorna rangos normales.   |
| PUT    | `/especies/:especieId/constantes` | admin       | Actualiza rangos normales. |
| POST   | `/razas`                          | admin       | Crea raza.                 |
| GET    | `/razas`                          | autenticado | Lista razas.               |
| GET    | `/razas/especie/:especieId`       | autenticado | Lista razas por especie.   |
| GET    | `/razas/:id`                      | autenticado | Obtiene raza.              |
| PATCH  | `/razas/:id`                      | admin       | Actualiza raza.            |
| DELETE | `/razas/:id`                      | admin       | Elimina raza.              |

Rangos de constantes:

```json
{
  "temperatura": { "minimo": 38.0, "maximo": 39.2, "unidad": "C" },
  "frecuenciaCardiaca": { "minimo": 60, "maximo": 120, "unidad": "lpm" },
  "frecuenciaRespiratoria": { "minimo": 10, "maximo": 30, "unidad": "rpm" }
}
```

Estos rangos son la fuente de verdad para validar consultas.

### Citas y disponibilidad

| Metodo | Endpoint                                            | Roles                | Uso                               |
| ------ | --------------------------------------------------- | -------------------- | --------------------------------- |
| POST   | `/citas`                                            | admin, recepcionista | Agenda cita.                      |
| GET    | `/citas`                                            | autenticado          | Lista citas.                      |
| GET    | `/citas/mascota/:mascotaId`                         | autenticado          | Citas de mascota.                 |
| GET    | `/citas/veterinario/:veterinarioId`                 | autenticado          | Citas de veterinario.             |
| GET    | `/citas/:id`                                        | autenticado          | Obtiene cita.                     |
| PATCH  | `/citas/:id`                                        | admin, recepcionista | Actualiza cita.                   |
| DELETE | `/citas/:id`                                        | admin                | Elimina cita.                     |
| GET    | `/veterinarios/disponibilidad?fecha=YYYY-MM-DD`     | admin, recepcionista | Disponibilidad de todos.          |
| GET    | `/veterinarios/:id/disponibilidad?fecha=YYYY-MM-DD` | admin, recepcionista | Disponibilidad de un veterinario. |

Crear cita:

```json
{
  "mascotaId": "<uuid-mascota>",
  "veterinarioId": "<uuid-veterinario>",
  "fechaHora": "2026-05-25T10:00:00Z",
  "motivo": "Vacunacion anual",
  "estado": "pendiente"
}
```

Reglas:

- Horario laboral: lunes a sabado, 7:00 AM a 7:00 PM.
- Bloques de 30 minutos.
- Si hay solapamiento retorna `409` con cita conflictiva y 3 horarios alternativos.
- Al crear cita se intenta notificar al propietario.

### Historias clinicas, consultas, medicamentos y vacunas

| Metodo | Endpoint                                    | Roles              | Uso                                      |
| ------ | ------------------------------------------- | ------------------ | ---------------------------------------- |
| POST   | `/historias-clinicas`                       | admin, veterinario | Crea historia clinica.                   |
| GET    | `/historias-clinicas`                       | autenticado        | Lista historias.                         |
| GET    | `/historias-clinicas/mascota/:mascotaId`    | autenticado        | Historias por mascota.                   |
| GET    | `/historias-clinicas/:id`                   | autenticado        | Obtiene historia.                        |
| PATCH  | `/historias-clinicas/:id`                   | admin, veterinario | Actualiza historia.                      |
| DELETE | `/historias-clinicas/:id`                   | admin              | Elimina historia.                        |
| POST   | `/consultas`                                | admin, veterinario | Registra consulta.                       |
| POST   | `/medicamentos`                             | admin, veterinario | Registra medicamento.                    |
| GET    | `/medicamentos`                             | autenticado        | Lista medicamentos.                      |
| GET    | `/medicamentos/historia/:historiaClinicaId` | autenticado        | Medicamentos por historia.               |
| PATCH  | `/medicamentos/:id`                         | admin, veterinario | Actualiza medicamento.                   |
| DELETE | `/medicamentos/:id`                         | admin              | Elimina medicamento.                     |
| POST   | `/vacunas`                                  | admin, veterinario | Registra vacuna aplicada.                |
| GET    | `/vacunas`                                  | autenticado        | Lista vacunas con historia e inventario. |
| GET    | `/vacunas/mascota/:mascotaId`               | autenticado        | Vacunas directas de mascota.             |
| GET    | `/vacunas/historia/:historiaClinicaId`      | autenticado        | Vacunas por historia.                    |
| PATCH  | `/vacunas/:id`                              | admin, veterinario | Actualiza vacuna.                        |
| DELETE | `/vacunas/:id`                              | admin              | Elimina vacuna.                          |

Crear consulta:

```json
{
  "mascotaId": "<uuid-mascota>",
  "motivo": "Chequeo general",
  "anamnesis": "Paciente activo",
  "constantesVitales": {
    "temperatura": { "valor": 38.5, "unidad": "C" },
    "frecuenciaCardiaca": { "valor": 85, "unidad": "lpm" },
    "frecuenciaRespiratoria": { "valor": 20, "unidad": "rpm" }
  },
  "diagnostico": "Paciente sano",
  "tratamiento": "Control en 6 meses",
  "observaciones": "Sin novedades",
  "vitalsJustification": "Solo si hay constantes fuera de rango",
  "insumosUtilizados": [
    {
      "inventarioId": "<uuid-inventario>",
      "cantidad": 1
    }
  ]
}
```

Reglas de consulta:

- `fecha` se asigna con hora del servidor.
- Si hay constantes fuera de rango sin `justificacion`, `vitalsJustification` u `observaciones`, retorna `400` con `alertas`.
- Si hay justificacion, la consulta se guarda y la respuesta incluye `alertas`.
- Si `insumosUtilizados` viene informado, descuenta inventario en transaccion.
- Si el stock es insuficiente, retorna `422` y no guarda la consulta.
- Si el stock queda bajo el minimo, genera alerta en `notificaciones` y `notificaciones_inventario`.

Registrar vacuna aplicada:

```json
{
  "historiaClinicaId": "<uuid-historia>",
  "inventarioId": "<uuid-producto-vacuna>",
  "nombre": "Rabia",
  "fechaAplicacion": "2026-05-25T10:00:00Z",
  "dosis": "1",
  "lote": "LOTE-2026",
  "fechaProximoRefuerzo": "2027-05-25T10:00:00Z"
}
```

Reglas de vacuna:

- `fechaProximoRefuerzo` es opcional.
- Si se omite, el backend intenta calcularla desde el esquema de vacunacion.
- Valida inventario y descuenta 1 unidad en transaccion.
- Si no hay stock, retorna `422`.
- `GET /vacunas/mascota/:mascotaId` evita llamadas multiples desde frontend.

### Vacunacion

| Metodo | Endpoint                        | Roles       | Uso                           |
| ------ | ------------------------------- | ----------- | ----------------------------- |
| POST   | `/vacunacion/esquemas`          | admin       | Crea esquemas por especie.    |
| GET    | `/vacunacion/esquemas/:especie` | autenticado | Consulta esquema por especie. |

Crear esquema:

```json
{
  "especie": "perro",
  "vacunas": [
    {
      "nombreVacuna": "Rabia",
      "tipo": "obligatoria",
      "edadMinimaMeses": 3,
      "edadMaximaMeses": null,
      "intervaloRefuerzoDias": 365,
      "descripcion": "Refuerzo anual"
    }
  ]
}
```

Filtros:

- `/vacunacion/esquemas/perro`
- `/vacunacion/esquemas/perro?edadMeses=6`
- `/vacunacion/esquemas/perro?edadMinimaMeses=2&edadMaximaMeses=12`

Job HU-B09:

- Se programa diariamente a las 7:00 AM.
- Busca vacunas con `fechaProximoRefuerzo` entre hoy y los proximos 15 dias.
- Crea `alertas_vacunas`.
- Intenta enviar correo al propietario.
- Registra logs de alerta generada y notificacion enviada/fallida.

### Inventario y proveedores

| Metodo | Endpoint                             | Roles                | Uso                      |
| ------ | ------------------------------------ | -------------------- | ------------------------ |
| POST   | `/proveedores`                       | admin, recepcionista | Crea proveedor.          |
| GET    | `/proveedores`                       | autenticado          | Lista proveedores.       |
| GET    | `/proveedores/:id`                   | autenticado          | Obtiene proveedor.       |
| PATCH  | `/proveedores/:id`                   | admin, recepcionista | Actualiza proveedor.     |
| DELETE | `/proveedores/:id`                   | admin                | Elimina proveedor.       |
| POST   | `/inventario`                        | admin, recepcionista | Crea producto.           |
| GET    | `/inventario`                        | autenticado          | Lista inventario.        |
| GET    | `/inventario/bajo-stock`             | autenticado          | Productos bajo minimo.   |
| GET    | `/inventario/proveedor/:proveedorId` | autenticado          | Productos por proveedor. |
| GET    | `/inventario/tipo/:tipo`             | autenticado          | Productos por tipo.      |
| GET    | `/inventario/:id`                    | autenticado          | Obtiene producto.        |
| PATCH  | `/inventario/:id`                    | admin, recepcionista | Actualiza producto.      |
| PATCH  | `/inventario/:id/stock`              | admin, recepcionista | Actualiza stock.         |
| DELETE | `/inventario/:id`                    | admin                | Elimina producto.        |

Crear producto:

```json
{
  "codigo": "VAC-001",
  "proveedorId": "<uuid-proveedor>",
  "nombreProducto": "Vacuna rabia",
  "descripcion": "Vacuna anual",
  "tipo": "vacuna",
  "presentacion": "Frasco 10 dosis",
  "unidadMedida": "unidades",
  "stockActual": 10,
  "stockMinimo": 3,
  "fechaVencimiento": "2027-01-01T00:00:00Z",
  "precioUnitario": 25000
}
```

Reglas:

- `codigo` es unico.
- `stockActual` y `stockMinimo` no pueden ser negativos.
- Frontend debe usar `PATCH /inventario/:id` para editar.

### Notificaciones

| Metodo | Endpoint                             | Roles                             | Uso                             |
| ------ | ------------------------------------ | --------------------------------- | ------------------------------- |
| POST   | `/notificaciones`                    | admin, recepcionista, veterinario | Crea notificacion manual.       |
| POST   | `/notificaciones/propietario`        | admin, recepcionista, veterinario | Notifica a propietario.         |
| GET    | `/notificaciones`                    | autenticado                       | Historial filtrable y paginado. |
| GET    | `/notificaciones/usuario/:usuarioId` | autenticado                       | Notificaciones por usuario.     |
| GET    | `/notificaciones/estado/:estado`     | autenticado                       | Notificaciones por estado.      |
| POST   | `/notificaciones/:id/reenviar`       | admin, recepcionista              | Reenvia una fallida.            |
| GET    | `/notificaciones/:id`                | autenticado                       | Obtiene notificacion.           |
| PATCH  | `/notificaciones/:id`                | autenticado                       | Actualiza notificacion.         |
| DELETE | `/notificaciones/:id`                | admin                             | Elimina notificacion.           |

Notificar propietario:

```json
{
  "propietarioId": "<uuid-user-propietario>",
  "mensaje": "La vacuna Rabia esta pendiente",
  "tipoPlantilla": "alerta_vacuna"
}
```

Tipos de plantilla:

- `confirmacion_cita`
- `recordatorio_cita`
- `alerta_vacuna`

Historial:

- `GET /notificaciones?propietarioId=<uuid>&tipo=alerta_vacuna&estado=enviado&page=1&limit=50`

`limit` maximo: 50.

### Auditoria

| Metodo | Endpoint     | Roles | Uso                          |
| ------ | ------------ | ----- | ---------------------------- |
| GET    | `/auditoria` | admin | Consulta acciones auditadas. |

Filtros:

- `usuarioId`
- `accion`
- `fechaInicio`
- `fechaFin`
- `page`
- `limit`

Las acciones criticas decoradas con `@AuditLog` se registran con usuario, accion, IP, fecha y registro afectado.

## Guia para frontend

Flujo recomendado:

1. Login con `POST /auth/login`.
2. Guardar `access_token` y `expires_in`.
3. Enviar `Authorization: Bearer <token>` en requests protegidos.
4. Si hay `401`, redirigir a login.
5. Si hay `403`, ocultar o bloquear la accion por rol.
6. Si hay `400`, usar `errors` o `message` para pintar errores.
7. Si hay `409`, mostrar duplicado o conflicto de agenda.
8. Si hay `422`, mostrar stock insuficiente y no asumir guardado.

Puntos de integracion pedidos por frontend:

- Vacunas de mascota: `GET /vacunas/mascota/:mascotaId`.
- Registro de vacuna: `POST /vacunas` con `historiaClinicaId`, `inventarioId`, `nombre`, `fechaAplicacion`, `dosis`, `lote`, `fechaProximoRefuerzo`.
- Inventario HU-F11: `POST /inventario` y `PATCH /inventario/:id` soportan `codigo`, `nombreProducto`, `descripcion`, `presentacion`, `unidadMedida`, `stockActual`, `stockMinimo`, `fechaVencimiento`, `proveedorId`.
- Consulta con constantes anormales: enviar `vitalsJustification`, `justificacion` u `observaciones`.
- Boton "Notificar propietario": usar `POST /notificaciones/propietario`.
- Ediciones requeridas por frontend usan `PATCH`: `/inventario/:id`, `/vacunas/:id`, `/historias-clinicas/:id`.

## Pruebas

Ejecutar pruebas unitarias, integracion y contrato/sistema:

```bash
npm test
```

Build:

```bash
npm run build
```

Cobertura agregada:

- Unitarias: configuracion JWT, inventario, vacunas, consultas y notificaciones.
- Integracion: controlador de vacunas para payload requerido por frontend.
- Sistema: existencia de rutas principales de HU backend y rutas requeridas por frontend.
