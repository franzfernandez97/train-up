import { Ionicons } from '@expo/vector-icons';
import { RouteProp, useRoute } from '@react-navigation/native';
import React from 'react';
import {
    ActivityIndicator,
    FlatList,
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

  const { ejercicios, loading, error } = useRutinaDetalleViewModel(rutinaId);

    const getIconNameByGrupo = (
    grupo: string | undefined
    ): keyof typeof Ionicons.glyphMap => {
    if (!grupo) return 'help-outline';

    const key = grupo.toLowerCase();

    if (key.includes('pectorales')) return 'barbell-outline';
    if (key.includes('dorsales')) return 'body-outline';
    if (key.includes('deltoides')) return 'fitness-outline';
    if (key.includes('bíceps') || key.includes('biceps')) return 'hand-left-outline';
    if (key.includes('tríceps') || key.includes('triceps')) return 'hand-right-outline';
    if (key.includes('trapecios')) return 'expand-outline';
    if (key.includes('abdominales')) return 'accessibility-outline';
    if (key.includes('oblicuos')) return 'swap-horizontal-outline';
    if (key.includes('lumbar')) return 'git-branch-outline';
    if (key.includes('glúteos') || key.includes('gluteos')) return 'walk-outline';
    if (key.includes('cuádriceps') || key.includes('cuadriceps')) return 'footsteps-outline';
    if (key.includes('isquiotibiales')) return 'trending-down-outline';
    if (key.includes('gemelos')) return 'trending-up-outline';

    return 'help-outline'; // fallback
    };



const renderItem = ({ item }: any) => (
  <View style={styles.card}>
    {/* Ícono del grupo muscular a la izquierda */}
    <Ionicons
      name={getIconNameByGrupo(item.ejercicio?.grupoMuscular)}
      size={32}
      style={styles.leftIcon}
    />

    {/* Contenido principal */}
    <View style={styles.cardContent}>
      <Text style={styles.title}>
        {item.ejercicio?.nombre ?? 'Ejercicio sin nombre'}
      </Text>
      <Text style={styles.subtitle}>4 series / 10 repeticiones</Text>
    </View>

    {/* Ícono de información a la derecha */}
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
