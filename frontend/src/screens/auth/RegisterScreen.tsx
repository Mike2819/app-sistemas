import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import useAuth from '../../hooks/useAuth';

// Esquema de Validación
const registerSchema = z.object({
  nombres: z.string().min(2, "Nombre requerido (mínimo 2 letras)"),
  apellidos: z.string().min(2, "Apellido requerido"),
  email: z.string().email("Email inválido"),
  telefono: z.string().min(10, "Teléfono debe tener 10 dígitos").regex(/^\d+$/, "Solo números"),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
});

type RegisterForm = z.infer<typeof registerSchema>;

const RegisterScreen = () => {
  const navigation = useNavigation<any>();
  const { register, isLoading } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const { control, handleSubmit, formState: { errors } } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterForm) => {
    setFormError(null);
    try {
      // Intenta registrar
      await register({ ...data, rol: 'estudiante' });
      
      // Entra con credenciales porque no regresa token
      navigation.navigate('Login');
      
    } catch (error: any) {
      setFormError(error.response?.data?.message || 'Error al registrarse');
    }
  };

  // Componente auxiliar para Inputs repetitivos (CORREGIDO)
  const renderInput = (name: keyof RegisterForm, icon: string, placeholder: string, isPassword = false, keyboard: 'default' | 'email-address' | 'phone-pad' = 'default') => (
    <View style={styles.inputGroup}>
      <Text style={styles.label}>{name.charAt(0).toUpperCase() + name.slice(1)}</Text>
      <Controller
        control={control}
        name={name}
        render={({ field: { onChange, onBlur, value } }) => (
          <View style={[styles.inputContainer, errors[name] && styles.inputErrorBorder]}>
            <Icon name={icon} size={20} color="#9CA3AF" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder={placeholder}
              placeholderTextColor="#9CA3AF"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              
              // ✅ LÓGICA DE SEGURIDAD
              secureTextEntry={isPassword && !showPassword} 
              
              // ✅ CORRECCIÓN: Desactivamos mayúsculas y corrección en passwords
              autoCapitalize={(name === 'email' || isPassword) ? 'none' : 'words'}
              autoCorrect={!isPassword} 
              
              keyboardType={keyboard}
            />
            {isPassword && (
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Icon name={showPassword ? "eye-off-outline" : "eye-outline"} size={20} color="#9CA3AF" />
              </TouchableOpacity>
            )}
          </View>
        )}
      />
      {errors[name] && <Text style={styles.fieldError}>{errors[name]?.message}</Text>}
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#F5F7FA" />
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
          
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Icon name="arrow-back" size={24} color="#1F2937" />
          </TouchableOpacity>

          <View style={styles.header}>
            <Text style={styles.title}>Crear Cuenta</Text>
            <Text style={styles.subtitle}>Únete a la comunidad universitaria</Text>
          </View>

          {formError && (
            <View style={styles.errorContainer}>
              <Icon name="alert-circle-outline" size={20} color="#EF4444" />
              <Text style={styles.errorText}>{formError}</Text>
            </View>
          )}

          {renderInput('nombres', 'person-outline', 'Juan')}
          {renderInput('apellidos', 'person-outline', 'Pérez')}
          {renderInput('email', 'mail-outline', 'juan@ejemplo.com', false, 'email-address')}
          {renderInput('telefono', 'call-outline', '4491234567', false, 'phone-pad')}
          {renderInput('password', 'lock-closed-outline', '••••••••', true)}

          <TouchableOpacity
            style={[styles.button, isLoading && styles.buttonDisabled]}
            onPress={handleSubmit(onSubmit)}
            disabled={isLoading}
          >
            {isLoading ? <ActivityIndicator color="white" /> : <Text style={styles.buttonText}>Registrarse</Text>}
          </TouchableOpacity>

          <View style={styles.footer}>
            <Text style={styles.footerText}>¿Ya tienes cuenta? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={styles.link}>Inicia Sesión</Text>
            </TouchableOpacity>
          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F5F7FA' },
  scrollContainer: { padding: 24, paddingBottom: 50 },
  backButton: { marginBottom: 20 },
  header: { marginBottom: 32 },
  title: { fontSize: 28, fontWeight: '700', color: '#1F2937', marginBottom: 8 },
  subtitle: { fontSize: 16, color: '#6B7280' },
  inputGroup: { marginBottom: 16 },
  label: { fontSize: 14, fontWeight: '600', color: '#374151', marginBottom: 6 },
  inputContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 12, paddingHorizontal: 12, height: 50 },
  inputErrorBorder: { borderColor: '#EF4444' },
  inputIcon: { marginRight: 10 },
  input: { flex: 1, color: '#1F2937', fontSize: 16 },
  fieldError: { color: '#EF4444', fontSize: 12, marginTop: 4 },
  errorContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FEE2E2', padding: 12, borderRadius: 8, marginBottom: 20 },
  errorText: { color: '#B91C1C', marginLeft: 8, fontSize: 14 },
  button: { backgroundColor: '#4F46E5', borderRadius: 12, height: 50, justifyContent: 'center', alignItems: 'center', marginTop: 20, shadowColor: '#4F46E5', elevation: 4 },
  buttonDisabled: { backgroundColor: '#A5A3E0' },
  buttonText: { color: 'white', fontSize: 16, fontWeight: '600' },
  footer: { flexDirection: 'row', justifyContent: 'center', marginTop: 32 },
  footerText: { color: '#6B7280', fontSize: 14 },
  link: { color: '#4F46E5', fontWeight: '600', fontSize: 14 },
});

export default RegisterScreen;