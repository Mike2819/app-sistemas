import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Modal, StyleSheet, ActivityIndicator } from 'react-native';
import { verifySecurityPin } from '../../api/auth'; 

interface PinEntryModalProps {
  visible: boolean;
  onSuccess: () => void;
  onCancel: () => void;
}

const PinEntryModal: React.FC<PinEntryModalProps> = ({ visible, onSuccess, onCancel }) => {
  const [pin, setPin] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleVerifyPin = async () => {
    if (pin.length !== 4) return;
    
    setIsLoading(true);
    setError(null);

    try {
      await verifySecurityPin(pin);
      setPin(''); // Limpiamos por seguridad
      onSuccess(); // ¡El PIN es correcto! Ejecuta el check-in
    } catch (err: any) {
      setError(err.message || 'PIN incorrecto.');
      setPin(''); // Limpiamos para que lo vuelva a intentar
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setPin('');
    setError(null);
    onCancel();
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.title}>Verificación de Seguridad</Text>
          <Text style={styles.subtitle}>Ingresa tu PIN de 4 dígitos para registrar asistencia.</Text>

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
            placeholder="••••"
            placeholderTextColor="#999"
            autoFocus={true}
          />

          {error && <Text style={styles.errorText}>{error}</Text>}

          <View style={styles.buttonRow}>
            <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={handleClose} disabled={isLoading}>
              <Text style={styles.cancelButtonText}>Cancelar</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.button, styles.verifyButton, pin.length !== 4 && styles.buttonDisabled]} 
              onPress={handleVerifyPin}
              disabled={pin.length !== 4 || isLoading}
            >
              {isLoading ? <ActivityIndicator color="#fff" /> : <Text style={styles.verifyButtonText}>Verificar</Text>}
            </TouchableOpacity>
          </View>
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
  errorText: { color: '#dc3545', marginBottom: 10, fontSize: 14, fontWeight: 'bold' },
  buttonRow: { flexDirection: 'row', justifyContent: 'space-between', width: '100%', marginTop: 10, gap: 10 },
  button: { flex: 1, paddingVertical: 12, borderRadius: 8, alignItems: 'center' },
  cancelButton: { backgroundColor: '#F3F4F6' },
  cancelButtonText: { color: '#4B5563', fontWeight: 'bold', fontSize: 16 },
  verifyButton: { backgroundColor: '#4F46E5' },
  buttonDisabled: { backgroundColor: '#A5B4FC' },
  verifyButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});

export default PinEntryModal;