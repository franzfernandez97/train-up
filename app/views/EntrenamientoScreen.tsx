import { FontAwesome5, Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native'; // 👈 importar hook de navegación
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import RoleBasedLayout from '../components/RoleBasedLayout';
import { RutinaEjercicio } from '../models/RutinaEjercicio';
import { showAlert, showConfirm } from '../utils/AlertService';
import useEntrenamiento from '../viewmodels/useEntrenamiento';
import { styles } from './styles/EntrenamientoScreen.styles';

export default function EntrenamientoScreen() {
  const {
    nombreRutina,
    ejercicios,
    loading,
    completados,
    toggleCompletar,
    handleFinalizar,
  } = useEntrenamiento();

  const navigation = useNavigation<any>(); // 👈 inicializar hook

  const [YoutubePlayer, setYoutubePlayer] = useState<React.ComponentType<any> | null>(null);
  const [dims, setDims] = useState<Record<number, { w: number; h: number }>>({});
  const [marcasVisibles, setMarcasVisibles] = useState<Record<number, boolean>>({});
  const [marcas, setMarcas] = useState<Record<number, { repeticiones: string; peso: string }[]>>({});

  useEffect(() => {
    if (Platform.OS !== 'web') {
      import('react-native-youtube-iframe').then((mod) => setYoutubePlayer(() => mod.default));
    }
  }, []);

  const getYoutubeId = (url: string): string => {
    const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|v\/))([^&\n?#]+)/);
    return match?.[1] ?? '';
  };

  // ========= Helpers marcas =========
  const toNumeric = (s: string) => s.replace(/[^\d.,-]/g, '');

  const ensureMarcas = (id: number, series: number) => {
    setMarcas((prev) => {
      if (prev[id]?.length === series) return prev;
      return {
        ...prev,
        [id]: Array.from({ length: series }, () => ({ repeticiones: '', peso: '' })),
      };
    });
  };

  const toggleMarcas = (id: number, series: number) => {
    ensureMarcas(id, series);
    setMarcasVisibles((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const updateMarca = (
    id: number,
    index: number,
    field: 'repeticiones' | 'peso',
    value: string
  ) => {
    setMarcas((prev) => {
      const arr = prev[id] ? [...prev[id]] : [];
      if (!arr[index]) return prev;
      arr[index] = { ...arr[index], [field]: toNumeric(value) };
      return { ...prev, [id]: arr };
    });
  };
  // ==================================

  // 🔹 Acción finalizar: confirmación + llamada al VM + navegación
  const onFinalizarPress = () => {
    showConfirm(
      'Finalizar entrenamiento',
      '¿Deseas guardar tus marcas? Las series vacías se ignorarán',
      async () => {
        try {
          const resp = await handleFinalizar(marcas);
          // resp: { ok: true, resumen: Array<{ ejercicio_id, marca_personal_id, seriesCreadas }> }
          showAlert(
            '¡Entrenamiento finalizado!',
            `Se registraron ${resp.resumen.reduce((acc, r) => acc + r.seriesCreadas, 0)} series.`
          );
          // 👇 Navegar a Home inmediatamente
          navigation.navigate('Home');
        } catch (e: any) {
          showAlert('Error', e?.message ?? 'No se pudo finalizar el entrenamiento.');
        }
      }
    );
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

          const playerW = dims[id]?.w ?? Math.min(screenW - 32, screenW);
          const playerH = dims[id]?.h ?? Math.round((playerW * 9) / 16);

          return (
            <View key={id} style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.exerciseTitle}>{ejercicio.nombre}</Text>
                <MaterialIcons name="insights" size={20} />
              </View>

              <View
                style={styles.videoBox}
                onLayout={(e) => {
                  const w = e.nativeEvent.layout.width;
                  if (!w) return;
                  const h = Math.round((w * 9) / 16);
                  setDims((prev) => (prev[id]?.w === w ? prev : { ...prev, [id]: { w, h } }));
                }}
              >
                {Platform.OS === 'web' ? (
                  <iframe
                    style={{ width: '100%', height: playerH, border: 0 }}
                    src={`https://www.youtube.com/embed/${videoId}?playsinline=1`}
                    title="YouTube video"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen; web-share"
                    allowFullScreen
                  />
                ) : YoutubePlayer ? (
                  <YoutubePlayer
                    width={playerW}
                    height={playerH}
                    videoId={videoId}
                    play={false}
                    initialPlayerParams={{ controls: true, modestbranding: true, rel: false }}
                    webViewProps={{ allowsFullscreenVideo: true, androidLayerType: 'hardware' }}
                  />
                ) : (
                  <Text style={{ color: '#999', padding: 8 }}>Cargando video…</Text>
                )}
              </View>

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

              <View style={styles.actionsRow}>
                <TouchableOpacity style={styles.btnGray} onPress={() => toggleMarcas(id, seriesObjetivo)}>
                  <Ionicons
                    name={marcasVisibles[id] ? 'remove-circle-outline' : 'add-circle-outline'}
                    size={18}
                  />
                  <Text style={styles.btnText}>
                    {marcasVisibles[id] ? 'Ocultar marcas' : 'Insertar marcas'}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.btnCheck, { backgroundColor: completado ? '#4CAF50' : '#ccc' }]}
                  onPress={() => toggleCompletar(id)}
                >
                  <Ionicons name="checkmark-done-outline" size={18} color="#000" />
                  <Text style={styles.btnText}>Completar</Text>
                </TouchableOpacity>
              </View>

              {marcasVisibles[id] && (
                <View style={styles.marksContainer}>
                  <View style={styles.marksHeaderRow}>
                    <View style={styles.marksColSeries}>
                      <Text style={styles.marksHeaderText}>Series</Text>
                    </View>
                    <View style={styles.marksColReps}>
                      <Text style={styles.marksHeaderText}>Repeticiones</Text>
                    </View>
                    <View style={styles.marksCol}>
                      <Text style={styles.marksHeaderText}>Peso (lb)</Text>
                    </View>
                  </View>

                  {marcas[id]?.map((m, idx) => (
                    <View key={idx} style={styles.marksRow}>
                      <View style={styles.marksColSeries}>
                        <Text style={styles.marksSeriesText}>{idx + 1}</Text>
                      </View>

                      <View style={styles.marksCol}>
                        <TextInput
                          style={styles.marksInput}
                          value={m.repeticiones}
                          placeholder="0"
                          inputMode="numeric"
                          keyboardType="numeric"
                          onChangeText={(t) => updateMarca(id, idx, 'repeticiones', t)}
                        />
                      </View>

                      <View style={styles.marksCol}>
                        <TextInput
                          style={styles.marksInput}
                          value={m.peso}
                          placeholder="0"
                          inputMode="decimal"
                          keyboardType="numeric"
                          onChangeText={(t) => updateMarca(id, idx, 'peso', t)}
                        />
                      </View>
                    </View>
                  ))}
                </View>
              )}
            </View>
          );
        })}

        {/* 🔹 ÚNICO botón al final del scroll */}
        <TouchableOpacity style={styles.finishButton} onPress={onFinalizarPress} activeOpacity={0.85}>
          <Ionicons name="stop-circle-outline" size={20} color="#fff" />
          <Text style={styles.finishButtonText}>Finalizar Entrenamiento</Text>
        </TouchableOpacity>
      </ScrollView>
    </RoleBasedLayout>
  );
}
