# Historias de Usuario — Sistema PetHealth

**Proyecto:** Sistema de Gestión Veterinaria PetHealth  
**Fecha:** 14 de marzo de 2026  
**Autor:** Equipo de Desarrollo PetHealth

---

## Introducción

Este documento contiene las historias de usuario derivadas de los requisitos funcionales (RF) especificados en el documento SRS del Sistema de Gestión Veterinaria PetHealth. Cada historia de usuario describe una funcionalidad desde la perspectiva del usuario final, siguiendo el formato estándar: *"Como [rol], quiero [funcionalidad], para [beneficio]"*.

---

## Módulo: Gestión de Propietarios

### HU-01: Registrar nuevo propietario
**Asignado a:** ToroDevelloper | **Sprint:** 1

Como **recepcionista**,  
quiero registrar nuevos propietarios con nombre completo, número de identificación, dirección, teléfono, correo electrónico y notas adicionales,  
para mantener una base de datos actualizada de los clientes de la clínica.

**Requisito funcional relacionado:** RF-01

**Criterios de aceptación:**
- El sistema debe solicitar todos los campos obligatorios: nombre completo, identificación, teléfono y correo electrónico
- El sistema debe validar que el correo electrónico tenga formato válido
- El sistema debe validar que el número de identificación sea único
- El sistema debe permitir agregar notas adicionales opcionales
- El sistema debe confirmar el registro exitoso del propietario

---

### HU-02: Buscar propietario existente
**Asignado a:** andrez-co | **Sprint:** 1

Como **recepcionista**,  
quiero buscar propietarios por nombre, identificación o teléfono,  
para acceder rápidamente a su información cuando llamen o visiten la clínica.

**Requisito funcional relacionado:** RF-02

**Criterios de aceptación:**
- El sistema debe permitir búsqueda por nombre completo o parcial
- El sistema debe permitir búsqueda por número de identificación
- El sistema debe permitir búsqueda por número de teléfono
- Los resultados deben mostrarse en menos de 2 segundos
- El sistema debe mostrar una lista de coincidencias si hay múltiples resultados

---

### HU-03: Actualizar información de contacto
**Asignado a:** ToroDevelloper | **Sprint:** 1

Como **recepcionista**,  
quiero modificar la información de contacto de un propietario existente,  
para mantener los datos actualizados cuando el cliente cambie dirección, teléfono o correo.

**Requisito funcional relacionado:** RF-03

**Criterios de aceptación:**
- El sistema debe permitir editar dirección, teléfono y correo electrónico
- El sistema debe validar el formato del nuevo correo electrónico
- El sistema debe registrar la fecha de modificación
- El sistema debe confirmar los cambios realizados

---

## Módulo: Gestión de Mascotas

### HU-04: Registrar nueva mascota
**Asignado a:** andrez-co | **Sprint:** 2

Como **recepcionista**,  
quiero registrar nuevas mascotas asociadas a un propietario incluyendo nombre, especie, raza, fecha de nacimiento, sexo, color, peso y observaciones,  
para crear el perfil completo de cada paciente animal.

**Requisito funcional relacionado:** RF-04

**Criterios de aceptación:**
- El sistema debe solicitar primero seleccionar el propietario asociado
- El sistema debe permitir ingresar nombre, especie, raza, fecha de nacimiento, sexo, color y peso
- El sistema debe permitir seleccionar especie entre: perro, gato, ave u otros
- El sistema debe validar que el peso sea un valor numérico positivo
- El sistema debe permitir agregar observaciones adicionales
- El sistema debe generar automáticamente un identificador único para la mascota

---

### HU-05: Diferenciar especies animales
**Asignado a:** ToroDevelloper | **Sprint:** 2

Como **veterinario**,  
quiero que el sistema diferencie entre especies de animales y aplique validaciones específicas,  
para garantizar que los rangos de valores normales sean apropiados para cada tipo de animal.

**Requisito funcional relacionado:** RF-05

**Criterios de aceptación:**
- El sistema debe aplicar validaciones diferentes para perros, gatos, aves y otros
- El sistema debe mostrar campos relevantes según la especie seleccionada
- El sistema debe sugerir razas comunes según la especie

---

### HU-06: Almacenar constantes vitales por especie
**Asignado a:** andrez-co | **Sprint:** 2

