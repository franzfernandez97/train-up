import { FontAwesome5, Ionicons, MaterialIcons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  Platform,
  ScrollView,
  Text,
  View
} from 'react-native';
import RoleBasedLayout from '../components/RoleBasedLayout';
import { RutinaEjercicio } from '../models/RutinaEjercicio';
import useEntrenamiento from '../viewmodels/useEntrenamiento';
import { styles } from './styles/EntrenamientoScreen.styles';

export default function EntrenamientoScreen() {
  const { nombreRutina, ejercicios, loading, completados, toggleCompletar } = useEntrenamiento();
  const [YoutubePlayer, setYoutubePlayer] = useState<React.ComponentType<any> | null>(null);

  // Medidas por tarjeta: id -> { w, h } para 16:9
  const [dims, setDims] = useState<Record<number, { w: number; h: number }>>({});

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
    return (
      <RoleBasedLayout>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#000" />
          <Text style={{ marginTop: 10 }}>Cargando entrenamiento...</Text>
        </View>
      </RoleBasedLayout>
    );
  }

  const { width: screenW } = Dimensions.get('window');

  return (
    <RoleBasedLayout>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>{nombreRutina}</Text>

        {ejercicios.map((item: RutinaEjercicio) => {
          const { ejercicio, id, seriesObjetivo, repObjetivo, descanso, comentario } = item;
          const completado = completados.includes(id);
          const videoId = getYoutubeId(ejercicio.urlMedia);

          const playerW = dims[id]?.w ?? Math.min(screenW - 32, screenW); // fallback razonable
          const playerH = dims[id]?.h ?? Math.round(playerW * 9 / 16);

          return (
            <View key={id} style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.exerciseTitle}>{ejercicio.nombre}</Text>
                <MaterialIcons name="insights" size={20} />
              </View>

              {/* 🔹 VIDEO INLINE: justo debajo del título, ancho 100% de la tarjeta */}
              <View
                style={styles.videoBox}
                // Medimos el ancho real disponible de la tarjeta para calcular 16:9
                onLayout={(e) => {
                  const w = e.nativeEvent.layout.width;
                  if (!w) return;
                  const h = Math.round((w * 9) / 16);
                  setDims((prev) => (prev[id]?.w === w ? prev : { ...prev, [id]: { w, h } }));
                }}
              >
                {Platform.OS === 'web' ? (
                  // Web: iframe ocupa el 100% del contenedor (ya controlamos alto con 'local.videoBox' + dims)
                  <iframe
                    style={{ width: '100%', height: playerH, border: 0 }}
                    src={`https://www.youtube.com/embed/${videoId}?playsinline=1`}
                    title="YouTube video"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen; web-share"
                    allowFullScreen
                  />
                ) : YoutubePlayer ? (
                  // Native: el player usa dims medidos, reproduce inline con controles
                  <YoutubePlayer
                    width={playerW}
                    height={playerH}
                    videoId={videoId}
                    play={false} // el usuario pulsa Play en el mismo player
                    initialPlayerParams={{
                      controls: true,
                      modestbranding: true,
                      rel: false,
                      // playsinline se respeta en WebView interno
                    }}
                    webViewProps={{
                      allowsFullscreenVideo: true, // el usuario puede agrandar desde el control del player
                      androidLayerType: 'hardware',
                    }}
                  />
                ) : (
                  <Text style={{ color: '#999', padding: 8 }}>Cargando video…</Text>
                )}
              </View>

              {/* INFO */}
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

              {/* ACCIONES */}
              <View style={styles.actionsRow}>
                <View style={styles.btnGray}>
                  <Ionicons name="add-circle-outline" size={18} />
                  <Text style={styles.btnText}>Insertar marcas</Text>
                </View>

                <View
                  style={[
                    styles.btnCheck,
                    { backgroundColor: completado ? '#4CAF50' : '#ccc' },
                  ]}
                  // si quieres mantener tu toggle:
                  // onTouchEnd={() => toggleCompletar(id)}
                >
                  <Ionicons name="checkmark-done-outline" size={18} color="#000" />
                  <Text style={styles.btnText}>Completar</Text>
                </View>
              </View>
            </View>
          );
        })}
      </ScrollView>
    </RoleBasedLayout>
  );
}

