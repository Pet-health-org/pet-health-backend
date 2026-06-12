# Auditoria backend y ajustes para frontend - 2026-06-12

## Resumen

No se cambiaron rutas, metodos HTTP ni nombres de endpoints existentes. Los cambios realizados son de seguridad, configuracion Docker/Render y validaciones internas para que el frontend consuma el mismo contrato con reglas mas estrictas.

URL local con Docker:

```text
http://localhost:13000
```

Swagger local:

```text
http://localhost:13000/docs
```

En produccion (`NODE_ENV=production`) Swagger no se expone.

## Cambios que impactan al frontend

### Login y bloqueo de cuenta

Endpoint sin cambios:

```text
POST /auth/login
```

El rate limit/bloqueo del login ahora debe tratarse como estado del backend, no como estado del frontend:

- Tras 3 intentos fallidos del mismo usuario/email, la cuenta queda bloqueada por 15 minutos.
- El bloqueo queda persistido en base de datos (`intentosFallidos`, `bloqueadoHasta`).
- Recargar la pagina, cerrar el navegador o reiniciar la API no desbloquea la cuenta.
- Si el bloqueo ya vencio, el backend limpia el bloqueo y vuelve a contar intentos desde cero.
- El frontend no debe desbloquear por refresh ni manejar un contador local como fuente de verdad.

Respuesta esperada en bloqueo:

```json
{
  "message": "Cuenta bloqueada. Intente nuevamente en 15 minuto(s)",
  "error": "Unauthorized",
  "statusCode": 401
}
```

Recomendacion frontend:

- Mostrar un mensaje generico para credenciales invalidas.
- Si `message` contiene `Cuenta bloqueada`, mostrar el texto del backend.
- Deshabilitar temporalmente el boton de login solo como mejora visual, no como seguridad.
- No revelar si el usuario existe.

### Expiracion de sesion

El JWT queda configurado para 30 minutos:

```text
JWT_EXPIRES_IN=1800
```

La respuesta de login incluye:

```json
{
  "access_token": "...",
  "expires_in": 1800
}
```

Recomendacion frontend:

- Usar `expires_in` para programar cierre automatico de sesion.
- En cualquier `401`, limpiar token local y redirigir a login.
- No asumir sesiones de 24 horas.

### Manejo global de 401 y 403

Todas las rutas protegidas deben enviar:

```text
Authorization: Bearer <access_token>
```

Excepto:

```text
POST /auth/login
```

Comportamiento esperado:

- `401 Unauthorized`: no hay token, token expirado, usuario inactivo/bloqueado o credenciales invalidas.
- `403 Forbidden`: el usuario esta autenticado, pero su rol no tiene permiso.

Recomendacion frontend:

- `401`: cerrar sesion y volver a login.
- `403`: mostrar pantalla/mensaje de acceso denegado sin cerrar sesion.
- Ocultar opciones de menu no permitidas por rol, no solo deshabilitarlas.

## Permisos relevantes por endpoint

### Administracion de usuarios

Endpoint sin cambios:

```text
POST /users/register
```

Antes estaba abierto. Ahora requiere:

```text
Rol: admin
```

Impacto frontend:

- La creacion de usuarios internos debe moverse a pantalla de administrador.
- No usar `/users/register` como registro publico.
- Para propietarios, usar el flujo autorizado de propietarios si aplica al rol de recepcion.

### Roles

Endpoints sin cambios:

```text
GET /roles
POST /roles
GET /roles/:id
PATCH /roles/:id
DELETE /roles/:id
```

Ahora todos requieren:

```text
Rol: admin
```

Impacto frontend:

- El modulo de roles debe estar visible solo para administradores.
- Si el frontend cargaba roles en pantallas de recepcion, debe usar datos ya conocidos o pedir al backend un endpoint especifico de catalogos en el futuro.

### Citas

Endpoint sin cambios:

```text
PATCH /citas/:id
```

Ahora requiere:

```text
Roles: admin, recepcionista
```

Impacto frontend:

- Veterinario y propietario no deben ver acciones de edicion de cita si no tienen permiso.
- El calendario puede seguir consultando disponibilidad con token valido segun los permisos actuales.

### Mascotas

Endpoint sin cambios:

```text
PATCH /mascotas/:id
```

Ahora requiere:

```text
Roles: admin, recepcionista, propietario
```

Impacto frontend:

- Veterinario puede consultar, pero no debe mostrar accion de edicion si su rol no esta permitido.
- Pendiente tecnico: el backend todavia no valida propiedad del recurso para el rol `propietario`; el frontend no debe confiar en ocultar botones como unica seguridad a largo plazo.

### Notificaciones

