# Historias de Usuario - Sistema PetHealth

Proyecto: Sistema de Gestion Veterinaria PetHealth
Institucion: Institucion Universitaria del Putumayo - Uniputumayo
Autores: Angel Ivan Toro Caicedo, Keiner Adrian Tez Oviedo, Michael Leonardo Apraez, Jeferson Andres Jansasoy Munoz
Docente: Samir Alegria
Anio: 2026

Introduccion

Este documento presenta 26 historias de usuario derivadas del SRS del Sistema de Gestion Veterinaria PetHealth, organizadas en dos grupos segun el repositorio de implementacion. Cada historia sigue el formato estandar: "Como [rol], quiero [funcionalidad], para [beneficio]" e incluye sus criterios de aceptacion.

Estado de implementacion

Frontend - Completadas (7 primeras)
* HU-F01
* HU-F02
* HU-F03
* HU-F04
* HU-F05
* HU-F06
* HU-F07

Frontend - Pendientes
* HU-F08
* HU-F09
* HU-F10
* HU-F11
* HU-F12
* HU-F13

Backend - Completadas (7 primeras)
* HU-B01
* HU-B02
* HU-B03
* HU-B04
* HU-B05
* HU-B06
* HU-B07

Backend - Pendientes
* HU-B08
* HU-B09
* HU-B10
* HU-B11
* HU-B12
* HU-B13

## FRONTEND

Repositorio: pethealth-frontend

Historias implementadas principalmente en el repositorio Frontend: formularios, vistas, componentes visuales, navegacion, validaciones en cliente, dashboards y control de acceso visual.

Modulo: Gestion de Propietarios y Mascotas

HU-F01: Formulario de registro de propietario

Como recepcionista,
quiero un formulario que me permita ingresar los datos completos de un nuevo propietario
(nombre, identificacion, direccion, telefono, correo y notas),
para crear su perfil en el sistema de manera rapida y sin errores durante la atencion presencial.

Criterios de aceptacion:
* El formulario debe mostrar todos los campos requeridos con etiquetas claras
* Los campos obligatorios (nombre, identificacion, telefono, correo) deben estar marcados visualmente
* El campo de correo electronico debe validar el formato en tiempo real antes de enviar
* El campo de identificacion debe impedir caracteres no numericos
* Al completar el registro, debe mostrarse un mensaje de confirmacion visible
* El formulario debe limpiarse automaticamente tras un registro exitoso

RF relacionado: RF-01

---

HU-F02: Buscador de propietarios con resultados en tiempo real

Como recepcionista,
quiero un buscador que filtre propietarios por nombre, identificacion o telefono mientras escribo,
para encontrar a un cliente en segundos cuando llega a la clinica sin necesidad de navegar entre paginas.

Criterios de aceptacion:
* El campo de busqueda debe disparar la consulta despues de 3 caracteres escritos
* Los resultados deben actualizarse en menos de 2 segundos
* Cada resultado debe mostrar nombre, identificacion y telefono del propietario
* Si no hay coincidencias, debe mostrarse un mensaje "No se encontraron resultados"
* Al hacer clic en un resultado, debe redirigir al perfil completo del propietario

RF relacionado: RF-02

---

HU-F03: Formulario de registro de mascota con campos dinamicos

Como recepcionista,
quiero un formulario de registro de mascota que adapte sus campos segun la especie seleccionada,
para capturar solo la informacion relevante para cada tipo de animal y reducir errores de entrada.

Criterios de aceptacion:
* Debe existir un selector de especie (perro, gato, ave, otros) como primer campo
* Al cambiar la especie, los campos de raza deben actualizarse con opciones comunes para esa especie
* El campo de peso debe aceptar unicamente valores numericos positivos
* Debe existir un campo de asociacion al propietario con busqueda autocompletada
* Al guardar, debe mostrarse el perfil de la mascota recien creada con su ID generado

RF relacionado: RF-04, RF-05

---

HU-F04: Perfil completo de mascota

