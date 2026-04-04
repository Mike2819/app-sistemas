import client from './client';
import { ENDPOINTS } from '../utils/constants';

/**
 * Envía el nuevo PIN de 4 dígitos al servidor para configurarlo.
 */
export const setupSecurityPin = async (pin: string) => {
  try {
    const response = await client.post(ENDPOINTS.SETUP_PIN, { pin });
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error.message;
  }
};

/**
 * Verifica si el PIN ingresado coincide con el del usuario.
 */
export const verifySecurityPin = async (pin: string) => {
  try {
    const response = await client.post(ENDPOINTS.VERIFY_PIN, { pin });
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error.message;
  }
};