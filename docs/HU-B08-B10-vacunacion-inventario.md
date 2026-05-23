# HU-B08 / HU-B09 / HU-B10 - Vacunacion e Inventario

Fecha: 2026-05-23

## HU-B08 - Esquemas de vacunacion por especie

### Crear esquemas

- Endpoint: `POST /vacunacion/esquemas`
- Roles: `admin`
- Requiere JWT.

Body:

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
    },
    {
      "nombreVacuna": "Bordetella",
      "tipo": "opcional",
      "edadMinimaMeses": 2,
      "edadMaximaMeses": 12,
      "intervaloRefuerzoDias": 180
    }
  ]
}
```

Respuesta `201`:

```json
{
  "especie": "perro",
  "vacunasObligatorias": [],
  "vacunasOpcionales": []
}
```

### Consultar esquemas

- Endpoint: `GET /vacunacion/esquemas/:especie`
- Requiere JWT.

Filtros opcionales:

- `edadMeses`: vacunas que aplican exactamente para la edad de la mascota.
- `edadMinimaMeses` y `edadMaximaMeses`: vacunas cuyo rango se cruza con ese intervalo.

Ejemplos:

- `GET /vacunacion/esquemas/perro`
- `GET /vacunacion/esquemas/perro?edadMeses=6`
- `GET /vacunacion/esquemas/gato?edadMinimaMeses=2&edadMaximaMeses=12`

Respuesta:

- `200`: esquema agrupado en `vacunasObligatorias` y `vacunasOpcionales`.
- `404`: no existe esquema activo para la especie/filtro consultado.

### Calculo de proximo refuerzo

Al registrar una vacuna con `POST /vacunas`, si el frontend no envia `fechaProximoRefuerzo`, el backend intenta calcularla asi:

1. Busca la historia clinica.
2. Obtiene la mascota y su `especie`/`edad`.
3. Busca un esquema activo con la misma especie y nombre de vacuna.
4. Suma `intervaloRefuerzoDias` a `fechaAplicacion`.

Si no hay esquema compatible, se registra la vacuna sin fecha calculada.

## HU-B09 - Job diario de alertas de vacunas pendientes

El servicio `VacunacionService` programa una revision diaria a las 7:00 AM (hora del servidor).

Comportamiento:

1. Calcula el rango entre hoy y los proximos 15 dias.
2. Consulta vacunas con `fechaProximoRefuerzo` dentro de ese rango.
3. Por cada vacuna pendiente, crea un registro en `alertas_vacunas`.
4. Crea una notificacion para el propietario usando `NotificacionService.enviarCorreo`.
5. Registra logs de alerta generada y notificacion enviada o fallida.

Tabla nueva:

- `alertas_vacunas`

Campos relevantes:

- `vacunaId`
- `mascotaId`
- `propietarioId`
- `notificacionId`
- `fechaProximoRefuerzo`
- `estado`
- `notificacionEnviada`
- `errorNotificacion`

Nota:

- `NotificacionService.enviarCorreo` deja el registro de notificacion en BD con estado `enviada`. La integracion real con proveedor SMTP queda aislada para reemplazarse despues sin cambiar el contrato.

## HU-B10 - Descuento automatico de inventario en consultas

Endpoint impactado:

- `POST /consultas`

Roles:

- `admin`, `veterinario`

Campo nuevo opcional:

```json
{
  "insumosUtilizados": [
    {
      "inventarioId": "uuid-producto",
      "cantidad": 2
    }
  ]
}
```

Comportamiento:

1. Si `insumosUtilizados` viene vacio o no viene, la consulta se crea como antes.
2. Si viene con items, el backend abre una transaccion.
3. Valida stock suficiente antes de guardar la consulta.
4. Si falta stock, responde `400` y no guarda la consulta.
5. Si hay stock, guarda la consulta, descuenta inventario y registra movimientos.
6. Si cualquier paso falla, se revierte todo.
7. Si el stock resultante queda por debajo del minimo, crea una alerta de stock bajo en `notificaciones` y `notificaciones_inventario`.

Tabla nueva:

- `movimientos_inventario`

Campos relevantes:

- `inventarioId`
- `consultaId`
- `cantidad`
- `tipoMovimiento`: `uso_consulta`
- `stockAnterior`
- `stockResultante`
- `fechaMovimiento`

Ejemplo request:

```json
{
  "mascotaId": "uuid-mascota",
  "motivo": "Consulta por vacunacion",
  "diagnostico": "Paciente apto para vacuna",
  "tratamiento": "Aplicacion de vacuna",
  "insumosUtilizados": [
    {
      "inventarioId": "uuid-vacuna-rabia",
      "cantidad": 1
    }
  ]
}
```

Errores esperados:

- `400`: producto no encontrado en inventario.
- `400`: stock insuficiente.
- `400`: validaciones normales de consulta.

## Notas para frontend

- En `POST /consultas`, agregar selector de productos de inventario y cantidades.
- Manejar `400` de stock insuficiente mostrando el mensaje del backend.
- Para vacunacion, consumir `GET /vacunacion/esquemas/:especie?edadMeses=<edad>` para sugerir vacunas en pantalla de consulta/vacunas.
- Al registrar vacuna, `fechaProximoRefuerzo` puede omitirse si existe esquema compatible.