Como veterinario,
quiero ver el perfil completo de una mascota en una sola pantalla,
para tener contexto claro del paciente antes y durante la consulta sin navegar entre modulos.

Criterios de aceptacion:
* El perfil debe mostrar: foto (opcional), especie, raza, edad calculada automaticamente, sexo, color y peso actual
* Debe incluir una seccion de datos del propietario con telefono visible
* Debe mostrar un resumen de ultimas 3 consultas con fecha y diagnostico
* Debe mostrar el estado de vacunacion actual (al dia / con pendientes)
* El tiempo de carga de la pantalla no debe superar 2 segundos

RF relacionado: RF-04, RF-10

---

Modulo: Gestion de Citas

HU-F05: Calendario visual de agendamiento de citas

Como recepcionista,
quiero ver un calendario visual con los horarios disponibles y ocupados de cada veterinario,
para agendar citas de forma eficiente sin solapar atenciones.

Criterios de aceptacion:
* El calendario debe mostrar vista semanal y diaria
* Los bloques ocupados deben diferenciarse visualmente de los disponibles (colores distintos)
* Debe existir un filtro por veterinario para ver solo su agenda
* Al hacer clic en un bloque disponible debe abrirse el formulario de agendamiento prellenado con fecha y hora
* Los horarios bloqueados deben mostrarse en un color diferente al de las citas activas

RF relacionado: RF-07, RF-09

---

HU-F06: Formulario de nueva cita

Como recepcionista,
quiero un formulario que me permita registrar todos los datos de una cita (mascota, propietario, veterinario, fecha, hora y motivo),
para confirmar el agendamiento sin errores y sin pasos innecesarios.

Criterios de aceptacion:
* El campo de mascota debe permitir busqueda por nombre o por nombre del propietario
* El selector de veterinario debe mostrar solo los disponibles en la fecha/hora elegida
* Si el horario genera conflicto, debe mostrarse una alerta con horarios alternativos sugeridos
* El motivo de consulta debe ser un campo de texto libre obligatorio
* Al confirmar, debe mostrarse un resumen de la cita antes del guardado definitivo

RF relacionado: RF-07, RF-08

---

Modulo: Historia Clinica y Consultas

HU-F07: Vista de historia clinica cronologica

Como veterinario,
quiero ver todas las consultas previas de una mascota ordenadas cronologicamente en una linea de tiempo,
para revisar la evolucion del paciente de manera rapida y clara durante la atencion.

Criterios de aceptacion:
* Cada entrada debe mostrar: fecha, veterinario que atendio, diagnostico y tratamiento prescrito
* Debe existir un boton para expandir el detalle completo de cada consulta
* Debe incluir una seccion separada con el historial de vacunas aplicadas
* Debe existir un boton de exportar historia clinica a PDF
* El historial completo debe cargarse en menos de 2 segundos



## BACKEND

Repositorio: pethealth-backend

Historias implementadas principalmente en el repositorio Backend: logica de negocio, APIs REST, persistencia en base de datos, procesos automaticos (jobs/schedulers), integracion con servicios externos (SMTP) y seguridad del servidor.

Modulo: Gestion de Propietarios y Mascotas

HU-B01: API de creacion y validacion de propietarios

Como desarrollador backend,
quiero un endpoint REST que reciba los datos de un propietario, los valide y los persista en la base de datos,
para garantizar que solo se registren propietarios con informacion completa y sin duplicados de identificacion.

Criterios de aceptacion:
* El endpoint (POST /propietarios) debe validar: presencia de campos obligatorios, formato de correo electronico y unicidad del numero de identificacion
* Si el numero de identificacion ya existe, debe retornar un error (409 Conflict) con mensaje descriptivo
* Datos validos deben persistirse y retornar (201 Created) con el objeto creado incluyendo su ID generado
* Todos los errores de validacion deben retornarse en un unico objeto con detalle por campo
* Las contrasenas u otros datos sensibles no deben incluirse en la respuesta

RF relacionado: RF-01, RF-03

---

