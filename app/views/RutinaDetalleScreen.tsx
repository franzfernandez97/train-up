import { Ionicons } from '@expo/vector-icons';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import RoleBasedLayout from '../components/RoleBasedLayout';
import { useAuth } from '../contexts/AuthContext';
import { RutinaEjercicio } from '../models/RutinaEjercicio';
import { RootStackParamList } from '../navigation/AppNavigator';
import { showAlert } from '../utils/AlertService';
import useRutinaDetalleViewModel from '../viewmodels/useRutinaDetalle';
import { styles } from './styles/RutinaDetalleScreen.style';

type RutinaDetalleRouteProp = RouteProp<RootStackParamList, 'RutinaDetalle'>;

export default function RutinaDetalleScreen() {
  const route = useRoute<RutinaDetalleRouteProp>();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const { rutinaId, rutinaNombre, fechaPreSeleccionada, atletaId } = route.params;
  const { user } = useAuth();
  const isEntrenador = user?.role?.toLowerCase?.() === 'entrenador';

  // Llama al hook una sola vez y desestructura todo
  const { rutinaEjercicios, loading, error, iniciarEntrenamiento } =
    useRutinaDetalleViewModel(rutinaId);

  const [expanded, setExpanded] = useState<number | null>(null);

  const renderItem = ({ item }: { item: RutinaEjercicio }) => (
    <View style={styles.card}>
      {/* Columna 1: Logo */}
      <TouchableOpacity
        style={styles.leftIconContainer}
        activeOpacity={0.8}
        onPress={() =>
          navigation.navigate('Ejercicio', {
            rutinaId,
            ejercicioId: item.ejercicio?.id,
            seriesObjetivo: item.seriesObjetivo,
            repObjetivo: item.repObjetivo,
            descanso: item.descanso,
          })
        }
      >
        <Image source={require('../assets/images/logo.png')} style={styles.leftIcon} />
      </TouchableOpacity>

      {/* Columna 2: Nombre + datos */}
      <TouchableOpacity
        style={styles.cardContent}
        activeOpacity={0.8}
        onPress={() =>
          navigation.navigate('Ejercicio', {
            rutinaId,
            ejercicioId: item.ejercicio?.id,
            seriesObjetivo: item.seriesObjetivo,
            repObjetivo: item.repObjetivo,
            descanso: item.descanso,
          })
        }
      >
        <Text style={styles.title}>{item.ejercicio?.nombre ?? 'Ejercicio sin nombre'}</Text>
        <Text style={styles.subtitle}>Series: {item.seriesObjetivo}</Text>
        <Text style={styles.subtitle}>Repeticiones: {item.repObjetivo}</Text>
        <Text style={styles.subtitle}>Descanso: {item.descanso} seg</Text>
      </TouchableOpacity>

      {/* Columna 3: Comentario */}
      {item.comentario ? (
        <TouchableOpacity
          style={styles.commentContainer}
          onPress={() => setExpanded(expanded === item.id ? null : item.id)}
          activeOpacity={0.7}
        >
          <Text
            style={styles.commentText}
            numberOfLines={expanded === item.id ? undefined : 3}
            ellipsizeMode="tail"
          >
            💬 {item.comentario}
          </Text>
        </TouchableOpacity>
      ) : (
        <View style={styles.commentContainer} />
      )}

      {/* Columna 4: ícono información */}
      <TouchableOpacity
        style={styles.infoIconContainer}
        onPress={() =>
          navigation.navigate('Ejercicio', {
            rutinaId,
            ejercicioId: item.ejercicio?.id,
            seriesObjetivo: item.seriesObjetivo,
            repObjetivo: item.repObjetivo,
            descanso: item.descanso,
          })
        }
      >
        <Ionicons name="information-circle-outline" size={24} style={styles.infoIcon} />
      </TouchableOpacity>
    </View>
  );

  if (loading) return <ActivityIndicator style={{ marginTop: 20 }} />;
  if (error) return <Text style={{ color: 'red' }}>{error}</Text>;

  const onStartPress = async () => {
    try {
      if (isEntrenador) {
        if (typeof atletaId !== 'number') {
          showAlert('Falta información', 'No se recibió el atleta para crear el entrenamiento.');
          return;
        }
        // Crear entrenamiento para el atleta seleccionado (mantén el texto exacto/fecha si aplica)
        await iniciarEntrenamiento(fechaPreSeleccionada, atletaId);
        // Para entrenador: volver a Home
        navigation.navigate('Home');
      } else {
        // Atleta: iniciar y navegar a pantalla de entrenamiento
        await iniciarEntrenamiento(fechaPreSeleccionada);
        navigation.navigate('Entrenamiento', { rutinaId });
      }
    } catch (e: any) {
      console.error('Error al iniciar/crear entrenamiento:', e?.message || e);
      showAlert('Error', e?.message ?? 'No fue posible iniciar/crear el entrenamiento.');
    }
  };

  return (
    <RoleBasedLayout>
      <View style={styles.container}>
        <Text style={styles.header}>{rutinaNombre}</Text>

        <FlatList
          data={rutinaEjercicios}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
        />

        <TouchableOpacity style={styles.startButton} onPress={onStartPress}>
          <Text style={styles.startButtonText}>
            {isEntrenador ? 'Crear Entrenamiento' : 'Iniciar Entrenamiento'}
          </Text>
        </TouchableOpacity>
      </View>
    </RoleBasedLayout>
  );
}
