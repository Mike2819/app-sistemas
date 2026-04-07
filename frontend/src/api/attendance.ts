import AsyncStorage from '@react-native-async-storage/async-storage';
import client from './client';

const OFFLINE_STORAGE_KEY = '@offline_attendance_records';

// Definimos la estructura exacta de lo que guardaremos
export interface AttendanceRecord {
  timestamp: string; // La hora exacta en la que se presionó el botón
  tipoRegistro: 'ENTRADA' | 'SALIDA';
  coordenadas: { lat: number; lng: number };
}

/**
 * Guarda un registro de asistencia en la memoria interna del teléfono.
 */
export const saveOfflineRecord = async (record: AttendanceRecord) => {
  try {
    // Buscamos si ya hay registros previos esperando
    const existingRecordsJson = await AsyncStorage.getItem(OFFLINE_STORAGE_KEY);
    const records: AttendanceRecord[] = existingRecordsJson ? JSON.parse(existingRecordsJson) : [];
    
    // Formamos el nuevo registro en la fila
    records.push(record);
    
    // Volvemos a sellar la bóveda
    await AsyncStorage.setItem(OFFLINE_STORAGE_KEY, JSON.stringify(records));
  } catch (error) {
    console.error('Error crítico guardando en bóveda offline:', error);
    throw new Error('No se pudo guardar el registro localmente.');
  }
};

/**
 * Lee todos los registros pendientes (Se usará en el Pilar 3).
 */
export const getOfflineRecords = async (): Promise<AttendanceRecord[]> => {
  try {
    const recordsJson = await AsyncStorage.getItem(OFFLINE_STORAGE_KEY);
    return recordsJson ? JSON.parse(recordsJson) : [];
  } catch (error) {
    return [];
  }
};

/**
 * Vacía la bóveda después de una sincronización exitosa.
 */
export const clearOfflineRecords = async () => {
  try {
    await AsyncStorage.removeItem(OFFLINE_STORAGE_KEY);
  } catch (error) {
    console.error('Error limpiando la bóveda:', error);
  }
};

/**
 * Sincroniza los registros pendientes con el servidor.
 * @returns El número de registros sincronizados exitosamente.
 */
export const syncOfflineRecords = async (): Promise<number> => {
  try {
    const records = await getOfflineRecords();
    
    if (records.length === 0) {
      return 0; // No hay nada que sincronizar
    }

    let syncedCount = 0;

    // Enviamos los registros uno por uno de forma secuencial para mantener el orden cronológico
    for (const record of records) {
      await client.post('/attendance', {
        timestamp: record.timestamp,
        tipoRegistro: record.tipoRegistro,
        coordenadas: record.coordenadas,
      });
      syncedCount++;
    }

    // Solo vaciamos la bóveda si el ciclo termina sin arrojar errores (códigos 400 o 500)
    await clearOfflineRecords();
    return syncedCount;
    
  } catch (error) {
    console.error('Interrupción durante la sincronización:', error);
    // Lanzamos el error para que la interfaz sepa que la sincronización falló o quedó a medias
    throw new Error('Fallo en la sincronización con el servidor.');
  }
};