Como **administrador del sistema**,  
quiero que se almacenen constantes vitales específicas por especie (temperatura normal, frecuencia cardíaca, frecuencia respiratoria),  
para que el sistema pueda validar automáticamente si los valores registrados están dentro de rangos normales.

**Requisito funcional relacionado:** RF-06

**Criterios de aceptación:**
- El sistema debe almacenar rangos normales de temperatura para cada especie
- El sistema debe almacenar rangos normales de frecuencia cardíaca para cada especie
- El sistema debe almacenar rangos normales de frecuencia respiratoria para cada especie
- El sistema debe permitir al administrador configurar estos rangos

---

## Módulo: Gestión de Citas

### HU-07: Agendar nueva cita
**Asignado a:** ToroDevelloper | **Sprint:** 2

Como **recepcionista**,  
quiero agendar citas especificando fecha, hora, mascota, propietario, veterinario asignado y motivo de consulta,  
para organizar la agenda de los veterinarios y garantizar atención ordenada.

**Requisito funcional relacionado:** RF-07

**Criterios de aceptación:**
- El sistema debe permitir seleccionar fecha y hora de la cita
- El sistema debe permitir buscar y seleccionar la mascota y propietario
- El sistema debe permitir seleccionar el veterinario asignado
- El sistema debe solicitar el motivo de la consulta
- El sistema debe confirmar el agendamiento exitoso

---

### HU-08: Validar conflictos de horario
**Asignado a:** andrez-co | **Sprint:** 2

Como **recepcionista**,  
quiero que el sistema valide que no existan conflictos de horario para un mismo veterinario,  
para evitar agendar dos citas simultáneas con el mismo profesional.

**Requisito funcional relacionado:** RF-08

**Criterios de aceptación:**
- El sistema debe verificar disponibilidad del veterinario antes de confirmar
- El sistema debe mostrar mensaje de error si existe conflicto de horario
- El sistema debe sugerir horarios alternativos disponibles
- El sistema debe considerar la duración estimada de cada consulta

---

### HU-09: Visualizar disponibilidad de veterinarios
**Asignado a:** ToroDevelloper | **Sprint:** 2

Como **recepcionista**,  
quiero ver la disponibilidad de veterinarios en tiempo real,  
para agendar citas de manera eficiente sin necesidad de consultar manualmente.

**Requisito funcional relacionado:** RF-09

**Criterios de aceptación:**
- El sistema debe mostrar calendario visual con horarios ocupados y disponibles
- El sistema debe actualizar la disponibilidad en tiempo real
- El sistema debe diferenciar visualmente horarios disponibles, ocupados y bloqueados
- El sistema debe permitir filtrar por veterinario específico

---

## Módulo: Historia Clínica y Consultas

### HU-10: Acceder a historia clínica completa
**Asignado a:** andrez-co | **Sprint:** 3

Como **veterinario**,  
quiero acceder a la historia clínica completa de una mascota durante la consulta,  
para revisar consultas previas, tratamientos aplicados y vacunas administradas.

**Requisito funcional relacionado:** RF-10

**Criterios de aceptación:**
- El sistema debe mostrar todas las consultas previas en orden cronológico
- El sistema debe mostrar vacunas aplicadas con fechas y próximos refuerzos
- El sistema debe mostrar tratamientos previos y medicamentos recetados
- El sistema debe permitir exportar la historia clínica a PDF
- La información debe cargarse en menos de 2 segundos

---

### HU-11: Registrar nueva consulta
**Asignado a:** ToroDevelloper | **Sprint:** 3

Como **veterinario**,  
quiero registrar una nueva consulta con fecha, hora, motivo, anamnesis, examen físico, constantes vitales, peso, temperatura, diagnóstico, tratamiento y observaciones,  
para documentar adecuadamente cada visita del paciente.

**Requisito funcional relacionado:** RF-11

**Criterios de aceptación:**
- El sistema debe registrar automáticamente fecha y hora de la consulta
- El sistema debe permitir ingresar motivo de consulta y anamnesis
- El sistema debe solicitar constantes vitales: peso, temperatura, frecuencia cardíaca, frecuencia respiratoria
- El sistema debe permitir describir examen físico y condición corporal
- El sistema debe permitir registrar diagnóstico y tratamiento prescrito
- El sistema debe permitir agregar observaciones adicionales

---

### HU-12: Validar constantes vitales
**Asignado a:** andrez-co | **Sprint:** 3

