import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, StatusBar } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import useAuth from '../../hooks/useAuth';

const HomeScreen = () => {
  const { user, logout } = useAuth();

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F5F7FA" />
      
      {/* HEADER */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Hola,</Text>
          <Text style={styles.userName}>{user?.nombres || 'Estudiante'} 👋</Text>
        </View>
        <View style={styles.avatarContainer}>
            {/* Usamos la inicial del nombre como avatar temporal */}
          <Text style={styles.avatarText}>{user?.nombres?.charAt(0) || 'U'}</Text>
        </View>
      </View>

      {/* CARD DE INFORMACIÓN */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
            <Icon name="id-card-outline" size={24} color="#4F46E5" />
            <Text style={styles.cardTitle}>Credencial Digital</Text>
        </View>
        
        <View style={styles.infoRow}>
            <Text style={styles.label}>Email:</Text>
            <Text style={styles.value}>{user?.email}</Text>
        </View>
        
        <View style={styles.infoRow}>
            <Text style={styles.label}>Rol:</Text>
            <View style={styles.badge}>
                <Text style={styles.badgeText}>{user?.rol?.toUpperCase() || 'ESTUDIANTE'}</Text>
            </View>
        </View>
         
         <View style={styles.infoRow}>
            <Text style={styles.label}>ID:</Text>
            <Text style={styles.valueID} numberOfLines={1} ellipsizeMode='tail'>
                {user?._id || 'No ID'}
            </Text>
        </View>
      </View>

      {/* ACCIONES */}
      <View style={styles.actionsContainer}>
        <Text style={styles.sectionTitle}>Acciones Rápidas</Text>
        
        <View style={styles.grid}>
            {/* Botones dummy para decorar por ahora */}
            <TouchableOpacity style={styles.actionButton}>
                <Icon name="calendar-outline" size={28} color="#4F46E5" />
                <Text style={styles.actionText}>Horario</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.actionButton}>
                <Icon name="school-outline" size={28} color="#4F46E5" />
                <Text style={styles.actionText}>Notas</Text>
            </TouchableOpacity>
        </View>
      </View>

      {/* BOTÓN DE LOGOUT */}
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
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
    padding: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 32,
    marginTop: 10,
  },
  greeting: {
    fontSize: 16,
    color: '#6B7280',
  },
  userName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1F2937',
  },
  avatarContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#E0E7FF', // Indigo muy claro
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4F46E5',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
    marginBottom: 32,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    paddingBottom: 12,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginLeft: 8,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  label: {
    fontSize: 14,
    color: '#6B7280',
  },
  value: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
  },
  valueID: {
    fontSize: 12,
    color: '#9CA3AF',
    fontFamily: 'monospace',
    maxWidth: 150,
  },
  badge: {
    backgroundColor: '#DEF7EC',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  badgeText: {
    color: '#03543F',
    fontSize: 12,
    fontWeight: 'bold',
  },
  actionsContainer: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 16,
  },
  grid: {
    flexDirection: 'row',
    gap: 16,
  },
  actionButton: {
    backgroundColor: 'white',
    width: 100,
    height: 100,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    elevation: 2,
  },
  actionText: {
    marginTop: 8,
    fontSize: 14,
    color: '#4B5563',
    fontWeight: '500',
  },
  footer: {
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
  },
  logoutText: {
    color: '#EF4444', // Rojo alerta
    fontSize: 16,
    fontWeight: '500',
  },
});

export default HomeScreen;