Endpoints de historial sin cambios:

```text
GET /notificaciones
GET /notificaciones/usuario/:usuarioId
GET /notificaciones/estado/:estado
GET /notificaciones/:id
PATCH /notificaciones/:id
DELETE /notificaciones/:id
```

Permisos actuales:

- Historial y edicion: `admin`
- Reenvio: `admin`, `recepcionista`
- Creacion/envio a propietario: `admin`, `recepcionista`, `veterinario`

Endpoint de reenvio sin cambios:

```text
POST /notificaciones/:id/reenviar
```

Impacto frontend:

- El modulo completo de historial debe estar visible solo para admin.
- Recepcionista puede tener accion de reenvio si el frontend conoce el ID de una notificacion fallida.
- Veterinario puede crear notificaciones permitidas, pero no debe ver historial global.

## Constantes vitales y consultas

Endpoints sin cambios:

```text
GET /especies/:especieId/constantes
PUT /especies/:especieId/constantes
POST /consultas
```

Cambios internos:

- Se siembran rangos por defecto para Perro, Gato y Ave.
- `POST /consultas` ya no ignora silenciosamente errores al obtener rangos.
- Si las constantes estan fuera de rango y no hay justificacion, responde `400` con `alertas`.
- `PUT /especies/:id/constantes` valida que `minimo < maximo`.

Impacto frontend:

- En formularios de consulta, si hay `400` con `alertas`, mostrar cada constante fuera de rango.
- Permitir guardar valores fuera de rango solo si el veterinario agrega `justificacion` o `vitalsJustification`.
- Consultar rangos antes de pintar ayudas visuales del formulario.

Ejemplo de error esperado:

```json
{
  "message": "Las constantes vitales estan fuera del rango normal. Debe incluir una justificacion.",
  "alertas": [
    {
      "constante": "temperatura",
      "valorIngresado": 41,
      "minimoEsperado": 38,
      "maximoEsperado": 39.2,
      "unidad": "°C"
    }
  ]
}
```

## Docker y despliegue

Archivos agregados:

- `Dockerfile`
- `docker-compose.yml`
- `.dockerignore`
- `DEPLOYMENT.md`

Local:

```bash
docker compose up -d --build
```

API:

```text
http://localhost:13000
```

Si el puerto esta ocupado:

```bash
API_PORT=13001 docker compose up -d --build
```

Render:

- La API usa Docker.
- La base de datos debe ser MySQL externa en Aiven.
- Configurar variables `DB_HOST`, `DB_PORT`, `DB_USERNAME`, `DB_PASSWORD`, `DB_NAME`.
- Para Aiven usar `DB_SSL=true` y `DB_SSL_CA` con el PEM del certificado, sin subir el archivo `CA` al repo.
- No usar base de datos Render si el plan/proyecto no soporta MySQL.

## Cambios tecnicos de seguridad

- `JWT_SECRET` ya no cae a `default_secret`; si falta, la API falla al iniciar.
- `POST /users/register` ya no esta abierto.
- `/roles` ya no esta abierto.
- Se agregaron roles a mutaciones sensibles que solo tenian JWT.
- El log de auditoria ahora espera a que el registro se persista antes de responder.
- El usuario admin sembrado en instalaciones nuevas usa el `HASH_SALT_ROUNDS` configurado.

## Pruebas ejecutadas

Comandos ejecutados:

```bash
npm run build
npm test -- --runInBand
npm run test:e2e -- --runInBand
docker compose up -d --build
```

Resultados:

- Build Nest: correcto.
- Unit/system tests: 10 suites, 25 tests correctos.
- E2E: 1 suite, 1 test correcto.
- Docker: API y MySQL levantan correctamente.

Pruebas HTTP realizadas contra Docker:

```text
GET /roles sin token -> 401
POST /users/register sin token -> 401
POST /auth/login admin correcto -> 200
3 intentos fallidos de login -> 401, 401, 401
login correcto durante bloqueo -> 401
reinicio de API y login correcto durante bloqueo -> 401
DELETE usuario temporal con admin -> 200
```

## Pendientes recomendados

- Agregar pruebas e2e reales por modulo: propietarios, mascotas, citas, consultas, inventario, notificaciones y vacunacion.
- Implementar autorizacion por propiedad para rol `propietario`, por ejemplo que solo vea o edite sus propias mascotas.
- Revisar si el frontend necesita un endpoint de catalogos publicos/autenticados para roles o especies, en vez de usar endpoints administrativos.
- Revisar `npm audit`: queda 1 vulnerabilidad moderada reportada por npm.
- Rotar cualquier credencial real que haya estado en `.env` local si fue compartida con el equipo.
