import ReactNativeBiometrics, { BiometryTypes } from 'react-native-biometrics';

const rnBiometrics = new ReactNativeBiometrics();

/**
 * Solicita la validación biométrica del usuario (Huella, FaceID o PIN).
 * @returns {Promise<boolean>} true si la identidad se confirma, false si falla o cancela.
 */
export const authenticateUser = async (): Promise<boolean> => {
  try {
    // Le preguntamos al hardware si tiene lector y si está configurado
    const { available, biometryType } = await rnBiometrics.isSensorAvailable();

    if (!available) {
      // Caso Borde: El celular no tiene seguridad o no tiene lector
      console.warn('El dispositivo no soporta biometría o no está configurada.');
      return false; 
    }

    // Disparamos la ventana nativa del sistema operativo
    const { success } = await rnBiometrics.simplePrompt({ 
      promptMessage: 'Confirma tu identidad para registrar asistencia',
      cancelButtonText: 'Cancelar'
    });

    return success;

  } catch (error) {
    console.error('Error en el proceso biométrico:', error);
    return false;
  }
};