HU-B02: API de busqueda de propietarios

Como desarrollador backend,
quiero un endpoint de busqueda de propietarios que soporte filtros por nombre, identificacion y telefono,
para que el frontend pueda consultar resultados relevantes con tiempos de respuesta inferiores a 2 segundos.

Criterios de aceptacion:
* El endpoint (GET /propietarios?q={termino}) debe buscar en nombre, identificacion y telefono simultaneamente
* La busqueda por nombre debe ser parcial e insensible a mayusculas/minusculas
* Los resultados deben estar paginados (maximo 20 por pagina)
* La consulta debe ejecutarse con indices para garantizar respuesta en menos de 2 segundos con 10.000 registros
* Debe retornar (200 OK) con array vacio si no hay coincidencias (no un 404)

RF relacionado: RF-02

---

HU-B03: API de registro de mascota con generacion de ID unico

Como desarrollador backend,
quiero un endpoint que registre una nueva mascota asociada a un propietario y genere automaticamente su identificador unico,
para asegurar la integridad referencial entre mascotas y propietarios en la base de datos.

Criterios de aceptacion:
* El endpoint (POST /mascotas) debe verificar que el propietario referenciado exista antes de crear la mascota
* Si el propietario no existe, debe retornar (404 Not Found)
* El sistema debe generar un identificador unico para cada mascota (UUID o secuencial con prefijo)
* El campo peso debe validarse como numero positivo mayor a 0
* La especie debe validarse contra una lista controlada: perro, gato, ave, otro

RF relacionado: RF-04

---

HU-B04: API de constantes vitales por especie

Como desarrollador backend,
quiero un servicio que almacene y exponga los rangos normales de constantes vitales para cada especie animal,
para que la logica de validacion de consultas pueda determinar si los valores registrados son normales o criticos.

Criterios de aceptacion:
* Debe existir un endpoint (GET /especies/{especie}/constantes) que retorne rangos de temperatura, frecuencia cardiaca y frecuencia respiratoria
* Los rangos deben definir valor minimo y maximo normal para cada constante
* El endpoint (PUT /especies/{especie}/constantes) debe permitir al administrador actualizar los rangos
* Si se consulta una especie no registrada, debe retornar (404 Not Found)
* Los rangos deben usarse como fuente de verdad para la validacion en el modulo de consultas

RF relacionado: RF-06, RF-12

---

Modulo: Gestion de Citas

HU-B05: API de agendamiento con validacion de conflictos de horario

Como desarrollador backend,
quiero un endpoint de creacion de citas que valide en la base de datos si el veterinario ya tiene una cita en el mismo horario,
para garantizar que no existan solapamientos en la agenda medica.

Criterios de aceptacion:
* El endpoint (POST /citas) debe consultar citas existentes del veterinario en la fecha y hora solicitadas
* Si existe conflicto, debe retornar (409 Conflict) con la cita que genera el solapamiento y tres horarios alternativos disponibles en el mismo dia
* El calculo de conflicto debe considerar una duracion minima de 30 minutos por consulta
* La cita creada exitosamente debe retornar (201 Created) con todos sus datos
* Cada creacion exitosa debe disparar el envio de notificacion por correo al propietario

RF relacionado: RF-07, RF-08

---

HU-B06: API de disponibilidad de veterinarios

Como desarrollador backend,
quiero un endpoint que retorne los horarios disponibles de uno o todos los veterinarios en una fecha dada,
para que el frontend pueda renderizar el calendario de agendamiento con informacion en tiempo real.

Criterios de aceptacion:
* El endpoint (GET /veterinarios/{id}/disponibilidad?fecha={fecha}) debe retornar bloques de tiempo disponibles y ocupados
* El horario laboral de la clinica es de lunes a sabado de 7:00 AM a 7:00 PM
* Los bloques deben tener granularidad de 30 minutos
* Debe soportar filtro por veterinario o retornar todos si no se especifica
* La respuesta debe generarse en menos de 1 segundo

RF relacionado: RF-09

