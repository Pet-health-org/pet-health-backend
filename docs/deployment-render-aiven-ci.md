# Deployment, Aiven y CI

## Branch de trabajo

La rama de trabajo para este paquete de cambios es:

```text
produccion
```

Flujo sugerido:

1. Trabajar y commitear en `produccion`.
2. Abrir PR hacia `main`.
3. Revisar el pipeline de GitHub Actions antes del merge.
4. Hacer deploy manual en Render con Docker.

## Base de datos Aiven

La base no usa Render. Se conecta a Aiven por MySQL con SSL requerido.

Valores principales:

```text
DB_HOST=backend-practica-backend.f.aivencloud.com
DB_PORT=19918
DB_USERNAME=avnadmin
DB_PASSWORD=<secret>
DB_NAME=pet-health
DB_SSL=true
DB_SSL_CA=<pem>
```

No se debe subir el archivo `CA` al repositorio. Para Render, pega el certificado PEM completo en la variable secreta `DB_SSL_CA`.

## Render

El despliegue en Render es manual y usa Docker.

Variables recomendadas en Render:

```text
NODE_ENV=production
PORT=10000
DB_SSL=true
DB_SSL_CA=<pem>
DB_SYNCHRONIZE=false
DB_LOGGING=false
JWT_EXPIRES_IN=1800
```

No usar una base de datos local dentro de Render.

## GitHub Actions

El workflow `.github/workflows/ci.yml` valida:

```text
build
unit tests
e2e tests
```

El job de `e2e` corre contra un MySQL 8.4 efimero levantado por GitHub Actions, asi que no depende de Aiven para pasar.

Se ejecuta en:

- `push` a `main` y `produccion`
- `pull_request` hacia `main` y `produccion`

No despliega automáticamente a Render porque el deploy será manual.
