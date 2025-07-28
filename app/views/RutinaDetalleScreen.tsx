import { Ionicons } from '@expo/vector-icons';
import { RouteProp, useRoute } from '@react-navigation/native';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import RoleBasedLayout from '../components/RoleBasedLayout';
import { RootStackParamList } from '../navigation/AppNavigator';
import useRutinaDetalleViewModel from '../viewmodels/useRutinaDetalle';
import { styles } from './styles/RutinaDetalleScreen.style';


type RutinaDetalleRouteProp = RouteProp<RootStackParamList, 'RutinaDetalle'>;

export default function RutinaDetalleScreen() {
  const route = useRoute<RutinaDetalleRouteProp>();
  const { rutinaId, rutinaNombre } = route.params;
  const [expanded, setExpanded] = useState(false);
  const { ejercicios, loading, error } = useRutinaDetalleViewModel(rutinaId);

const renderItem = ({ item }: any) => (
  <View style={styles.card}>
    {/* Columna 1: Ícono grupo muscular */}
    <Image
      source={require('../assets/images/logo.png')}
      style={styles.leftIcon}
    />

    {/* Columna 2: Nombre, series, repeticiones, descanso */}
    <View style={styles.cardContent}>
      <Text style={styles.title}>
        {item.ejercicio?.nombre ?? 'Ejercicio sin nombre'}
      </Text>
      <Text style={styles.subtitle}>
        Series: {item.seriesObjetivo}
      </Text>
      <Text style={styles.subtitle}>
        Repeticiones: {item.repObjetivo}
      </Text>
      <Text style={styles.subtitle}>
        Descanso: {item.descanso}
      </Text>
    </View>

    {/* Columna 3: Comentario */}
{item.comentario ? (
        <TouchableOpacity
          style={styles.commentContainer}
          onPress={() => setExpanded(!expanded)}
          activeOpacity={0.7}
        >
          <Text
            style={styles.commentText}
            numberOfLines={expanded ? undefined : 3}
            ellipsizeMode="tail"
          >
            💬 {item.comentario}
          </Text>
        </TouchableOpacity>
      ) : (
        <View style={styles.commentContainer} />
      )}

    {/* Columna 4: Ícono de información */}
    <Ionicons
      name="information-circle-outline"
      size={24}
      style={styles.infoIcon}
    />
  </View>
);


  if (loading) return <ActivityIndicator style={{ marginTop: 20 }} />;
  if (error) return <Text style={{ color: 'red' }}>{error}</Text>;

  return (
    <RoleBasedLayout>
        <View style={styles.container}>
        <Text style={styles.header}>{rutinaNombre}</Text>

        <FlatList
            data={ejercicios}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderItem}
            contentContainerStyle={styles.list}
        />

        <TouchableOpacity style={styles.startButton}>
            <Text style={styles.startButtonText}>Iniciar Entrenamiento</Text>
        </TouchableOpacity>
        </View>
    </RoleBasedLayout>
  );
}