---

Modulo: Historia Clinica y Consultas

HU-B07: API de registro de consulta con validacion de constantes vitales

Como desarrollador backend,
quiero un endpoint que registre los datos de una nueva consulta y valide que las constantes vitales ingresadas esten dentro de los rangos normales para la especie de la mascota,
para almacenar la informacion clinica de forma estructurada y detectar valores anomales.

Criterios de aceptacion:
* El endpoint (POST /consultas) debe recibir: mascota ID, motivo, anamnesis, constantes vitales, diagnostico, tratamiento y observaciones
* Debe registrar automaticamente la fecha y hora del servidor al momento de la creacion
* Si una constante vital esta fuera del rango normal, la respuesta debe incluir un campo (alertas) con el detalle
* Las consultas con valores fuera de rango deben poder guardarse si incluyen una justificacion del veterinario
* El endpoint debe retornar (201 Created) con el objeto completo de la consulta almacenada

RF relacionado: RF-11, RF-12

---






# Faltantes 
   ## frontend

 HU-F08: Formulario de registro de consulta con validacion de constantes vitales

Como veterinario,
quiero un formulario de consulta que valide las constantes vitales en tiempo real segun la especie de la mascota,
para identificar inmediatamente valores fuera de rango sin necesidad de consultarlos manualmente.

Criterios de aceptacion:
* El formulario debe incluir campos para: motivo, anamnesis, peso, temperatura, frecuencia cardiaca y frecuencia respiratoria
* Los campos de constantes vitales deben mostrar el rango normal esperado para la especie como texto de ayuda
* Si un valor esta fuera de rango, el campo debe resaltarse en amarillo (advertencia) o rojo (critico)
* El formulario debe permitir guardar valores fuera de rango si el veterinario agrega una justificacion
* Los campos de diagnostico y tratamiento deben ser areas de texto con suficiente espacio

RF relacionado: RF-11, RF-12

---

Modulo: Gestion de Vacunacion

HU-F09: Panel de vacunas pendientes

Como recepcionista,
quiero ver un panel con el listado de mascotas que tienen vacunas proximas a vencer o ya vencidas,
para contactar a sus propietarios y programar las citas de refuerzo con anticipacion.

Criterios de aceptacion:
* El panel debe mostrar: nombre de la mascota, especie, propietario, vacuna pendiente y fecha de vencimiento
* Las vacunas vencidas deben aparecer resaltadas en rojo; las proximas a vencer (15 dias) en amarillo
* Debe existir un boton de "Notificar propietario" por cada registro
* Debe permitir filtrar por especie o rango de fechas
* El listado debe actualizarse automaticamente cada vez que se accede al panel

RF relacionado: RF-15

---

HU-F10: Formulario de registro de vacuna aplicada

Como veterinario,
quiero registrar la aplicacion de una vacuna durante la consulta desde un formulario sencillo,
para actualizar el esquema de vacunacion de la mascota sin salir de la pantalla de consulta.

Criterios de aceptacion:
* El formulario debe incluir: selector de tipo de vacuna, numero de lote, fecha de vencimiento del lote y fecha de proximo refuerzo
* La fecha de proxima aplicacion debe calcularse automaticamente segun el esquema de la especie, con opcion de ajuste manual
* Al guardar, debe mostrarse confirmacion de que el inventario fue descontado
* El formulario debe ser accesible como seccion dentro del formulario de consulta
* Si el lote seleccionado esta por vencer en menos de 30 dias, debe mostrarse una advertencia

RF relacionado: RF-13

---

Modulo: Inventario

HU-F11: Formulario de registro de medicamento o vacuna en inventario

Como administrador,
quiero un formulario para registrar nuevos medicamentos y vacunas en el inventario del sistema,
para mantener actualizado el catalogo de insumos disponibles en la clinica.

