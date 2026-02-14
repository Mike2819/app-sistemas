import React, { createContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import client from '../api/client';
import { ENDPOINTS, STORAGE_KEYS } from '../utils/constants';
import { AuthResponse, LoginPayload, User } from '../types/auth.types';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (data: LoginPayload) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // EFECTO DE INICIO: Cargar sesión
  useEffect(() => {
    const loadStorageData = async () => {
      try {
        const storedToken = await AsyncStorage.getItem(STORAGE_KEYS.TOKEN);
        const storedUser = await AsyncStorage.getItem(STORAGE_KEYS.USER_DATA);

        if (storedToken && storedUser) {
          setToken(storedToken);
          setUser(JSON.parse(storedUser));
        }
      } catch (e) {
        console.error('Error cargando sesión:', e);
      } finally {
        setIsLoading(false);
      }
    };
    loadStorageData();
  }, []);

  // LOGIN
  const login = async (data: LoginPayload) => {
    setIsLoading(true);
    try {
      const response = await client.post<AuthResponse>(ENDPOINTS.LOGIN, data);
      
      if (response.data.success) {
        // Desestructuramos desde "data" 
        const { token: newToken, ...userData } = response.data.data;

        // Verificación 
        if (newToken && userData) {
            setToken(newToken);
            setUser(userData); 
            
            // Persistencia
            await AsyncStorage.setItem(STORAGE_KEYS.TOKEN, newToken);
            await AsyncStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(userData));
        }
      } else {
        throw new Error(response.data.message || 'Error en inicio de sesión');
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Error de conexión';
      console.error('Login error:', errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // REGISTER
  const register = async (data: any) => {
    setIsLoading(true);
    try {
      const response = await client.post<AuthResponse>(ENDPOINTS.REGISTER, data);
      
      if (response.data.success) {
         console.log('Registro exitoso, redirigiendo a login...');
      }
    } catch (error: any) {
      console.error('Register error:', error.response?.data || error.message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // LOGOUT
  const logout = async () => {
    setIsLoading(true);
    try {
      await AsyncStorage.multiRemove([STORAGE_KEYS.TOKEN, STORAGE_KEYS.USER_DATA]);
      
      // Limpiamos el estado después de borrar el storage
      setToken(null);
      setUser(null);
    } catch (e) {
      console.error('Logout error:', e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};