import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import swaggerUi from "swagger-ui-express";
import connectDB from "./config/db.js";
import swaggerSpec from "./config/swagger.js";
import authRoutes from "./routes/authRoutes.js";
import attendanceRoutes from "./routes/attendanceRoutes.js";

// Cargar variables de entorno
dotenv.config();

const app = express();

// Middlewares globales
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas
app.use("/api/auth", authRoutes);
app.use("/api/attendance", attendanceRoutes);

// Middleware de autenticación básica para Swagger
const swaggerAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Basic ")) {
    res.set("WWW-Authenticate", 'Basic realm="Swagger Docs"');
    return res.status(401).send("Autenticación requerida para acceder a la documentación");
  }

  const base64Credentials = authHeader.split(" ")[1];
  const credentials = Buffer.from(base64Credentials, "base64").toString("utf-8");
  const [user, password] = credentials.split(":");

  if (user === process.env.SWAGGER_USER && password === process.env.SWAGGER_PASSWORD) {
    return next();
  }

  res.set("WWW-Authenticate", 'Basic realm="Swagger Docs"');
  return res.status(401).send("Credenciales inválidas");
};

// Swagger docs (protegido con Basic Auth)
app.use("/api/docs", swaggerAuth, swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Ruta de prueba
app.get("/", (req, res) => {
  res.json({ message: "API de App Sistemas funcionando 🚀" });
});

// Wrap: conectar DB y luego iniciar servidor
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Servidor corriendo en puerto ${PORT}`);
    });
  } catch (error) {
    console.error(`Error al iniciar el servidor: ${error.message}`);
    process.exit(1);
  }
};

startServer();
