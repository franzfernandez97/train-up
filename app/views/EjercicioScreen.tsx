import { FontAwesome5, Ionicons } from '@expo/vector-icons';
import { RouteProp, useRoute } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Dimensions, Platform, ScrollView, Text, View } from 'react-native';
import RoleBasedLayout from '../components/RoleBasedLayout';
import { RootStackParamList } from '../navigation/AppNavigator';
import useEjercicioViewModel from '../viewmodels/useEjercicio';
import { styles } from './styles/EjercicioScreen.style';

type EjercicioRouteProp = RouteProp<RootStackParamList, 'Ejercicio'>;

export default function EjercicioScreen() {
  const route = useRoute<EjercicioRouteProp>();
  const { ejercicioId, rutinaId, seriesObjetivo, repObjetivo, descanso } = route.params;
  const { ejercicio, loading, error } = useEjercicioViewModel(ejercicioId);
  const [YoutubePlayer, setYoutubePlayer] = useState<React.ComponentType<any> | null>(null);


  useEffect(() => {
    if (Platform.OS !== 'web') {
      import('react-native-youtube-iframe').then((mod) => setYoutubePlayer(() => mod.default));
    }
  }, []);

  const getYoutubeId = (url: string): string => {
    const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|v\/))([^&\n?#]+)/);
    return match?.[1] ?? '';
  };

  if (loading) {
    return <ActivityIndicator style={{ marginTop: 20 }} />;
  }

  if (error || !ejercicio) {
    return (
      <View style={styles.container}>
        <Text style={{ color: 'red', fontSize: 16 }}>{error || 'Error desconocido'}</Text>
      </View>
    );
  }

  return (
    <RoleBasedLayout>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>{ejercicio.nombre}</Text>

        <View style={styles.videoContainer}>
          {Platform.OS === 'web' ? (
            // ✅ Web: usar iframe directamente
            <View style={{ height: 220, width: '100%', borderRadius: 8, overflow: 'hidden' }}>
              <iframe
                width="100%"
                height="100%"
                src={`https://www.youtube.com/embed/${getYoutubeId(ejercicio.urlMedia)}`}
                title="YouTube video player"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                style={{ border: 0 }}
              />
            </View>
          ) : YoutubePlayer ? (
            // ✅ Android/iOS: usar YoutubePlayer
            <YoutubePlayer
              height={220}
              width={Dimensions.get('window').width - 32}
              videoId={getYoutubeId(ejercicio.urlMedia)}
              play={false}
            />
          ) : (
            <Text style={styles.videoPlaceholder}>Cargando video...</Text>
          )}
        </View>

        <View style={styles.instructionsBlock}>
          <Text style={styles.subHeader}>Instrucciones del ejercicio</Text>
          {ejercicio.instrucciones.split('\n').map((line, index) => (
            <Text key={index} style={styles.instructionLine}>
              {index + 1}. {line.trim()}
            </Text>
          ))}
        </View>

        <View style={styles.goalBlock}>
          <Text style={styles.subHeader}>Objetivo</Text>
          <View style={styles.goalItem}>
            <FontAwesome5 name="flag" size={16} style={styles.goalIcon} />
            <Text style={styles.goalText}>{seriesObjetivo} series x {repObjetivo} rep</Text>
          </View>
          <View style={styles.goalItem}>
            <Ionicons name="time-outline" size={16} style={styles.goalIcon} />
            <Text style={styles.goalText}>{descanso} seg de descanso</Text>
          </View>
          <View style={styles.goalItem}>
            <Ionicons name="barbell-outline" size={16} style={styles.goalIcon} />
            <Text style={styles.goalText}>primeras 2 series con el peso máximo</Text>
          </View>
        </View>
      </ScrollView>
    </RoleBasedLayout>

  );
}
