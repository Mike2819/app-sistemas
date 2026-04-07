import { useState, useEffect } from 'react';
import NetInfo from '@react-native-community/netinfo';

/**
 * Hook que monitorea el estado de la conexión a internet en tiempo real.
 * @returns { isConnected: boolean } true si hay internet, false si está offline.
 */
const useNetwork = () => {
  // Asumimos que hay conexión por defecto para no bloquear la UI prematuramente
  const [isConnected, setIsConnected] = useState<boolean>(true);

  useEffect(() => {
    // Nos suscribimos a los cambios de red del dispositivo
    const unsubscribe = NetInfo.addEventListener(state => {
      // state.isConnected puede ser null en raras transiciones de red. 
      // El operador ?? asegura que siempre devolvamos un booleano estricto.
      setIsConnected(state.isConnected ?? true);
    });

    // Limpieza del listener cuando el componente se desmonta
    return () => {
      unsubscribe();
    };
  }, []);

  return { isConnected };
};

export default useNetwork;