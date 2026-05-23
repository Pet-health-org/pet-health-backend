# HU-B04 / HU-B05 / HU-B06 / HU-B07 - Constantes, Citas y Consultas

Fecha: 2026-05-23

## HU-B04 - Constantes vitales por especie

Objetivo:

- Exponer los rangos normales (min/max) de constantes vitales por especie para que sean la fuente de verdad de validacion clinica.

Endpoints:

- `GET /especies/:especieId/constantes`
- `PUT /especies/:especieId/constantes` (solo `admin`)

Estructura de datos esperada:

```json
{
  "temperatura": { "minimo": 38.0, "maximo": 39.2, "unidad": "°C" },
  "frecuenciaCardiaca": { "minimo": 60, "maximo": 120, "unidad": "lpm" },
  "frecuenciaRespiratoria": { "minimo": 10, "maximo": 30, "unidad": "rpm" }
}
```

Reglas:

- Si la especie no existe, retorna `404`.
- Si existe pero no tiene rangos definidos, retorna `404`.
- Estos rangos se usan en la validacion de `POST /consultas`.

## HU-B05 - Agendamiento con validacion de conflictos

Objetivo:

- Evitar solapamientos de agenda por veterinario y proponer alternativas.

Endpoint:

- `POST /citas` (`admin`, `recepcionista`)

Validaciones clave:

1. Horario laboral: lunes a sabado de 7:00 AM a 7:00 PM.
2. Solapamiento por veterinario con duracion minima de 30 minutos.
3. Si hay conflicto, retorna `409` con:
   - `conflictoCon`: cita existente que bloquea.
   - `horariosAlternativos`: hasta 3 horarios disponibles en el mismo dia.
4. Si no hay conflicto, retorna `201` con todos los datos.
5. En creacion exitosa se dispara notificacion por correo al propietario.

Respuesta de conflicto (forma esperada):

```json
{
  "statusCode": 409,
  "message": "Conflicto de horario",
  "conflictoCon": {},
  "horariosAlternativos": ["2026-05-25T10:00:00.000Z"]
}
```

## HU-B06 - Disponibilidad de veterinarios

Objetivo:

- Entregar bloques de tiempo disponibles/ocupados para renderizar agenda en frontend.

Endpoints:

- `GET /veterinarios/:id/disponibilidad?fecha=YYYY-MM-DD`
- `GET /veterinarios/disponibilidad?fecha=YYYY-MM-DD` (todos)

Reglas:

- Horario laboral: lunes a sabado de 7:00 AM a 7:00 PM.
- Granularidad: bloques de 30 minutos.
- Si la fecha es domingo, la disponibilidad esperada es vacia.
- Soporta consulta de un veterinario o todos.

Formato esperado:

- Arreglo de bloques con estado `disponible` u `ocupado` por franja.

## HU-B07 - Registro de consulta con validacion de constantes

Objetivo:

- Registrar consulta clinica estructurada y detectar valores fuera de rango por especie.

Endpoint:

- `POST /consultas` (`admin`, `veterinario`)

Campos base:

- `mascotaId`, `motivo`, `anamnesis`, `constantesVitales`, `diagnostico`, `tratamiento`, `observaciones`.
- `fecha` se asigna automatico con hora del servidor.

Validacion:

1. Obtiene especie de la mascota (via raza/especie).
2. Obtiene rangos fuente de verdad (`GET /especies/:id/constantes` a nivel de servicio).
3. Compara constantes enviadas con min/max.
4. Si hay fuera de rango:
   - Sin `justificacion` -> `400` con detalle en `alertas`.
   - Con `justificacion` -> permite guardar.

Respuesta:

- `201 Created` con objeto completo de consulta.
- Si hubo outliers y hubo justificacion, incluye campo `alertas` con detalle:

```json
[
  {
    "constante": "temperatura",
    "valorIngresado": 40.1,
    "minimoEsperado": 38.0,
    "maximoEsperado": 39.2,
    "unidad": "°C"
  }
]
```

## Notas para frontend

- Formulario de consulta:
  - Capturar `constantesVitales` como objeto estructurado (valor + unidad).
  - Si backend responde `400` por rango sin justificacion, mostrar `alertas` y solicitar justificacion.
  - Reintentar `POST /consultas` con `justificacion`.

- Agendamiento:
  - Ante `409` en `POST /citas`, usar `horariosAlternativos` para mostrar opciones inmediatas.

- Agenda:
  - Usar `GET /veterinarios/:id/disponibilidad` para vista por profesional.
  - Usar `GET /veterinarios/disponibilidad` para vista global.
