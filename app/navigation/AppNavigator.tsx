import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import EditProfileScreen from '../views/EditProfileScreen';
import EjercicioScreen from '../views/EjercicioScreen';
import HomeScreen from '../views/HomeScreen';
import LoginScreen from '../views/LoginScreen';
import RegisterScreen from '../views/RegisterScreen';
import RutinaDetalleScreen from '../views/RutinaDetalleScreen';
import RutinasScreen from '../views/RutinaScreen';

export type RootStackParamList = {
  Login: undefined;
  Home: undefined;
  SignUp: undefined;
  EditProfile: undefined;
  Rutinas: undefined;
  RutinaDetalle: { 
    rutinaId: number; 
    rutinaNombre: string 
  };
  Ejercicio: {
    rutinaId: number;
    ejercicioId: number;
    seriesObjetivo: number;
    repObjetivo: number;
    descanso: string;
  };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  const { user, loading, initializing } = useAuth(); // ← añadimos `initializing`

  // Inicializar los datos
  if (initializing) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!user ? (
        //si el usuario NO esta loggeado solo puedo usar estas vistas
        <>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="SignUp" component={RegisterScreen} />
        </>
      ) : (
        //si el usuario esta loggeado
        <>
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="EditProfile" component={EditProfileScreen} />
          <Stack.Screen name="Rutinas" component={RutinasScreen} />
          <Stack.Screen name="RutinaDetalle" component={RutinaDetalleScreen} />
          <Stack.Screen name="Ejercicio" component={EjercicioScreen} />
        </>
      )}
    </Stack.Navigator>
  );
}
