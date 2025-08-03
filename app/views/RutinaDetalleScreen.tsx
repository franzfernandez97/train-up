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
import { RutinaEjercicio } from '../models/RutinaEjercicio';
import { RootStackParamList } from '../navigation/AppNavigator';
import useRutinaDetalleViewModel from '../viewmodels/useRutinaDetalle';
import { styles } from './styles/RutinaDetalleScreen.style';

type RutinaDetalleRouteProp = RouteProp<RootStackParamList, 'RutinaDetalle'>;

export default function RutinaDetalleScreen() {
  const route = useRoute<RutinaDetalleRouteProp>();
  const { rutinaId, rutinaNombre, fechaPreSeleccionada } = route.params;
  const [expanded, setExpanded] = useState<number | null>(null);
  const { rutinaEjercicios, loading, error } = useRutinaDetalleViewModel(rutinaId);
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { iniciarEntrenamiento } = useRutinaDetalleViewModel(rutinaId);
  console.log("Fecha PreSeleccionada:",fechaPreSeleccionada)
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
        <Image
          source={require('../assets/images/logo.png')}
          style={styles.leftIcon}
        />
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
        <Text style={styles.title}>
          {item.ejercicio?.nombre ?? 'Ejercicio sin nombre'}
        </Text>
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
        <Ionicons
          name="information-circle-outline"
          size={24}
          style={styles.infoIcon}
        />
      </TouchableOpacity>
    </View>
  );

  if (loading) return <ActivityIndicator style={{ marginTop: 20 }} />;
  if (error) return <Text style={{ color: 'red' }}>{error}</Text>;

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

        <TouchableOpacity
          style={styles.startButton}
          onPress={async () => {
            try {
              await iniciarEntrenamiento(fechaPreSeleccionada);
              navigation.navigate('Entrenamiento', { rutinaId });
            } catch (error: any) {
              console.error('Error al iniciar entrenamiento:', error.message);
              // Opcional: showAlert('Error', error.message);
            }
          }}
        >
          <Text style={styles.startButtonText}>Iniciar Entrenamiento</Text>
        </TouchableOpacity>
      </View>
    </RoleBasedLayout>
  );
}
