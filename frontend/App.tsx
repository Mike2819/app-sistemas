import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from './src/context/AuthContext';
import AppNavigator from './src/navigation/AppNavigator';

const App = (): React.JSX.Element => {
  return (
    // Safe Areas (para notches y barras)
    <SafeAreaProvider>
      {/* Auth (El estado global) */}
      <AuthProvider>
        {/* Navigator */}
        <AppNavigator />
      </AuthProvider>
    </SafeAreaProvider>
  );
};

export default App;