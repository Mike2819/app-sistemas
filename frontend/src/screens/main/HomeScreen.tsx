import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, StatusBar, PermissionsAndroid, Platform, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import useAuth from '../../hooks/useAuth';
import Geolocation from 'react-native-geolocation-service';
import { isLocationInsideCampus, CAMPUS_POLYGON } from '../../utils/geofence';
import client from '../../api/client';

const HomeScreen = () => {
  const { user, logout } = useAuth();
  
  // Estados del GPS
  const [location, setLocation] = useState<{lat: number, lng: number} | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isInsideCampus, setIsInsideCampus] = useState<boolean | null>(null);

  // Función para pedir permiso
  const requestLocationPermission = async () => {
    if (Platform.OS === 'ios') {
      const auth = await Geolocation.requestAuthorization('whenInUse');
      return auth === 'granted';
    }

    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Permiso de Ubicación',
          message: 'Necesitamos tu ubicación para validar que estás en el campus.',
          buttonNeutral: 'Preguntar luego',
          buttonNegative: 'Cancelar',
          buttonPositive: 'OK',
        },
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    }
    return false;
  };

  // Función de Checado 
  const handleCheckIn = async (tipoRegistro: 'ENTRADA' | 'SALIDA') => {
    setIsLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    const hasPermission = await requestLocationPermission();

    if (!hasPermission) {
      setErrorMsg('Permiso de ubicación denegado.');
      setIsLoading(false);
      return;
    }

    Geolocation.getCurrentPosition(
      async (position) => {
        try {
          const currentCoord = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          
          setLocation(currentCoord);
          
          // Evaluamos si la coordenada actual está dentro del polígono
          const inside = isLocationInsideCampus(currentCoord, CAMPUS_POLYGON);
          setIsInsideCampus(inside);
          
          if (position.mocked) {
            setErrorMsg('¡Alerta! Ubicación falsa detectada.');
            setIsLoading(false);
            return;
          }

          if (!inside) {
            setErrorMsg('Debes estar dentro del campus (UPA) para registrar asistencia.');
            setIsLoading(false);
            return;
          }

          // Realizamos la petición al backend
          const timestamp = new Date().toISOString();
          await client.post('/attendance', {
            timestamp,
            tipoRegistro,
            coordenadas: currentCoord,
          });

          // Formateamos la hora local para el mensaje de éxito
          const date = new Date();
          const hours = date.getHours().toString().padStart(2, '0');
          const minutes = date.getMinutes().toString().padStart(2, '0');
          
          setSuccessMsg(`Registro de ${tipoRegistro.toLowerCase()} exitoso a las ${hours}:${minutes}`);
        } catch (err: any) {
          setErrorMsg(err.response?.data?.message || 'Error al conectar con el servidor.');
        } finally {
          setIsLoading(false);
        }
      },
      (error) => {
        setErrorMsg(`Error del GPS: ${error.message}`);
        setIsLoading(false);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F5F7FA" />
      
      {/* HEADER */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Hola,</Text>
          <Text style={styles.userName}>{user?.nombres || 'Docente'} 👋</Text>
        </View>
        <View style={styles.avatarContainer}>
          <Text style={styles.avatarText}>{user?.nombres?.charAt(0) || 'U'}</Text>
        </View>
      </View>

      {/* CARD DE INFORMACIÓN */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
            <Icon name="id-card-outline" size={24} color="#4F46E5" />
            <Text style={styles.cardTitle}>Credencial Digital UPA</Text>
        </View>
        <View style={styles.infoRow}>
            <Text style={styles.label}>Email:</Text>
            <Text style={styles.value}>{user?.email}</Text>
        </View>
        <View style={styles.infoRow}>
            <Text style={styles.label}>Rol:</Text>
            <View style={styles.badge}>
                <Text style={styles.badgeText}>{user?.rol?.toUpperCase() || 'DOCENTE'}</Text>
            </View>
        </View>
      </View>

      {/* MOTOR DE ASISTENCIA */}
      <View style={styles.actionsContainer}>
        <Text style={styles.sectionTitle}>Registro de Asistencia</Text>
        
        <View style={styles.buttonsRow}>
          <TouchableOpacity 
            style={[styles.checkButton, styles.checkInButton, isLoading && styles.disabledButton]} 
            onPress={() => handleCheckIn('ENTRADA')}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <>
                <Icon name="log-in-outline" size={24} color="#fff" />
                <Text style={styles.checkButtonText}>ENTRADA</Text>
              </>
            )}
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.checkButton, styles.checkOutButton, isLoading && styles.disabledButton]} 
            onPress={() => handleCheckIn('SALIDA')}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <>
                <Icon name="log-out-outline" size={24} color="#fff" />
                <Text style={styles.checkButtonText}>SALIDA</Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        {/* Feedback del Sistema (Unificado) */}
        {errorMsg ? (
          <View style={styles.errorBox}>
            <Icon name="alert-circle-outline" size={20} color="#EF4444" />
            <Text style={styles.errorText}>{errorMsg}</Text>
          </View>
        ) : successMsg ? (
          <View style={styles.successMessage}>
            <Icon name="checkmark-circle-outline" size={20} color="#059669" />
            <Text style={styles.successMessageText}>{successMsg}</Text>
          </View>
        ) : location ? (
          <View style={[styles.successBox, { backgroundColor: isInsideCampus ? '#D1FAE5' : '#FEF3C7' }]}>
            <Icon name={isInsideCampus ? "checkmark-circle-outline" : "warning-outline"} size={20} color={isInsideCampus ? "#065F46" : "#92400E"} />
            <View style={{ marginLeft: 8 }}>
              <Text style={{ color: isInsideCampus ? '#065F46' : '#92400E', fontWeight: 'bold', fontSize: 16 }}>
                {isInsideCampus ? 'Estás dentro de la UPA' : 'Estás fuera de la UPA'}
              </Text>
              <Text style={[styles.coordText, { color: isInsideCampus ? '#047857' : '#92400E' }]}>
                Lat: {location.lat.toFixed(6)}
              </Text>
              <Text style={[styles.coordText, { color: isInsideCampus ? '#047857' : '#92400E' }]}>
                Lng: {location.lng.toFixed(6)}
              </Text>
            </View>
          </View>
        ) : null}
      </View>

      {/* BOTÓN DE LOGOUT*/}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.logoutButton} onPress={logout}>
            <Icon name="log-out-outline" size={20} color="#EF4444" style={{ marginRight: 8 }} />
            <Text style={styles.logoutText}>Cerrar Sesión</Text>
        </TouchableOpacity>
      </View>

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F7FA', padding: 24 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32, marginTop: 10 },
  greeting: { fontSize: 16, color: '#6B7280' },
  userName: { fontSize: 24, fontWeight: '700', color: '#1F2937' },
  avatarContainer: { width: 50, height: 50, borderRadius: 25, backgroundColor: '#E0E7FF', justifyContent: 'center', alignItems: 'center' },
  avatarText: { fontSize: 20, fontWeight: 'bold', color: '#4F46E5' },
  card: { backgroundColor: 'white', borderRadius: 16, padding: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 10, elevation: 2, marginBottom: 32 },
  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 16, borderBottomWidth: 1, borderBottomColor: '#F3F4F6', paddingBottom: 12 },
  cardTitle: { fontSize: 16, fontWeight: '600', color: '#1F2937', marginLeft: 8 },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  label: { fontSize: 14, color: '#6B7280' },
  value: { fontSize: 14, fontWeight: '500', color: '#374151' },
  badge: { backgroundColor: '#DEF7EC', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6 },
  badgeText: { color: '#03543F', fontSize: 12, fontWeight: 'bold' },
  actionsContainer: { flex: 1, alignItems: 'center' },
  sectionTitle: { fontSize: 18, fontWeight: '600', color: '#1F2937', marginBottom: 16, alignSelf: 'flex-start' },
  buttonsRow: { flexDirection: 'row', justifyContent: 'space-between', width: '100%', gap: 12 },
  checkButton: { flex: 1, padding: 16, borderRadius: 16, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', shadowOpacity: 0.3, shadowRadius: 8, elevation: 4 },
  checkInButton: { backgroundColor: '#4F46E5', shadowColor: '#4F46E5', marginRight: 6 },
  checkOutButton: { backgroundColor: '#F59E0B', shadowColor: '#F59E0B', marginLeft: 6 },
  disabledButton: { backgroundColor: '#9CA3AF', shadowColor: '#9CA3AF' },
  checkButtonText: { color: 'white', fontSize: 16, fontWeight: '600', marginLeft: 8 },
  errorBox: { flexDirection: 'row', backgroundColor: '#FEE2E2', padding: 12, borderRadius: 8, width: '100%', marginTop: 20, alignItems: 'center' },
  errorText: { color: '#B91C1C', marginLeft: 8, fontWeight: '500', flexShrink: 1 },
  successMessage: { flexDirection: 'row', backgroundColor: '#D1FAE5', padding: 16, borderRadius: 12, width: '100%', marginTop: 20, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#34D399' },
  successMessageText: { color: '#065F46', fontWeight: 'bold', fontSize: 16, marginLeft: 8 },
  successBox: { flexDirection: 'row', backgroundColor: '#D1FAE5', padding: 16, borderRadius: 12, width: '100%', marginTop: 20, alignItems: 'center' },
  successText: { color: '#065F46', fontWeight: 'bold', fontSize: 16 },
  coordText: { color: '#047857', fontSize: 14, fontFamily: 'monospace', marginTop: 4 },
  footer: { justifyContent: 'flex-end', alignItems: 'center', marginTop: 20 },
  logoutButton: { flexDirection: 'row', alignItems: 'center', padding: 12 },
  logoutText: { color: '#EF4444', fontSize: 16, fontWeight: '500' },
});

export default HomeScreen;