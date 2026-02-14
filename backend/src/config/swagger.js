import swaggerJSDoc from "swagger-jsdoc";

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "App Sistemas API",
      version: "1.0.0",
      description: "API REST para App Sistemas - Autenticación y gestión de usuarios",
    },
    servers: [
      {
        url: "http://localhost:{port}/api",
        description: "Servidor de desarrollo",
        variables: {
          port: {
            default: "5000",
          },
        },
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
      schemas: {
        User: {
          type: "object",
          properties: {
            _id: {
              type: "string",
              description: "ID generado por MongoDB",
              example: "64a1f2b3c4d5e6f7a8b9c0d1",
            },
            nombres: {
              type: "string",
              description: "Nombres del usuario",
              example: "Juan Carlos",
            },
            apellidos: {
              type: "string",
              description: "Apellidos del usuario",
              example: "Pérez López",
            },
            email: {
              type: "string",
              format: "email",
              description: "Correo electrónico del usuario",
              example: "juan@correo.com",
            },
            telefono: {
              type: "string",
              description: "Número de teléfono",
              example: "6141234567",
            },
          },
        },
        RegisterInput: {
          type: "object",
          required: ["nombres", "apellidos", "email", "telefono", "password"],
          properties: {
            nombres: {
              type: "string",
              example: "Juan Carlos",
            },
            apellidos: {
              type: "string",
              example: "Pérez López",
            },
            email: {
              type: "string",
              format: "email",
              example: "juan@correo.com",
            },
            telefono: {
              type: "string",
              example: "6141234567",
            },
            password: {
              type: "string",
              format: "password",
              minLength: 6,
              example: "miPassword123",
            },
          },
        },
        LoginInput: {
          type: "object",
          required: ["email", "password"],
          properties: {
            email: {
              type: "string",
              format: "email",
              example: "juan@correo.com",
            },
            password: {
              type: "string",
              format: "password",
              example: "miPassword123",
            },
          },
        },
        AuthResponse: {
          type: "object",
          properties: {
            success: {
              type: "boolean",
              example: true,
            },
            message: {
              type: "string",
            },
            data: {
              type: "object",
              properties: {
                _id: { type: "string", example: "64a1f2b3c4d5e6f7a8b9c0d1" },
                nombres: { type: "string", example: "Juan Carlos" },
                apellidos: { type: "string", example: "Pérez López" },
                email: { type: "string", example: "juan@correo.com" },
                telefono: { type: "string", example: "6141234567" },
                token: { type: "string", example: "eyJhbGciOiJIUzI1NiIs..." },
              },
            },
          },
        },
        ErrorResponse: {
          type: "object",
          properties: {
            success: {
              type: "boolean",
              example: false,
            },
            message: {
              type: "string",
              example: "Mensaje de error",
            },
          },
        },
      },
    },
  },
  apis: ["./src/routes/*.js"],
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);

export default swaggerSpec;