Criterios de aceptacion:
* El formulario debe incluir: codigo, nombre, descripcion, presentacion, unidad de medida, cantidad en stock, stock minimo, fecha de vencimiento y proveedor
* El campo de codigo debe validar que no exista un registro duplicado
* El campo de unidad de medida debe ofrecer opciones predefinidas (ml, mg, unidades, etc.)
* Al guardar correctamente, debe redirigir al listado de inventario con el nuevo item visible
* El formulario debe mostrar errores de validacion campo por campo, no como bloque global

RF relacionado: RF-16

---

HU-F12: Dashboard de alertas de stock bajo

Como administrador,
quiero ver en el dashboard principal un panel de alertas con los medicamentos y vacunas que estan por debajo del stock minimo,
para identificar a primera vista los insumos que necesitan reposicion urgente.

Criterios de aceptacion:
* El panel de alertas debe ser visible en la pantalla de inicio del administrador
* Cada alerta debe mostrar: nombre del producto, stock actual, stock minimo y proveedor
* Los productos con stock en 0 deben aparecer en rojo; los que estan por debajo del minimo en amarillo
* Debe existir un boton de "Generar orden de compra" por cada item en alerta
* El numero de alertas activas debe aparecer como un badge en el menu lateral de navegacion

RF relacionado: RF-18

---

HU-F13: Pantalla de inicio de sesion y menu adaptado al rol

Como usuario del sistema (administrador, veterinario o recepcionista),
quiero ingresar con mi usuario y contrasena y ver solo las opciones del menu que corresponden a mi rol,
para acceder de forma segura y sin confundirme con funciones que no me corresponden.

Criterios de aceptacion:
* La pantalla de login debe tener campo de usuario, contrasena y boton de ingreso
* Debe mostrarse un mensaje de error claro tras credenciales incorrectas, sin revelar si el usuario existe
* Despues de 3 intentos fallidos, el acceso debe bloquearse y mostrar indicacion al usuario
* El menu de navegacion debe mostrar unicamente las secciones permitidas para cada rol
* Las opciones no permitidas deben estar ocultas, no solo deshabilitadas
* La sesion debe cerrarse automaticamente tras 30 minutos de inactividad

RF relacionado: RF-25, RF-26

---

## Backend

Modulo: Gestion de Vacunacion

HU-B08: API de gestion de esquemas de vacunacion por especie

Como desarrollador backend,
quiero un servicio que almacene los esquemas de vacunacion recomendados para cada especie y los exponga al modulo de consultas,
para sugerir automaticamente las vacunas que corresponden segun la especie y la edad de la mascota.

Criterios de aceptacion:
* Debe existir un endpoint (GET /vacunacion/esquemas/{especie}) que retorne las vacunas obligatorias y opcionales con sus intervalos de refuerzo
* El endpoint (POST /vacunacion/esquemas) debe permitir al administrador crear nuevos esquemas
* Al consultar el esquema, debe poder filtrarse por rango de edad de la mascota
* Si no existe esquema para la especie indicada, debe retornar (404 Not Found)
* Los esquemas deben servir de base para el calculo de la fecha del proximo refuerzo al registrar una vacuna

RF relacionado: RF-14

---

HU-B09: Job automatico de alertas de vacunas pendientes

Como sistema,
quiero que un proceso automatico ejecute diariamente una revision de las fechas de refuerzo de vacunas de todas las mascotas,
para generar alertas y disparar notificaciones a propietarios con 15 dias de anticipacion sin intervencion manual.

Criterios de aceptacion:
* El job debe ejecutarse diariamente a las 7:00 AM
* Debe consultar todas las mascotas cuya proxima fecha de refuerzo este entre hoy y los proximos 15 dias
* Por cada vacuna pendiente encontrada, debe crear un registro de alerta en la base de datos
* Debe disparar el envio de correo al propietario a traves del servicio de notificaciones
* Debe registrar en el log si la alerta fue generada y si la notificacion fue enviada exitosamente

RF relacionado: RF-15

---

Modulo: Inventario

HU-B10: API de descuento automatico de inventario al registrar consulta

