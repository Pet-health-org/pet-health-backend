# Autenticación

## Iniciar sesión

Endpoint para autenticar un usuario y obtener un token de acceso.

**URL**: `/auth/login`  
**Método**: `POST`  
**Autenticación requerida**: No  

### Parámetros de petición

| Nombre | Tipo | Descripción | Requerido |
|--------|------|-------------|-----------|
| username | string | Nombre de usuario o email | Sí |
| password | string | Contraseña (mínimo 6 caracteres) | Sí |

### Cuerpo de la petición

```json
{
  "username": "juan_perez",
  "password": "password123"
}
```

### Respuestas

| Código | Descripción | Contenido |
|--------|-------------|-----------|
| 200 | Login exitoso | `{ "access_token": "jwt_token_here" }` |
| 401 | Credenciales inválidas | `{ "message": "Credenciales inválidas" }` |
| 401 | Usuario inactivo o bloqueado | `{ "message": "Usuario inactivo o bloqueado" }` |

## Refrescar token

Endpoint para obtener un nuevo token de acceso usando el token actual.

**URL**: `/auth/refresh`  
**Método**: `POST`  
**Autenticación requerida**: Sí (Bearer Token)

### Headers

| Nombre | Valor | Descripción |
|--------|-------|-------------|
| Authorization | `Bearer <token>` | Token de acceso válido |

### Respuestas

| Código | Descripción | Contenido |
|--------|-------------|-----------|
| 200 | Token refrescado exitosamente | `{ "access_token": "new_jwt_token_here" }` |
| 401 | No autorizado | `{ "message": "No autorizado" }` |