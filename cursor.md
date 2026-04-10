# Memoria de la sesión (Cursor)

Este archivo registra **todo lo que se hizo** en esta sesión dentro del repo `taller-en-clase-expres-papi-cursor`, incluyendo plan, implementaciones, correcciones y limpieza de configuración de despliegue.

## 1) Punto de partida

- El repositorio inicialmente solo contenía `README.md` (no existían `package.json` ni archivos `.js` del proyecto).
- El `README.md` pedía:
  - Endpoint **`/login`**:
    - **200** → `{Token: "Token ..."}`
    - **400** → `{message: "invalid credentials"}`
  - Credenciales:
    - `ADMIN/ADMIN`
    - `USER/USER`
  - Endpoint **`/request`** por roles:
    - Rol `ADMIN` → **200** `{message: "Hi from ADMIN"}`
    - Rol `USER` → **200** `{message: "Hi from USER"}`
    - Cualquier otro → **401** `{message: "You're not allowed to do this"}`
  - Despliegue (según README): “vercel o netlify” + link arriba del README.
  - Recomendación: usar variables de entorno (punto positivo).

## 2) Plan de acción (acordado y luego implementado)

Se definió un plan paso a paso para:

- Revisar estructura del proyecto.
- Implementar `/login` con tokens.
- Implementar verificación de token (middleware).
- Implementar `/request` con control de roles.
- Preparar despliegue.
- Poner link arriba en `README.md`.

## 3) Implementación del proyecto (creación desde cero)

Como el repo no tenía estructura Node/Express, se **creó** una base mínima:

### Archivos agregados

- `package.json`
  - Dependencias: `express`, `jsonwebtoken`, `dotenv`
  - Scripts: `start` y `dev` con `node server.js`
- `server.js`
  - Arranca el servidor Express local.
  - Lee variables con `dotenv`.
- `src/app.js`
  - Define la app Express, rutas y middlewares.
- `.env.example`
  - Ejemplo de variables: `JWT_SECRET` y `PORT`.

### Endpoints implementados

- `POST /login`
  - Lee `user` y `password` del body JSON.
  - Si credenciales válidas:
    - Genera un JWT (con `expiresIn: "1h"`).
    - Devuelve **200** con `{ "Token": "<jwt>" }`.
  - Si inválidas:
    - Devuelve **400** con `{ "message": "invalid credentials" }`.

- `GET /request`
  - Protegido por middleware de autenticación (`auth`) que verifica el JWT.
  - Responde según `role` dentro del token:
    - `ADMIN` → **200** `{ "message": "Hi from ADMIN" }`
    - `USER` → **200** `{ "message": "Hi from USER" }`
    - Otro / sin rol / sin token → **401** `{ "message": "You're not allowed to do this" }`

- `GET /health`
  - Endpoint de salud para pruebas rápidas.

### Tokens y variables de entorno

- Se exige `JWT_SECRET` como variable de entorno.
  - Si no existe, el servidor lanza error explicando que falta.
- Esto se hizo así para:
  - No hardcodear secretos.
  - Cumplir con el “punto positivo” de variables de entorno bien usadas.

## 4) Correcciones posteriores (bugs reportados)

### Bug: prefijo `"Token "` y Authorization

Se detectó el caso típico:
- Si `/login` devolvía `Token <jwt>` y el usuario pegaba ese valor en `Authorization: Bearer <valor>`, entonces `jwt.verify()` recibiría `"Token eyJ..."` y fallaría.

Solución aplicada en `src/app.js`:
- `/login` quedó devolviendo **solo** el JWT (sin prefijo).
- El extractor del Bearer token se hizo más tolerante:
  - Acepta `Authorization: Bearer <jwt>`
  - También acepta `Authorization: Bearer Token <jwt>` (remueve `Token ` si aparece).

## 5) Despliegue (cambios y limpieza)

### Estado inicial (se agregó y luego se quitó)

En un punto se añadió configuración para Vercel:
- `vercel.json`
- `api/index.js`

Luego se reportó que eso no correspondía y se pidió usar Netlify.

### Cambio a Netlify (y luego eliminación total)

Se llegó a crear (temporalmente) estructura de Netlify Functions:
- `netlify.toml`
- `netlify/functions/api.js`
- Dependencia `serverless-http`
- Se agregó texto de “Deploy (Netlify)” al `README.md`.

Después el usuario indicó que el despliegue sería **manual desde la página** y pidió:
- Quitar **todo lo relacionado a Netlify** (archivos y texto).

Acciones realizadas:
- Eliminados:
  - `netlify.toml`
  - `netlify/functions/api.js`
  - Carpeta `netlify/` (quedaba vacía en disco)
- Eliminados:
  - `vercel.json`
  - `api/index.js`
- Removida dependencia `serverless-http` del `package.json`
- Eliminada la línea “Deploy (Netlify)” del `README.md`

Resultado:
- El proyecto queda como un **Express tradicional** para despliegue manual donde la plataforma ejecute `npm install` y `npm start`.

## 6) `.gitignore` y `node_modules`

Se solicitó asegurar que `node_modules` no se subiera.

Acciones:
- Se creó `.gitignore` con:
  - `node_modules/`
  - `.env`
  - `.netlify/`
  - `.vercel/`
  - logs de npm/yarn
- Se verificó que `node_modules` estaba presente localmente, pero no quedó trackeado por git.

## 7) Instalación y verificación rápida

- Se ejecutó `npm install` para instalar dependencias.
- Se probó un arranque rápido del servidor in-memory (asignando `JWT_SECRET` en runtime) para verificar que la app Express levanta sin errores.

## 8) Preguntas respondidas (explicaciones)

- **`server.js`**:
  - Se explicó que es el entrypoint que:
    - carga `.env`
    - importa `app` desde `src/app.js`
    - define puerto
    - hace `listen()`

- **Carpeta `api/` vacía**:
  - Se explicó que suele existir por convenciones “serverless” (p.ej. Vercel) o como placeholder.
  - Si está vacía, no cumple función y puede borrarse sin afectar.

## 9) Estado final esperado

- API Express funcional con:
  - `POST /login`
  - `GET /request` (roles)
  - token JWT y middleware de auth
- Sin configuración específica de Netlify/Vercel (para despliegue manual).
- `.gitignore` correcto para no subir `node_modules`.

