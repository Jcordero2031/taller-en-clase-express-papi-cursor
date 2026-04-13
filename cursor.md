# CURSOR.md — memoria del proyecto

Este archivo es la **fuente de verdad operativa** para humanos y agentes. Quien continúe el trabajo debe **leerlo primero** y, tras cada cambio relevante en el código o en el flujo de trabajo, **actualizar la sección “Historial de cambios” y las secciones que dejen de ser ciertas**.

### Mantenimiento obligatorio de esta memoria (acuerdo con la dueña)

**A partir de acuerdo explícito:** cada vez que la dueña haga una **pregunta** o dé una **indicación** que afecte a **la memoria del proyecto** o a **cómo** se van a ejecutar las acciones (arquitectura, herramientas, convenciones, despliegue, pruebas, etc.), el agente debe **actualizar este `CURSOR.md` en la misma interacción** (secciones que correspondan + nueva fila en el historial), salvo que pida explícitamente lo contrario.

---

## 1. Qué es este proyecto

Taller Express (GitHub Classroom): API con autenticación por token y ruta protegida por roles, más despliegue en Netlify. Criterio de evaluación (README): funcionamiento (tokens, roles), arquitectura, despliegue.

### Requisitos funcionales (README)

| Ruta | Comportamiento esperado |
|------|-------------------------|
| `POST /login` (o el método acordado) | **200** → `{ "Token": "..." }` (según enunciado). **400** → `{ "message": "invalid credentials" }`. |
| `/request` | Con rol **ADMIN**: **200** → `{ "message": "Hi from ADMIN" }`. Con rol **USER**: **200** → `{ "message": "Hi from USER" }`. Caso no permitido: **401** → `{ "message": "You're not allowed to do this" }`. |

Credenciales fijas:

- **ADMIN**: usuario `ADMIN`, contraseña `ADMIN`
- **USER**: usuario `USER`, contraseña `USER`

Despliegue: **Netlify** (enlace arriba del README). GitHub Pages **no** cuenta. Sin despliegue en Netlify: 0 en esa parte.

**Nota (2026-04-12):** además se preparó despliegue opcional en **Vercel** (extensión / dashboard); **no sustituye** el requisito de Netlify del README para la calificación del taller.

---

## 2. Reglas y acuerdos (no romper sin consultar a la dueña del repo)