Como **veterinario**,  
quiero que el sistema valide que las constantes vitales registradas están dentro de rangos normales según la especie y muestre alertas cuando estén fuera de rango,  
para identificar rápidamente valores anormales que requieran atención.

**Requisito funcional relacionado:** RF-12

**Criterios de aceptación:**
- El sistema debe validar temperatura contra rangos normales de la especie
- El sistema debe validar frecuencia cardíaca contra rangos normales de la especie
- El sistema debe validar frecuencia respiratoria contra rangos normales de la especie
- El sistema debe mostrar alerta visual (color rojo/amarillo) cuando valores estén fuera de rango
- El sistema debe permitir confirmar y guardar valores fuera de rango con justificación

---

## Módulo: Gestión de Vacunación

### HU-13: Registrar vacuna aplicada
**Asignado a:** ToroDevelloper | **Sprint:** 3

Como **veterinario**,  
quiero registrar la aplicación de vacunas durante una consulta especificando tipo de vacuna, fecha de aplicación, lote, fecha de vencimiento y próxima fecha de refuerzo,  
para mantener el registro de vacunación completo y actualizado.

**Requisito funcional relacionado:** RF-13

**Criterios de aceptación:**
- El sistema debe permitir seleccionar el tipo de vacuna del inventario
- El sistema debe solicitar número de lote y fecha de vencimiento
- El sistema debe registrar automáticamente la fecha de aplicación
- El sistema debe calcular y permitir ajustar la próxima fecha de refuerzo
- El sistema debe actualizar automáticamente el inventario de vacunas

---

### HU-14: Gestionar esquemas de vacunación por especie
**Asignado a:** andrez-co | **Sprint:** 3

Como **administrador del sistema**,  
quiero gestionar diferentes esquemas de vacunación según la especie del animal,  
para que el sistema sugiera las vacunas apropiadas para cada tipo de mascota.

**Requisito funcional relacionado:** RF-14

**Criterios de aceptación:**
- El sistema debe permitir configurar esquemas de vacunación por especie
- El sistema debe definir vacunas obligatorias y opcionales por especie
- El sistema debe establecer intervalos de refuerzo para cada vacuna
- El sistema debe sugerir vacunas pendientes según edad y especie de la mascota

---

### HU-15: Generar alertas de vacunas pendientes
**Asignado a:** ToroDevelloper | **Sprint:** 3

Como **recepcionista**,  
quiero que el sistema genere automáticamente alertas de vacunas pendientes cuando se aproxime la fecha de refuerzo con 15 días de anticipación,  
para notificar oportunamente a los propietarios y programar las citas necesarias.

**Requisito funcional relacionado:** RF-15

**Criterios de aceptación:**
- El sistema debe verificar diariamente las fechas de próximo refuerzo
- El sistema debe generar alertas 15 días antes de la fecha programada
- El sistema debe mostrar listado de mascotas con vacunas pendientes
- El sistema debe permitir enviar notificación automática al propietario
- El sistema debe registrar cuando se envió la notificación

---

## Módulo: Gestión de Inventario

### HU-16: Registrar medicamentos y vacunas
**Asignado a:** andrez-co | **Sprint:** 4

Como **administrador**,  
quiero registrar medicamentos y vacunas con código, nombre, descripción, presentación, unidad de medida, cantidad en stock, stock mínimo, fecha de vencimiento y proveedor,  
para mantener control del inventario de insumos médicos.

**Requisito funcional relacionado:** RF-16

**Criterios de aceptación:**
- El sistema debe permitir ingresar código único del producto
- El sistema debe solicitar nombre, descripción y presentación
- El sistema debe permitir definir unidad de medida (ml, mg, unidades, etc.)
- El sistema debe registrar cantidad en stock y stock mínimo
- El sistema debe permitir ingresar fecha de vencimiento y datos del proveedor
- El sistema debe validar que el código sea único

---

### HU-17: Actualizar inventario automáticamente
**Asignado a:** ToroDevelloper | **Sprint:** 4

Como **veterinario**,  
quiero que el sistema actualice automáticamente el inventario al registrar el uso de medicamentos o vacunas en consultas,  
para mantener el stock actualizado sin necesidad de registro manual adicional.

**Requisito funcional relacionado:** RF-17

