# HU-B01 / HU-B02 / HU-B03 (Backend) - Propietarios y Mascotas

Fecha: 2026-05-14
Rama: `toro-hu-completas`

Este documento resume lo implementado para que frontend y el resto del equipo sepan:
1) endpoints y contratos actuales,
2) validaciones y códigos de estado,
3) cambios relevantes sobre el modelo en BD.

## Autenticacion

Los endpoints de `propietarios` y `mascotas` requieren JWT.

1. Login (seed por defecto en desarrollo):
   - `POST /auth/login`
   - Body:
     ```json
     { "username": "admin@pethealth.com", "password": "Admin123!" }
     ```
   - Respuesta:
     ```json
     { "access_token": "<jwt>" }
     ```
2. En requests posteriores:
   - Header: `Authorization: Bearer <jwt>`

## HU-B01 - Crear propietario (POST /propietarios)

Endpoint:
- `POST /propietarios`

Roles permitidos:
- `admin`, `recepcionista`

Body:
```json
{
  "username": "prop1",
  "email": "prop1@mail.com",
  "password": "Secret123!",
  "nombreCompleto": "Juan Perez",
  "numeroIdentificacion": "1020304050",
  "telefono": "3001234567",
  "direccion": "Calle 123",
  "notas": "Prefiere WhatsApp"
}
```

Validaciones:
- `username`: requerido, string, min 3, max 50
- `email`: requerido, formato email
- `password`: requerido, string, min 6
- `nombreCompleto`: requerido, string, max 100
- `numeroIdentificacion`: requerido, string, max 50, debe ser unico
- `telefono`: requerido, string, max 50
- `direccion`: opcional, string, max 100
- `notas`: opcional, string

Respuestas:
- `201 Created`: retorna el objeto creado con `id` UUID (y demas campos), **sin** `password`.
- `409 Conflict`: si `numeroIdentificacion` ya existe (tambien se valida unicidad de `email` y `username`).
- `400 Bad Request`: validaciones de DTO. Se retorna un unico objeto con detalle por campo:
  ```json
  {
    "message": "Errores de validacion",
    "errors": {
      "email": ["email must be an email"],
      "telefono": ["telefono should not be empty"]
    }
  }
  ```

Notas de seguridad:
- Password se almacena hasheado (bcrypt) y no se devuelve en respuestas.
- Adicionalmente, `User.toJSON()` excluye `password` para evitar fugas en respuestas con relaciones.

## HU-B02 - Busqueda de propietarios (GET /propietarios?q=...)

Endpoint:
- `GET /propietarios?q=<termino>&page=1&limit=20`

Query params:
- `q` (opcional): termino de busqueda.
- `page` (opcional): default `1`.
- `limit` (opcional): default `20`, maximo efectivo `20`.

Comportamiento:
- Busca simultaneamente en:
  - `nombreCompleto`
  - `numeroIdentificacion`
  - `telefono`
- Busqueda parcial via `LIKE '%q%'`.
- Retorna siempre `200` con arreglo (puede ser `[]` si no hay coincidencias).

Importante (case-insensitive):
- En MySQL la insensibilidad a mayusculas/minusculas depende de la collation de la BD/columnas.
  En entornos tipicos `utf8mb4_*_ci` es case-insensitive.

Rendimiento / indices:
- Se agregaron indices para soportar busqueda por:
  - `users.nombreCompleto`
  - `users.numeroIdentificacion` (unique)
  - `users.telefono`

## HU-B03 - Registro de mascota (POST /mascotas)

Endpoint:
- `POST /mascotas`

Roles permitidos:
- `admin`, `recepcionista`, `propietario`

Body:
```json
{
  "propietarioId": "<uuid>",
  "razaId": "<uuid-opcional>",
  "nombre": "Firulais",
  "especie": "perro",
  "edad": 3,
  "sexo": "macho",
  "peso": 12.5,
  "color": "cafe"
}
```

Validaciones:
- Verifica que `propietarioId` exista (si no existe => `404`).
- `peso` debe ser > 0.
- `especie` debe estar en la lista controlada:
  - `perro`, `gato`, `ave`, `otro`
- `razaId` es opcional (nullable en BD).

Respuestas:
- `201 Created`: mascota creada con `id` UUID generado automaticamente.
- `404 Not Found`: propietario no existe.
- `400 Bad Request`: validaciones del DTO (incluye error por `especie` o `peso`).

## Cambios de modelo / BD

Propietarios:
- Los propietarios se almacenan en `users` con `rol = propietario`.
- Se agregaron campos en `users` para soportar HU-B01/HU-B02:
  - `nombreCompleto`, `numeroIdentificacion`, `direccion`, `telefono`, `notas`
- Se agregaron indices en `users` para busqueda y unicidad.

Mascotas:
- `mascotas.id` sigue siendo UUID generado.
- Se agrego `mascotas.especie` como enum (`perro|gato|ave|otro`), default `otro`.
- `mascotas.razaId` se dejo nullable para no bloquear registros sin raza.

