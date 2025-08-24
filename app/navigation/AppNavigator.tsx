import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { User } from '../models/User';
import AgendaScreen from '../views/AgendaScreen';
import CalendarioMensualScreen from '../views/CalendarioMensualScreen';
import ChatScreen from '../views/ChatScreen';
import ConversacionScreen from '../views/ConversacionScreen';
import EditProfileScreen from '../views/EditProfileScreen';
import EjercicioScreen from '../views/EjercicioScreen';
import EntrenamientoScreen from '../views/EntrenamientoScreen';
import HomeScreen from '../views/HomeScreen';
import LoginScreen from '../views/LoginScreen';
import MetricsScreen from '../views/MetricsScreen';
import RegisterScreen from '../views/RegisterScreen';
import RutinaDetalleScreen from '../views/RutinaDetalleScreen';
import RutinasScreen from '../views/RutinaScreen';
import SeleccionarUsuarioChatScreen from '../views/SeleccionarUsuarioChatScreen';

export type RootStackParamList = {
  Login: undefined;
  Home: undefined;
  SignUp: undefined;
  EditProfile: undefined;
  Rutinas: undefined | { fechaPreSeleccionada?: string };
  RutinaDetalle: { 
    rutinaId: number; 
    rutinaNombre: string;
    fechaPreSeleccionada?: string;
  };
  Ejercicio: {
    rutinaId: number;
    ejercicioId: number;
    seriesObjetivo: number;
    repObjetivo: number;
    descanso: string;
  };
  Chats: undefined;
  Conversacion: { usuario: User };
  SeleccionarUsuarioChatScreen: undefined;
  AgendaScreen: { fechaPreSeleccionada?: string };
  CalendarioMensual: undefined;
  Entrenamiento: { rutinaId: number };
  Metrics: { ejercicio_id?: number };

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
          <Stack.Screen name="Chats" component={ChatScreen} />
          <Stack.Screen name="Conversacion" component={ConversacionScreen} />
          <Stack.Screen name="SeleccionarUsuarioChatScreen" component={SeleccionarUsuarioChatScreen} />
          <Stack.Screen name="AgendaScreen" component={AgendaScreen} />
          <Stack.Screen name="CalendarioMensual" component={CalendarioMensualScreen} />
          <Stack.Screen name="Entrenamiento" component={EntrenamientoScreen} />
          <Stack.Screen name="Metrics" component={MetricsScreen} />
        </>
      )}
    </Stack.Navigator>
  );
}