**Criterios de aceptación:**
- El sistema debe descontar automáticamente del inventario al registrar medicamento en consulta
- El sistema debe descontar automáticamente del inventario al aplicar vacuna
- El sistema debe registrar la fecha y hora de cada movimiento de inventario
- El sistema debe asociar cada movimiento con la consulta correspondiente
- El sistema debe mostrar confirmación de actualización de stock

---

### HU-18: Generar alertas de stock bajo
**Asignado a:** andrez-co | **Sprint:** 4

Como **administrador**,  
quiero que el sistema genere alertas automáticas cuando el stock de un medicamento o vacuna esté por debajo del stock mínimo configurado,  
para realizar pedidos oportunos y evitar desabastecimiento.

**Requisito funcional relacionado:** RF-18

**Criterios de aceptación:**
- El sistema debe comparar stock actual contra stock mínimo
- El sistema debe generar alerta visible cuando stock sea menor o igual al mínimo
- El sistema debe mostrar listado de productos con stock bajo
- El sistema debe permitir generar orden de compra desde la alerta
- El sistema debe notificar al administrador por correo electrónico

---

## Módulo: Notificaciones

### HU-19: Enviar notificaciones por correo electrónico
**Asignado a:** ToroDevelloper | **Sprint:** 4

Como **sistema**,  
quiero enviar notificaciones por correo electrónico a los propietarios para confirmaciones de citas, recordatorios y alertas de vacunación,  
para mantener informados a los clientes sobre citas programadas y cuidados necesarios.

**Requisito funcional relacionado:** RF-19

**Criterios de aceptación:**
- El sistema debe enviar confirmación automática al agendar una cita
- El sistema debe enviar recordatorio 24 horas antes de la cita
- El sistema debe enviar alerta cuando se aproxime fecha de vacunación
- El correo debe incluir información relevante: fecha, hora, mascota, motivo
- El sistema debe usar plantillas predefinidas para cada tipo de notificación

---

### HU-20: Registrar historial de notificaciones
**Asignado a:** andrez-co | **Sprint:** 4

Como **administrador**,  
quiero que el sistema mantenga un registro de todas las notificaciones enviadas con su estado (enviado, fallido),  
para verificar que las comunicaciones llegaron correctamente a los propietarios.

**Requisito funcional relacionado:** RF-20

**Criterios de aceptación:**
- El sistema debe registrar fecha y hora de cada notificación enviada
- El sistema debe registrar destinatario, tipo de notificación y estado
- El sistema debe registrar intentos fallidos con motivo del fallo
- El sistema debe permitir consultar historial de notificaciones por propietario
- El sistema debe permitir reenviar notificaciones fallidas

---

### HU-21: Configurar plantillas de notificaciones
**Asignado a:** ToroDevelloper | **Sprint:** 4

Como **administrador**,  
quiero configurar plantillas de mensajes para diferentes tipos de notificaciones,  
para personalizar el contenido de los correos enviados a los clientes.

**Requisito funcional relacionado:** RF-21

**Criterios de aceptación:**
- El sistema debe permitir crear plantillas para confirmación de citas
- El sistema debe permitir crear plantillas para recordatorios de citas
- El sistema debe permitir crear plantillas para alertas de vacunación
- El sistema debe soportar variables dinámicas (nombre mascota, fecha, hora, etc.)
- El sistema debe permitir previsualizar la plantilla antes de activarla

---

## Módulo: Reportes y Estadísticas

### HU-22: Generar reporte de enfermedades comunes
**Asignado a:** andrez-co | **Sprint:** 5

Como **administrador**,  
quiero generar reportes mensuales de enfermedades más comunes atendidas,  
para identificar tendencias epidemiológicas y planificar campañas preventivas.

**Requisito funcional relacionado:** RF-22

**Criterios de aceptación:**
- El sistema debe permitir seleccionar el período del reporte (mes y año)
- El sistema debe contar diagnósticos registrados en consultas
- El sistema debe agrupar diagnósticos similares
- El sistema debe mostrar gráfico de barras o pastel con las 10 enfermedades más comunes
- El sistema debe permitir exportar el reporte a PDF o Excel

---

### HU-23: Generar reporte de pacientes por especie
**Asignado a:** ToroDevelloper | **Sprint:** 5

Como **administrador**,  
quiero generar reportes de cantidad de pacientes atendidos por especie,  
para conocer la distribución de la población de pacientes de la clínica.

**Requisito funcional relacionado:** RF-23

