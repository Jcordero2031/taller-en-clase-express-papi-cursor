[Review Assignment Due Date](https://classroom.github.com/a/WT_1Elfp)

# Taller en clase

## 8:00am - 8:30am!

### Generar 1 endpoint de autenticación (/login):

- [200] {Token: "Token ..."}
- [400] {message: "invalid credentials"}

### credenciales USER y ADMIN:

- ADMIN -> user:ADMIN , password:ADMIN
- USER -> user:USER , password:USER

### Generar 1 endpoint de consulta por roles (/request):

- Rol ('ADMIN') -> [200] {message: "Hi from ADMIN"}
- Rol ('USER') -> [200] {message: "Hi from USER"}
- "*" -> [401] {message: "You're not allowed to do this"}

- Desplegado en netlify o vercel y con el link puesto en la parte de arriba del README.md, si no se despliega se tiene 0 (desplegar en github pages tampoco cuenta).

### Requerimientos

- 33% -> Funcionamiento
  -Tokens
  -Roles
- 33% -> Arquitectura
- 33% -> Despliegue

(si se usan variables de entorno bien se da 1 punto positivo mas es opcional y no se va a quitar nota por no usarla)