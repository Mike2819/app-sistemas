// 1. Definimos el Usuario (Espejo de MongoDB)
export interface User {
  _id: string;       
  nombres: string;
  apellidos: string;
  email: string;
  telefono?: string;
  rol?: string;
}

// Definimos la respuesta de la API
// El backend devuelve todo dentro de un objeto "data"
export interface AuthResponse {
  success: boolean;
  message: string;
  data: User & { token: string }; // "data" es el Usuario + el Token mezclados
}

// Payload para Login 
export interface LoginPayload {
  email: string;
  password: string;
}