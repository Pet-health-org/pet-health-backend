# Planificación de Sprints — Sistema PetHealth

**Proyecto:** Sistema de Gestión Veterinaria PetHealth  
**Fecha de inicio:** 17 de marzo de 2026  
**Duración de cada sprint:** 2 semanas  
**Equipo:**
- 🔵 [ToroDevelloper](https://github.com/ToroDevelloper) — Líder Técnico / Backend
- 🟢 [andrez-co](https://github.com/andrez-co) — Desarrollador Full-Stack

---

## Sprint 1 — Gestión de Propietarios
**Período:** 17 mar – 30 mar 2026

| ID | Historia de Usuario | Asignado a | Prioridad |
|----|---------------------|------------|-----------|
| HU-01 | Registrar nuevo propietario | 🔵 ToroDevelloper | Alta |
| HU-02 | Buscar propietario existente | 🟢 andrez-co | Alta |
| HU-03 | Actualizar información de contacto | 🔵 ToroDevelloper | Alta |

**Objetivo del sprint:** Implementar el módulo completo de gestión de propietarios, incluyendo registro, búsqueda y actualización de datos de contacto.

**Criterios de completitud:**
- [ ] CRUD completo de propietarios
- [ ] Validación de correo electrónico y unicidad de identificación
- [ ] Búsqueda por nombre, identificación o teléfono
- [ ] Registro de fecha de modificación

---

## Sprint 2 — Gestión de Mascotas y Citas
**Período:** 31 mar – 13 abr 2026

| ID | Historia de Usuario | Asignado a | Prioridad |
|----|---------------------|------------|-----------|
| HU-04 | Registrar nueva mascota | 🟢 andrez-co | Alta |
| HU-05 | Diferenciar especies animales | 🔵 ToroDevelloper | Alta |
| HU-06 | Almacenar constantes vitales por especie | 🟢 andrez-co | Media |
| HU-07 | Agendar nueva cita | 🔵 ToroDevelloper | Alta |
| HU-08 | Validar conflictos de horario | 🟢 andrez-co | Alta |
| HU-09 | Visualizar disponibilidad de veterinarios | 🔵 ToroDevelloper | Media |

**Objetivo del sprint:** Implementar el módulo de mascotas con validaciones por especie y el módulo de gestión de citas con calendario de disponibilidad.

**Criterios de completitud:**
- [ ] Registro de mascotas asociadas a propietario
- [ ] Validaciones específicas por especie (perro, gato, ave, otros)
- [ ] Rangos de constantes vitales configurables por especie
- [ ] Agendamiento de citas con validación de conflictos
- [ ] Vista de calendario con disponibilidad en tiempo real

---

## Sprint 3 — Historia Clínica y Vacunación
**Período:** 14 abr – 27 abr 2026

| ID | Historia de Usuario | Asignado a | Prioridad |
|----|---------------------|------------|-----------|
| HU-10 | Acceder a historia clínica completa | 🟢 andrez-co | Alta |
| HU-11 | Registrar nueva consulta | 🔵 ToroDevelloper | Alta |
| HU-12 | Validar constantes vitales | 🟢 andrez-co | Alta |
| HU-13 | Registrar vacuna aplicada | 🔵 ToroDevelloper | Alta |
| HU-14 | Gestionar esquemas de vacunación por especie | 🟢 andrez-co | Media |
| HU-15 | Generar alertas de vacunas pendientes | 🔵 ToroDevelloper | Media |

**Objetivo del sprint:** Implementar el registro de consultas con validación de constantes vitales y el módulo de vacunación con alertas automáticas.

**Criterios de completitud:**
- [ ] Historia clínica con consultas previas, vacunas y tratamientos
- [ ] Exportación de historia clínica a PDF
- [ ] Registro de consulta con constantes vitales
- [ ] Alertas visuales (rojo/amarillo) para valores fuera de rango
- [ ] Registro de vacunas con número de lote y fecha de vencimiento
- [ ] Alertas automáticas 15 días antes del refuerzo

---

## Sprint 4 — Inventario y Notificaciones
**Período:** 28 abr – 11 may 2026

| ID | Historia de Usuario | Asignado a | Prioridad |
|----|---------------------|------------|-----------|
| HU-16 | Registrar medicamentos y vacunas | 🟢 andrez-co | Alta |
| HU-17 | Actualizar inventario automáticamente | 🔵 ToroDevelloper | Alta |
| HU-18 | Generar alertas de stock bajo | 🟢 andrez-co | Media |
| HU-19 | Enviar notificaciones por correo electrónico | 🔵 ToroDevelloper | Alta |
| HU-20 | Registrar historial de notificaciones | 🟢 andrez-co | Media |
| HU-21 | Configurar plantillas de notificaciones | 🔵 ToroDevelloper | Media |

**Objetivo del sprint:** Implementar el módulo de inventario con descuento automático y el módulo de notificaciones por correo electrónico.

**Criterios de completitud:**
- [ ] CRUD de medicamentos y vacunas en inventario
- [ ] Descuento automático al registrar uso en consulta
- [ ] Alertas de stock mínimo con notificación al administrador
- [ ] Envío de correos: confirmación, recordatorio y alerta de vacunación
- [ ] Historial de notificaciones con estado (enviado/fallido)
- [ ] Plantillas configurables con variables dinámicas

---

## Sprint 5 — Reportes y Seguridad
**Período:** 12 may – 25 may 2026

| ID | Historia de Usuario | Asignado a | Prioridad |
|----|---------------------|------------|-----------|
| HU-22 | Generar reporte de enfermedades comunes | 🟢 andrez-co | Media |
| HU-23 | Generar reporte de pacientes por especie | 🔵 ToroDevelloper | Media |
| HU-24 | Generar reporte de efectividad de vacunación | 🟢 andrez-co | Media |
| HU-25 | Autenticar usuarios | 🔵 ToroDevelloper | Alta |
| HU-26 | Controlar acceso basado en roles (RBAC) | 🟢 andrez-co | Alta |
| HU-27 | Registrar auditoría de acciones | 🔵 ToroDevelloper | Alta |

**Objetivo del sprint:** Implementar los reportes estadísticos y el módulo de seguridad con autenticación, RBAC y auditoría.

**Criterios de completitud:**
- [ ] Reportes exportables a PDF/Excel: enfermedades, pacientes por especie, vacunación
- [ ] Gráficos de barras y pastel en reportes
- [ ] Autenticación con bloqueo tras 3 intentos fallidos
- [ ] Roles: Administrador, Veterinario, Recepcionista
- [ ] Log de auditoría filtrable por usuario, fecha o tipo de acción

---

## Resumen de Asignaciones

### 🔵 ToroDevelloper (14 historias)
| Sprint | HUs asignadas |
|--------|---------------|
| Sprint 1 | HU-01, HU-03 |
| Sprint 2 | HU-05, HU-07, HU-09 |
| Sprint 3 | HU-11, HU-13, HU-15 |
| Sprint 4 | HU-17, HU-19, HU-21 |
| Sprint 5 | HU-23, HU-25, HU-27 |

### 🟢 andrez-co (13 historias)
| Sprint | HUs asignadas |
|--------|---------------|
| Sprint 1 | HU-02 |
| Sprint 2 | HU-04, HU-06, HU-08 |
| Sprint 3 | HU-10, HU-12, HU-14 |
| Sprint 4 | HU-16, HU-18, HU-20 |
| Sprint 5 | HU-22, HU-24, HU-26 |

---

## Estado General

| Sprint | Período | Estado |
|--------|---------|--------|
| Sprint 1 | 17 mar – 30 mar 2026 | 🔄 En progreso |
| Sprint 2 | 31 mar – 13 abr 2026 | ⏳ Pendiente |
| Sprint 3 | 14 abr – 27 abr 2026 | ⏳ Pendiente |
| Sprint 4 | 28 abr – 11 may 2026 | ⏳ Pendiente |
| Sprint 5 | 12 may – 25 may 2026 | ⏳ Pendiente |
