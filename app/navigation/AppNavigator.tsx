/**
 * AppNavigator
 * -------------------------
 * Define las rutas (Stack) de la app y sus parámetros.
 * Soporta flujo para atletas y entrenadores (con `atletaId` opcional).
 */

import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { ActivityIndicator, View } from 'react-native';

import { useAuth } from '../contexts/AuthContext';
import { User } from '../models/User';

// Vistas
import AgendaScreen from '../views/AgendaScreen';
import CalendarioMensualScreen from '../views/CalendarioMensualScreen';
import ChatScreen from '../views/ChatScreen';
import ConversacionScreen from '../views/ConversacionScreen';
import EditProfileScreen from '../views/EditProfileScreen';
import EjercicioGestionScreen from '../views/EjercicioGestionScreen';
import EjercicioScreen from '../views/EjercicioScreen';
import EntrenamientoScreen from '../views/EntrenamientoScreen';
import HomeScreen from '../views/HomeScreen';
import LoginScreen from '../views/LoginScreen';
import MetricsScreen from '../views/MetricsScreen';
import RegisterScreen from '../views/RegisterScreen';
import RutinaDetalleScreen from '../views/RutinaDetalleScreen';
import RutinaGestionScreen from '../views/RutinaGestionScreen';
import RutinasScreen from '../views/RutinaScreen';
import SeleccionarUsuarioChatScreen from '../views/SeleccionarUsuarioChatScreen';

/**
 * Tipado de rutas y parámetros del Stack
 * - `atletaId?`: opcional para flujo de entrenador
 * - `fechaPreSeleccionada?`: fecha YYYY-MM-DD
 */
export type RootStackParamList = {
  // Acceso
  Login: undefined;
  SignUp: undefined;

  // Home y perfil
  Home: undefined;
  EditProfile: undefined;

  // Listado de rutinas (asignar/usar)
  Rutinas:
    | undefined
    | {
        fechaPreSeleccionada?: string;
        atletaId?: number;
      };

  // Detalle de rutina
  RutinaDetalle: {
    rutinaId: number;
    rutinaNombre: string;
    fechaPreSeleccionada?: string;
    atletaId?: number;
  };

  // Ejercicio dentro de una rutina
  Ejercicio: {
    rutinaId: number;
    ejercicioId: number;
    seriesObjetivo: number;
    repObjetivo: number;
    descanso: string;
  };

  //gestión de ejercicios
  EjercicioGestion: undefined;
  
  // Mensajería
  Chats: undefined;
  Conversacion: { usuario: User };
  SeleccionarUsuarioChatScreen: undefined;

  // Agenda semanal
  AgendaScreen:
    | undefined
    | {
        fechaPreSeleccionada?: string;
        atletaId?: number;
        atletaNombre?: string;
      };

  // Calendario mensual
  CalendarioMensual:
    | undefined
    | {
        atletaId?: number;
      };

  // Gestión de rutinas (solo entrenadores; la pantalla valida el rol)
  RutinaGestion: undefined;

  // Entrenamiento en curso (solo atleta)
  Entrenamiento: { rutinaId: number };

  // Métricas / estadísticas
  Metrics: { ejercicio_id?: number };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  const { user, initializing } = useAuth();

  // Cargando usuario desde SecureStorage
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
        <>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="SignUp" component={RegisterScreen} />
        </>
      ) : (
        <>
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="EditProfile" component={EditProfileScreen} />

          {/* Rutinas */}
          <Stack.Screen name="Rutinas" component={RutinasScreen} />
          <Stack.Screen name="RutinaDetalle" component={RutinaDetalleScreen} />
          <Stack.Screen name="Ejercicio" component={EjercicioScreen} />
          <Stack.Screen name="Entrenamiento" component={EntrenamientoScreen} />

          {/* Agenda y Calendario */}
          <Stack.Screen name="AgendaScreen" component={AgendaScreen} />
          <Stack.Screen name="CalendarioMensual" component={CalendarioMensualScreen} />

          {/* Gestión de rutinas (entrenadores) */}
          <Stack.Screen name="RutinaGestion" component={RutinaGestionScreen} />

          {/* Gestión deejercicios (entrenadores) */}
          <Stack.Screen name="EjercicioGestion" component={EjercicioGestionScreen} />

          {/* Chat */}
          <Stack.Screen name="Chats" component={ChatScreen} />
          <Stack.Screen name="Conversacion" component={ConversacionScreen} />
          <Stack.Screen
            name="SeleccionarUsuarioChatScreen"
            component={SeleccionarUsuarioChatScreen}
          />

          {/* Métricas */}
          <Stack.Screen name="Metrics" component={MetricsScreen} />
        </>
      )}
    </Stack.Navigator>
  );
}
