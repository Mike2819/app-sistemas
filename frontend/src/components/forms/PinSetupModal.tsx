import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Modal, StyleSheet, ActivityIndicator } from 'react-native';
import { setupSecurityPin } from '../../api/auth'; 

interface PinSetupModalProps {
  visible: boolean;
  onSuccess: () => void;
}

const PinSetupModal: React.FC<PinSetupModalProps> = ({ visible, onSuccess }) => {
  const [pin, setPin] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSavePin = async () => {
    if (pin.length !== 4) {
      setError('El PIN debe ser exactamente de 4 dígitos.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await setupSecurityPin(pin);
      onSuccess(); // Cierra el modal 
    } catch (err: any) {
      setError(err.message || 'Error al guardar el PIN.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.title}>Configurar PIN de Seguridad</Text>
          <Text style={styles.subtitle}>
            Tu dispositivo no soporta biometría. Por seguridad de la universidad, crea un PIN de 4 dígitos para registrar tu asistencia.
          </Text>

          <TextInput
            style={styles.input}
            keyboardType="numeric"
            maxLength={4}
            secureTextEntry 
            value={pin}
            onChangeText={(text) => {
              const numericText = text.replace(/[^0-9]/g, '');
              setPin(numericText);
              setError(null);
            }}
            placeholder="1234"
            placeholderTextColor="#999"
          />

          {error && <Text style={styles.errorText}>{error}</Text>}

          <TouchableOpacity 
            style={[styles.button, pin.length !== 4 && styles.buttonDisabled]} 
            onPress={handleSavePin}
            disabled={pin.length !== 4 || isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Guardar PIN</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center', padding: 20 },
  modalContainer: { backgroundColor: '#fff', padding: 24, borderRadius: 12, width: '100%', alignItems: 'center' },
  title: { fontSize: 20, fontWeight: 'bold', color: '#333', marginBottom: 8 },
  subtitle: { fontSize: 14, color: '#666', textAlign: 'center', marginBottom: 20 },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, fontSize: 24, padding: 12, width: '60%', textAlign: 'center', letterSpacing: 8, color: '#333', marginBottom: 10 },
  errorText: { color: '#dc3545', marginBottom: 10, fontSize: 14 },
  button: { backgroundColor: '#4F46E5', paddingVertical: 12, paddingHorizontal: 24, borderRadius: 8, width: '100%', alignItems: 'center' },
  buttonDisabled: { backgroundColor: '#A5B4FC' },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});

export default PinSetupModal;