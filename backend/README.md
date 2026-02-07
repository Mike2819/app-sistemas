# 🚀 Backend - App Sistemas

API REST construida con **Express.js** y **MongoDB** para la gestión de autenticación y usuarios.

## 📁 Estructura del proyecto

```
backend/
├── .env                          # Variables de entorno
├── .env.example                  # Plantilla de variables de entorno
├── package.json
└── src/
    ├── server.js                 # Punto de entrada de la aplicación
    ├── config/
    │   ├── db.js                 # Conexión a MongoDB
    │   └── swagger.js            # Configuración de Swagger
    ├── controllers/
    │   └── authController.js     # Lógica de autenticación
    ├── middlewares/
    │   └── auth.js               # Middleware de protección JWT
    ├── models/
    │   └── User.js               # Modelo de usuario
    └── routes/
        └── authRoutes.js         # Rutas de autenticación
```

## ⚙️ Tecnologías

| Tecnología         | Uso                              |
| ------------------ | -------------------------------- |
| Express.js 5       | Framework del servidor           |
| MongoDB + Mongoose | Base de datos                    |
| JWT                | Manejo de sesiones               |
| bcryptjs           | Hasheo de contraseñas            |
| CORS               | Conexión segura con el frontend  |
| Swagger            | Documentación interactiva de API |
| dotenv             | Variables de entorno             |
| nodemon            | Hot-reload en desarrollo         |

## 🛠️ Instalación

### Prerrequisitos

- [Node.js](https://nodejs.org/) v18 o superior
- [MongoDB](https://www.mongodb.com/) corriendo localmente o una URI de MongoDB Atlas

### Pasos

1. **Instalar dependencias:**

   ```bash
   cd backend
   npm install
   ```

2. **Configurar variables de entorno:**

   Copia el archivo de ejemplo y edítalo con tus valores:

   ```bash
   cp .env.example .env
   ```

   | Variable           | Descripción                          | Ejemplo                                   |
   | ------------------ | ------------------------------------ | ----------------------------------------- |
   | `PORT`             | Puerto del servidor                  | `5000`                                    |
   | `MONGO_URI`        | URI de conexión a MongoDB            | `mongodb://localhost:27017/app-sistemas`   |
   | `JWT_SECRET`       | Clave secreta para firmar tokens JWT | `mi_clave_super_secreta`                  |
   | `JWT_EXPIRES_IN`   | Tiempo de expiración del token       | `7d`                                      |
   | `SWAGGER_USER`     | Usuario para acceder a Swagger       | `admin`                                   |
   | `SWAGGER_PASSWORD` | Contraseña para acceder a Swagger    | `admin123`                                |

3. **Iniciar el servidor:**

   ```bash
   # Desarrollo (con hot-reload)
   npm run dev

   # Producción
   npm start
   ```

## 📌 Endpoints

### Autenticación (`/api/auth`)

| Método | Ruta        | Acceso  | Descripción                       |
| ------ | ----------- | ------- | --------------------------------- |
| POST   | `/register` | Público | Registrar un nuevo usuario        |
| POST   | `/login`    | Público | Iniciar sesión                    |
| GET    | `/profile`  | Privado | Obtener perfil del usuario actual |

### Registro — `POST /api/auth/register`

**Body (JSON):**

```json
{
  "nombres": "Juan Carlos",
  "apellidos": "Pérez López",
  "email": "juan@correo.com",
  "telefono": "6141234567",
  "password": "miPassword123"
}
```

**Respuesta exitosa (201):**

```json
{
  "success": true,
  "message": "Usuario registrado exitosamente",
  "data": {
    "_id": "64a1f2b3c4d5e6f7a8b9c0d1",
    "nombres": "Juan Carlos",
    "apellidos": "Pérez López",
    "email": "juan@correo.com",
    "telefono": "6141234567",
    "token": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

### Login — `POST /api/auth/login`

**Body (JSON):**

```json
{
  "email": "juan@correo.com",
  "password": "miPassword123"
}
```

### Perfil — `GET /api/auth/profile`

**Header:**

```
Authorization: Bearer <token>
```

## 📖 Documentación Swagger

La documentación interactiva está disponible en:

```
http://localhost:5000/api/docs
```

> ⚠️ Está protegida con **HTTP Basic Auth**. Usa las credenciales configuradas en `SWAGGER_USER` y `SWAGGER_PASSWORD` del archivo `.env`.

## 👤 Modelo de Usuario

| Campo      | Tipo     | Requerido | Notas                                |
| ---------- | -------- | --------- | ------------------------------------ |
| `_id`      | ObjectId | Auto      | Generado automáticamente por MongoDB |
| `nombres`  | String   | ✅        | Nombres del usuario                  |
| `apellidos`| String   | ✅        | Apellidos del usuario                |
| `email`    | String   | ✅        | Único, formato email válido          |
| `telefono` | String   | ✅        | Número de teléfono                   |
| `password` | String   | ✅        | Mín. 6 caracteres, hasheado con bcrypt |

## 🔐 Seguridad

- Las contraseñas se **hashean con bcrypt** antes de almacenarse (salt de 10 rondas).
- El campo `password` tiene `select: false`, nunca se retorna en consultas.
- Los tokens **JWT** se envían en las respuestas de login/register y se validan mediante el header `Authorization: Bearer <token>`.
- **CORS** habilitado para conexión segura con el frontend.
- **Swagger** protegido con autenticación básica.
