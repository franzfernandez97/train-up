import { FontAwesome5, Ionicons, MaterialIcons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Platform,
    ScrollView,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import RoleBasedLayout from '../components/RoleBasedLayout';
import { RutinaEjercicio } from '../models/RutinaEjercicio';
import useEntrenamiento from '../viewmodels/useEntrenamiento';
import { styles } from './styles/EntrenamientoScreen.styles';

export default function EntrenamientoScreen() {
  const { nombreRutina, ejercicios, loading, completados, toggleCompletar } = useEntrenamiento();
  const [YoutubePlayer, setYoutubePlayer] = useState<React.ComponentType<any> | null>(null);

  useEffect(() => {
    if (Platform.OS !== 'web') {
      import('react-native-youtube-iframe').then((mod) =>
        setYoutubePlayer(() => mod.default)
      );
    }
  }, []);

  const getYoutubeId = (url: string): string => {
    const match = url.match(
      /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|v\/))([^&\n?#]+)/
    );
    return match?.[1] ?? '';
  };

  if (loading) {
    return (
      <RoleBasedLayout>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#000" />
          <Text style={{ marginTop: 10 }}>Cargando entrenamiento...</Text>
        </View>
      </RoleBasedLayout>
    );
  }

  return (
    <RoleBasedLayout>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>{nombreRutina}</Text>

        {ejercicios.map((item: RutinaEjercicio) => {
          const { ejercicio, id, seriesObjetivo, repObjetivo, descanso, comentario } = item;
          const completado = completados.includes(id);

          return (
            <View key={id} style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.exerciseTitle}>{ejercicio.nombre}</Text>
                <MaterialIcons name="insights" size={20} />
              </View>

              <View style={styles.videoRow}>
                {Platform.OS === 'web' ? (
                  <iframe
                    width="90"
                    height="60"
                    src={`https://www.youtube.com/embed/${getYoutubeId(ejercicio.urlMedia)}`}
                    title="YouTube video"
                    allowFullScreen
                    style={{ border: 0, borderRadius: 8 }}
                  />
                ) : YoutubePlayer ? (
                  <YoutubePlayer
                    height={60}
                    width={90}
                    videoId={getYoutubeId(ejercicio.urlMedia)}
                    play={false}
                  />
                ) : (
                  <Text>Cargando video...</Text>
                )}

                <View style={styles.textCol}>
                  <View style={styles.infoRow}>
                    <FontAwesome5 name="flag" size={14} />
                    <Text style={styles.infoText}>
                      {seriesObjetivo} series x {repObjetivo} rep
                    </Text>
                  </View>
                  <View style={styles.infoRow}>
                    <Ionicons name="time-outline" size={16} />
                    <Text style={styles.infoText}>{descanso} seg de descanso</Text>
                  </View>
                  {comentario && (
                    <View style={styles.infoRow}>
                      <Ionicons name="information-circle-outline" size={16} />
                      <Text style={styles.infoText} numberOfLines={1}>
                        {comentario}
                      </Text>
                    </View>
                  )}
                </View>
              </View>

              <View style={styles.actionsRow}>
                <TouchableOpacity
                  style={styles.btnGray}
                  onPress={() => console.log('Insertar marcas')}
                >
                  <Ionicons name="add-circle-outline" size={18} />
                  <Text style={styles.btnText}>Insertar marcas</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.btnCheck,
                    { backgroundColor: completado ? '#4CAF50' : '#ccc' },
                  ]}
                  onPress={() => toggleCompletar(id)}
                >
                  <Ionicons name="checkmark-done-outline" size={18} color="#000" />
                  <Text style={styles.btnText}>Completar</Text>
                </TouchableOpacity>
              </View>
            </View>
          );
        })}
      </ScrollView>
    </RoleBasedLayout>
  );
}