Como desarrollador backend,
quiero que al guardar una consulta con medicamentos o vacunas utilizados, el sistema descuente automaticamente las cantidades del inventario,
para mantener el stock actualizado en tiempo real sin pasos adicionales para el veterinario.

Criterios de aceptacion:
* Al crear una consulta, si incluye medicamentos o vacunas, debe ejecutarse una transaccion que descuente la cantidad usada del stock
* Si el stock del producto es insuficiente, debe retornarse un error (422) antes de guardar la consulta
* Cada movimiento de inventario debe registrarse con: fecha, hora, producto, cantidad, tipo de movimiento (uso en consulta) y ID de consulta asociada
* Si la transaccion de descuento falla, la consulta no debe guardarse (operacion atomica)
* Si el stock resultante queda por debajo del minimo configurado, debe generarse automaticamente una alerta de stock bajo

RF relacionado: RF-17, RF-18

---

Modulo: Notificaciones

HU-B11: Servicio de envio de correos electronicos con plantillas

Como sistema,
quiero un servicio de notificaciones que use plantillas configurables para enviar correos a propietarios en eventos clave (confirmacion de cita, recordatorio y alerta de vacunacion),
para mantener comunicacion oportuna y personalizada sin intervencion manual.

Criterios de aceptacion:
* El servicio debe integrarse con un servidor SMTP configurado por variables de entorno
* Debe soportar tres tipos de plantilla: confirmacion de cita, recordatorio 24h antes de la cita y alerta de vacuna pendiente
* Las plantillas deben admitir variables dinamicas: nombre del propietario, nombre de la mascota, fecha, hora y motivo
* Cada intento de envio debe registrarse en la tabla de historial de notificaciones con estado (enviado / fallido) y timestamp
* En caso de fallo, debe registrar el motivo del error sin exponer datos sensibles en los logs

RF relacionado: RF-19, RF-21

---

HU-B12: API de historial de notificaciones

Como desarrollador backend,
quiero un endpoint que permita consultar el historial completo de notificaciones enviadas, filtrable por propietario, tipo y estado,
para que el administrador pueda verificar entregas y reenviar notificaciones fallidas.

Criterios de aceptacion:
* El endpoint (GET /notificaciones) debe soportar filtros por: propietario ID, tipo (confirmacion, recordatorio, alerta) y estado (enviado, fallido)
* Los resultados deben estar paginados con un maximo de 50 por pagina
* Debe existir un endpoint (POST /notificaciones/{id}/reenviar) para reintentar el envio de una notificacion fallida
* El reenvio debe actualizar el estado y registrar un nuevo timestamp en el historial
* Un administrador puede consultar el historial de cualquier propietario; una recepcionista solo puede reenviar

RF relacionado: RF-20

---

Modulo: Seguridad y Auditoria

HU-B13: Sistema de autenticacion JWT y log de auditoria

Como desarrollador backend,
quiero implementar autenticacion basada en tokens JWT con control de acceso por roles y registro automatico de auditoria para todas las acciones criticas,
para garantizar que solo personal autorizado acceda al sistema y que exista trazabilidad completa de las operaciones realizadas.

Criterios de aceptacion:
* El endpoint (POST /auth/login) debe validar credenciales y retornar un token JWT con el rol del usuario y tiempo de expiracion de 30 minutos
* Tras 3 intentos fallidos de login desde el mismo usuario, la cuenta debe bloquearse temporalmente por 15 minutos
* Las contrasenas deben almacenarse hasheadas con bcrypt (minimo 12 rounds)
* Cada endpoint sensible debe validar el token y el rol requerido antes de procesar la solicitud
* Las acciones criticas (crear, modificar, eliminar registros clinicos, cambios de inventario, modificaciones de roles) deben registrarse automaticamente en un log de auditoria con: usuario, accion, timestamp, IP de origen e ID del registro afectado
* El endpoint (GET /auditoria) debe ser accesible unicamente por el administrador y soportar filtros por usuario, fecha y tipo de accion

RF relacionado: RF-25, RF-26, RF-27

---