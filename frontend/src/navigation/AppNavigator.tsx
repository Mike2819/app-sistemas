import React, { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ActivityIndicator, View } from 'react-native';

import { AuthContext } from '../context/AuthContext';
import LoginScreen from '../screens/auth/LoginScreen'; 
import RegisterScreen from '../screens/auth/RegisterScreen';
import HomeScreen from '../screens/main/HomeScreen';

const Stack = createNativeStackNavigator();

// Pantalla temporal de carga
const LoadingScreen = () => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <ActivityIndicator size="large" color="#0000ff" />
  </View>
);

const AppNavigator = () => {
  const { isLoading, token } = useContext(AuthContext);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {token ? (
          // Usuariro Logeado
          <Stack.Group>
            <Stack.Screen name="Home" component={HomeScreen} />
          </Stack.Group>
        ) : (
          // Usuario No Logeado
          <Stack.Group>
             <Stack.Screen name="Login" component={LoginScreen} />
             <Stack.Screen name="Register" component={RegisterScreen} />
          </Stack.Group>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;