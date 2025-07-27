import { NavigationContainer } from '@react-navigation/native';
import React from 'react';
import { AuthProvider } from './app/contexts/AuthContext';
import AppNavigator from './app/navigation/AppNavigator';

export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
    </AuthProvider>
  );
}
