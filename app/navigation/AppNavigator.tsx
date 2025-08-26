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
import EjercicioScreen from '../views/EjercicioScreen';
import EntrenamientoScreen from '../views/EntrenamientoScreen';
import HomeScreen from '../views/HomeScreen';
import LoginScreen from '../views/LoginScreen';
import MetricsScreen from '../views/MetricsScreen';
import RegisterScreen from '../views/RegisterScreen';
import RutinaDetalleScreen from '../views/RutinaDetalleScreen';
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

  /**
   * Listado de rutinas disponibles para asignar/usar.
   * - Atleta: sin params
   * - Entrenador: puede pasar `atletaId` y `fechaPreSeleccionada`
   */
  Rutinas:
    | undefined
    | {
        fechaPreSeleccionada?: string;
        atletaId?: number;
      };

  /**
   * Detalle de una rutina específica.
   * - `atletaId?` mantiene el contexto si viene desde entrenador
   */
  RutinaDetalle: {
    rutinaId: number;
    rutinaNombre: string;
    fechaPreSeleccionada?: string;
    atletaId?: number;
  };

  /**
   * Pantalla de un ejercicio dentro de una rutina.
   */
  Ejercicio: {
    rutinaId: number;
    ejercicioId: number;
    seriesObjetivo: number;
    repObjetivo: number;
    descanso: string;
  };

  // Mensajería
  Chats: undefined;
  Conversacion: { usuario: User };
  SeleccionarUsuarioChatScreen: undefined;

  /**
   * Agenda semanal:
   * - Atleta: sin params
   * - Entrenador: puede pasar `atletaId` y `atletaNombre`
   */
  AgendaScreen:
    | undefined
    | {
        fechaPreSeleccionada?: string;
        atletaId?: number;
        atletaNombre?: string;
      };

  /**
   * Calendario mensual:
   * - Puede recibir `atletaId` para ver el mes de un atleta específico
   */
  CalendarioMensual:
    | undefined
    | {
        atletaId?: number;
      };

  /**
   * Entrenamiento en curso (solo atleta)
   */
  Entrenamiento: { rutinaId: number };

  /**
   * Métricas / estadísticas
   */
  Metrics: { ejercicio_id?: number };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  // Estado de autenticación y carga inicial
  const { user, initializing } = useAuth();

  // Mientras carga usuario desde SecureStorage
  if (initializing) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <Stack.Navigator
      // Oculta el header por defecto (cada pantalla puede mostrarlo si lo necesita)
      screenOptions={{ headerShown: false }}
    >
      {!user ? (
        // 👉 Usuario NO autenticado: solo Login/Registro
        <>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="SignUp" component={RegisterScreen} />
        </>
      ) : (
        // 👉 Usuario autenticado: resto de pantallas
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