1. **`node_modules` no se versiona**: debe estar en `.gitignore`. Nunca subir `node_modules`.
2. **Netlify**: despliegue **manual** desde la web de Netlify (la dueña del proyecto lo hace así).
3. **Pruebas**: se usará **Postman**; conviene documentar método, URL, body y headers (p. ej. `Authorization`) en este archivo cuando exista la API.
4. **Variables de entorno**: **no usar** si pueden complicar o romper el funcionamiento (acuerdo explícito). El bonus del README por usar `.env` es opcional.
5. Tras implementar, **actualizar README** con el enlace de Netlify **arriba**, según el enunciado.
6. **Vercel (adicional):** el repo incluye configuración para desplegar con la **extensión Vercel** (VS Code / Cursor) o con [vercel.com](https://vercel.com). Sigue siendo obligatorio para el enunciado del aula: **Netlify + enlace en README** (apartado anterior).

---

## 2b. Arquitectura y técnica acordadas

| Tema | Decisión |
|------|----------|
| **Organización de la API** | **Express `Router`**: rutas agrupadas en routers (p. ej. auth vs. recurso protegido); handlers en **controladores** donde aplique; separación clara para el criterio de arquitectura del taller. |
| **Autenticación / sesión** | **JWT**: emitir token en `/login`; **middleware** que verifique el JWT y el **rol** antes de responder en `/request`. |

---

## 3. Estado actual del repositorio

| Ítem | Estado |
|------|--------|
| Código Express / endpoints | **Hecho** en local: `POST /login` (JWT), `GET /request` (middleware JWT + rol). |
| Pruebas Postman (todos los casos del README) | **Verificado en localhost** por la dueña (2026-04-12). |
| `.gitignore` | **Hecho** — incluye `node_modules/`, `.env*`, logs, `.vercel/`. |
| `package-lock.json` | **Hecho** (tras `npm install`). |
| Despliegue Netlify | **Pendiente** (manual por la dueña). |
| Enlace Netlify en README | **Pendiente**. |
| Archivos / scripts Vercel en el repo | **Hecho:** `vercel.json`, `vercel` en `devDependencies`, scripts `vercel:dev` y `vercel:deploy`. La app exportada en **`src/app.js`** es la que Vercel usa como función (ver [Express on Vercel](https://vercel.com/docs/frameworks/backend/express)). |
| Despliegue en la cuenta Vercel (prod/preview) | **Pendiente** (login en Vercel + “Import Project” o extensión **Deploy**). |

**Estructura de código (indispensable actual):**

- `src/index.js` — arranque, puerto **3000**.
- `src/app.js` — Express, `express.json()`, `GET /` (mensaje guía para el navegador), montaje de routers.
- `src/config/constants.js` — usuarios del README, `JWT_SECRET` y expiración en código (sin `.env`).
- `src/routes/auth.routes.js` — `POST /login`.
- `src/routes/request.routes.js` — `GET /request` + `requireJwt`.
- `src/controllers/auth.controller.js` / `request.controller.js`.
- `src/middleware/auth.middleware.js` — `Authorization: Bearer <jwt>`; si falta, es inválido o el rol no es ADMIN/USER → **401** con el mensaje del README.
- `vercel.json` — solo `$schema` (sin overrides que rompan la detección automática de Express).

---

## 4. Cómo debe trabajar un agente

1. Leer **este archivo** y el `README.md`.
2. Hacer solo los cambios acordados; respetar la **sección 2** (reglas y acuerdos) y la **sección 2b** (arquitectura JWT + Router).
3. Si la dueña comunica algo que afecte memoria o forma de trabajo: **actualizar `CURSOR.md`** al vuelo (véase el bloque *Mantenimiento obligatorio* arriba).
4. Al terminar una tarea o un bloque lógico en código: actualizar la **sección 3** (estado), la **sección 5** (Postman / run local) si aplica, y añadir una entrada en la **sección 6**.
5. Si se introduce una convención nueva (puerto por defecto, formato del token, prefijo de API), documentarla aquí en una frase clara.

---

## 5. Cómo probar (Postman)

- **Estado:** la dueña confirmó que en **localhost** pasan **todos los casos** relevantes (login ok/error, `/request` por ADMIN y USER, no autorizado).
- **Postman en el navegador (web) y `localhost`:** el cliente web no puede hablar solo con tu PC; Postman pide el **Desktop Agent** o usar la app nativa. **Recomendado:** instalar la **app de escritorio Postman** desde [postman.com/downloads](https://www.postman.com/downloads/) y probar ahí `http://localhost:3000`. **Alternativa:** seguir en el navegador, instalar el agente de escritorio que indica Postman y en la esquina inferior elegir **Desktop Agent** (no “Cloud” ni otro).
- **Arranque local:** en la raíz del repo, `npm install` (una vez). Luego **o bien** `npm start` **o bien** `npm run dev` (recarga al guardar). **No** uses `npm start dev` (no es un script definido así; lo correcto es `npm run dev`).
- **Windows + PowerShell:** si aparece *“ejecución de scripts está deshabilitada”* al usar `npm`, es la política de PowerShell con `npm.ps1`. **Opciones:** ejecutar `npm.cmd start` / `npm.cmd run dev`; o `node src/index.js`; o abrir **CMD** o Git Bash; o una vez por usuario: `Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned` en PowerShell.
- **URL base local:** `http://localhost:3000`
- **Postman: `connect ECONNREFUSED 127.0.0.1:3000`:** no hay servidor escuchando. En una terminal, dentro de la carpeta del proyecto, deja corriendo `npm start`, `npm.cmd start` o `node src/index.js` hasta ver el mensaje de que escucha en el puerto 3000; **sin eso**, Postman no puede conectar. Comprueba en el navegador `http://localhost:3000/` (debería responder JSON); si no carga, el proceso Node no está activo o el puerto es otro.
- **Body de `/login`:** deben ser las claves **`user`** y **`password`** (no `username`, `email`, `name`, etc.; no el ejemplo por defecto de Postman con `"name": "Add your name in the body"`).
- **Postman responde `400` con `invalid credentials`:** casi siempre el body no llega bien o no coincide. Revisa: pestaña **Body** → **raw** → tipo **JSON**; que exista header **`Content-Type: application/json`** (Postman suele ponerlo solo en raw JSON); JSON exacto por ejemplo `{"user":"ADMIN","password":"ADMIN"}` (mayúsculas como en el README). Si usas *form-data* o *x-www-form-urlencoded*, `req.body` puede ir vacío y fallará el login.
- **Solo abrir en el navegador** `http://localhost:3000/`: antes respondía *Cannot GET /* porque no había ruta `GET /`; ahora hay una respuesta JSON informativa. **Las pruebas del taller** (login y token) van con **Postman**, no con el navegador en `/login` (eso sería GET y no aplica).
- **Error `EADDRINUSE` … puerto 3000:** ya hay otro proceso usando el puerto (suele ser otra ventana con `node`/`npm start` abierta). Cierra esa terminal (**Ctrl+C**) o libera el proceso. En Windows: ejecuta `netstat -ano | findstr :3000`. En la salida, la **última columna** es el **PID** (solo dígitos, por ejemplo `18432`). Luego ejecuta **`taskkill /PID 18432 /F`** sustituyendo `18432` por tu PID real. **No pongas** símbolos `<` `>` ni la palabra “ese_número”: en PowerShell `<` da error.

**Login**

- Método: **POST**
- URL: `http://localhost:3000/login`
- Body: **raw JSON**, por ejemplo:
  - `{"user":"ADMIN","password":"ADMIN"}` o `{"user":"USER","password":"USER"}`
- Respuesta esperada: **200** con cuerpo `{ "Token": "<jwt>" }`. Credenciales incorrectas: **400** `{ "message": "invalid credentials" }`.

**Request (por rol)**

- Método: **GET**
- URL: `http://localhost:3000/request`
- Headers: `Authorization` = `Bearer <pegar Token del login sin comillas extra>`
- **200** `{ "message": "Hi from ADMIN" }` o `{ "message": "Hi from USER" }` según el usuario con el que se hizo login.
- Sin header, token mal formado, JWT inválido o rol no permitido: **401** `{ "message": "You're not allowed to do this" }`.

### Vercel (opcional; no cuenta para el enunciado de Netlify del README)

- **Requisito en máquina:** `npm install` (instala el CLI `vercel` como devDependency). La documentación de Vercel para Express pide CLI **≥ 47.0.5**; el `package.json` fija `vercel` en ese rango.
- **Probar como en producción (local):** en la raíz del repo, `npm.cmd run vercel:dev` (o `npm run vercel:dev` si PowerShell permite `npm`). La primera vez pedirá login en el navegador.
- **Desplegar con la extensión:** instalar **“Vercel”** en el marketplace del editor → comando típico **“Vercel: Deploy”** / flujo de login y elegir el directorio del proyecto. Alternativa: [vercel.com/new](https://vercel.com/new) → importar el repo Git → el preset suele detectarse solo (**Other** / Node si hiciera falta; el entry de Express es `src/app.js`).
- **Postman contra la nube:** sustituir la base `http://localhost:3000` por la URL del despliegue (p. ej. `https://<proyecto>.vercel.app`): mismos paths `POST /login` y `GET /request`.

---

## 6. Historial de cambios (mantener al día)

Las entradas más recientes **arriba**.

| Fecha | Autor | Resumen |
|-------|--------|---------|
| 2026-04-12 | Agente | **Vercel:** `vercel.json`, `vercel` en devDependencies, scripts `vercel:dev` / `vercel:deploy`, `.vercel` en `.gitignore`. Documentado en §1, §2, §3, §5 y §7. El README del taller **sigue** exigiendo Netlify para la nota. |
| 2026-04-12 | Dueña / agente | Confirmado: API en **localhost** probada con Postman; **todos los casos** OK. Secciones 3, 5 y 7 actualizadas. Pendiente según README: **Netlify** + enlace arriba en `README.md`. |
| 2026-04-12 | Agente | Sección 5: `npm run dev` vs `npm start dev`; troubleshooting **400 invalid credentials** (raw JSON, `Content-Type`, claves `user`/`password`, no form-data vacío). |
| 2026-04-12 | Agente | Sección 5: **ECONNREFUSED** = API no arrancada o terminal cerrada; body login = `user`/`password` (no plantilla `"name"` de Postman). |
| 2026-04-12 | Agente | Sección 5: Postman web requiere **Desktop Agent** (o usar app Postman de escritorio) para `localhost`; `taskkill` con **PID numérico real** (sin `<>`) para liberar puerto 3000. |
| 2026-04-12 | Agente | `GET /` en `app.js`: respuesta JSON guía (evita *Cannot GET /* en navegador). CURSOR sección 5: explicación EADDRINUSE puerto 3000 y que `/login` se prueba con Postman (POST). |
| 2026-04-12 | Agente | Documentado en sección 5: en **PowerShell** con *ExecutionPolicy* restrictiva, usar `npm.cmd`, `node src/index.js`, CMD, o `Set-ExecutionPolicy -Scope CurrentUser RemoteSigned`. |
| 2026-04-12 | Agente | Archivos indispensables: `.gitignore`, `package.json` + lock, `src/` con `app`, `index` (puerto 3000), `config/constants`, routers auth/request, controladores, middleware JWT. Endpoints alineados al README; Postman documentado en sección 5. |
| 2026-04-12 | Agente | Acuerdo: ante preguntas o indicaciones que afecten memoria o cómo se hacen las acciones, actualizar siempre `CURSOR.md`. Arquitectura fijada: **Express Router + JWT** (middleware para `/request`). |
| 2026-04-12 | Agente | Creación de `CURSOR.md`: memoria inicial, reglas acordadas con la dueña, estado “solo README / sin código aún”. |

---

## 7. Próximos pasos sugeridos (editar al avanzar)

- [x] Añadir `.gitignore` con `node_modules/`.
- [x] Inicializar proyecto Node/Express con **Router + controladores + middleware JWT** según sección 2b.
- [x] Implementar `/login` y `/request` según README.
- [x] Probar con Postman en tu máquina (guía en sección 5) — verificado 2026-04-12.
- [ ] Añadir capa Netlify (p. ej. función serverless) cuando toque el despliegue manual.
- [ ] Desplegar en Netlify (manual) y poner el enlace arriba en `README.md`.
- [x] Preparar despliegue opcional en Vercel (extensión / dashboard): archivos y scripts en el repo.
- [ ] Conectar cuenta Vercel y publicar (preview/prod); probar `POST /login` y `GET /request` con la URL pública.