**Criterios de aceptación:**
- El sistema debe permitir seleccionar el período del reporte
- El sistema debe contar consultas agrupadas por especie animal
- El sistema debe mostrar cantidad total y porcentaje por cada especie
- El sistema debe incluir gráfico visual (barras o pastel)
- El sistema debe permitir exportar a PDF o Excel

---

### HU-24: Generar reporte de efectividad de vacunación
**Asignado a:** andrez-co | **Sprint:** 5

Como **administrador**,  
quiero generar reportes de efectividad de campañas de vacunación (cobertura por tipo de vacuna),  
para evaluar el cumplimiento de los esquemas de vacunación en la población atendida.

**Requisito funcional relacionado:** RF-24

**Criterios de aceptación:**
- El sistema debe calcular cobertura de vacunación por tipo de vacuna
- El sistema debe mostrar cantidad de mascotas con esquema completo vs incompleto
- El sistema debe permitir filtrar por especie animal
- El sistema debe mostrar tendencia de vacunación en el tiempo
- El sistema debe permitir exportar a PDF o Excel

---

## Módulo: Seguridad y Control de Acceso

### HU-25: Autenticar usuarios
**Asignado a:** ToroDevelloper | **Sprint:** 5

Como **usuario del sistema**,  
quiero autenticarme mediante usuario y contraseña para acceder al sistema,  
para garantizar que solo personal autorizado pueda acceder a la información sensible.

**Requisito funcional relacionado:** RF-25

**Criterios de aceptación:**
- El sistema debe solicitar nombre de usuario y contraseña
- El sistema debe validar credenciales contra la base de datos
- El sistema debe bloquear acceso después de 3 intentos fallidos
- El sistema debe mantener la sesión activa por tiempo configurable
- El sistema debe cerrar sesión automáticamente por inactividad

---

### HU-26: Controlar acceso basado en roles
**Asignado a:** andrez-co | **Sprint:** 5

Como **administrador**,  
quiero que el sistema implemente control de acceso basado en roles (RBAC),  
para que cada usuario solo pueda realizar las acciones permitidas según su rol.

**Requisito funcional relacionado:** RF-26

**Criterios de aceptación:**
- El sistema debe definir roles: Administrador, Veterinario, Recepcionista
- El sistema debe asignar permisos específicos a cada rol
- El sistema debe ocultar opciones de menú no permitidas según el rol
- El sistema debe validar permisos antes de ejecutar acciones sensibles
- El sistema debe mostrar mensaje de error si el usuario no tiene permiso

---

### HU-27: Registrar auditoría de acciones
**Asignado a:** ToroDevelloper | **Sprint:** 5

Como **administrador**,  
quiero que el sistema registre todas las acciones críticas en un log de auditoría (quién, qué, cuándo),  
para tener trazabilidad de modificaciones y detectar uso indebido del sistema.

**Requisito funcional relacionado:** RF-27

**Criterios de aceptación:**
- El sistema debe registrar usuario que ejecutó la acción
- El sistema debe registrar tipo de acción realizada (crear, modificar, eliminar)
- El sistema debe registrar fecha y hora exacta de la acción
- El sistema debe registrar datos relevantes (ID de registro modificado)
- El sistema debe permitir consultar el log de auditoría
- El sistema debe permitir filtrar auditoría por usuario, fecha o tipo de acción

---

## Resumen

| Módulo | HUs | ToroDevelloper | andrez-co |
|--------|-----|----------------|-----------|
| Gestión de Propietarios | HU-01 a HU-03 | HU-01, HU-03 | HU-02 |
| Gestión de Mascotas | HU-04 a HU-06 | HU-05 | HU-04, HU-06 |
| Gestión de Citas | HU-07 a HU-09 | HU-07, HU-09 | HU-08 |
| Historia Clínica y Consultas | HU-10 a HU-12 | HU-11 | HU-10, HU-12 |
| Gestión de Vacunación | HU-13 a HU-15 | HU-13, HU-15 | HU-14 |
| Gestión de Inventario | HU-16 a HU-18 | HU-17 | HU-16, HU-18 |
| Notificaciones | HU-19 a HU-21 | HU-19, HU-21 | HU-20 |
| Reportes y Estadísticas | HU-22 a HU-24 | HU-23 | HU-22, HU-24 |
| Seguridad y Control de Acceso | HU-25 a HU-27 | HU-25, HU-27 | HU-26 |
| **Total** | **27** | **14** | **13** |
