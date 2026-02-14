import { Platform } from 'react-native';

// Configuración de Red
// Android Emulator usa 10.0.2.2 para referirse al localhost de la PC
// iOS Simulator usa localhost directamente
const API_URL_ANDROID = 'http://10.0.2.2:5000/api';
const API_URL_IOS = 'http://localhost:5000/api';

// Selecciona automáticamente según el SO
export const API_BASE_URL = Platform.select({
  android: API_URL_ANDROID,
  ios: API_URL_IOS,
}) || API_URL_ANDROID;

// Endpoints
export const ENDPOINTS = {
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  PROFILE: '/auth/profile',
};

// AsyncStorage
export const STORAGE_KEYS = {
  TOKEN: 'user_jwt_token',
  USER_DATA: 'user_info',
};