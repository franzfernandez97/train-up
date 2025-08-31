// ...imports
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  Modal,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import EjercicioForm from '../components/EjercicioForm';
import RoleBasedLayout from '../components/RoleBasedLayout';
import type { Ejercicio } from '../models/Ejercicio';
import useEjercicioGestion from '../viewmodels/useEjercicioGestion';
import { styles } from './styles/EjercicioGestionScreen.styles';

export default function EjercicioGestionScreen() {
  const {
    ejercicios,
    loading,
    error,
    // onCreate, onEdit
    onDelete,
    getYoutubeId,
    // filtros
    query,
    setQuery,
    selectedGroup,
    setSelectedGroup,
    grupos,
    // necesitamos volver a cargar al guardar
    fetchEjercicios,
  } = useEjercicioGestion();

  const [YoutubePlayer, setYoutubePlayer] = useState<React.ComponentType<any> | null>(null);

  // estado del modal y ejercicio en edición
  const [openModal, setOpenModal] = useState(false);
  const [editing, setEditing] = useState<Ejercicio | undefined>(undefined);

  useEffect(() => {
    if (Platform.OS !== 'web') {
      import('react-native-youtube-iframe').then((mod) => setYoutubePlayer(() => mod.default));
    }
  }, []);

  // handlers locales para abrir modal en crear/editar
  const handleCreate = () => {
    setEditing(undefined);
    setOpenModal(true);
  };

  const handleEdit = (ej: Ejercicio) => {
    setEditing(ej);
    setOpenModal(true);
  };

  // al guardar (create/update) cerramos modal y recargamos lista
  const handleSuccess = async (_saved: Ejercicio) => {
    setOpenModal(false);
    setEditing(undefined);
    await fetchEjercicios();
  };

  if (loading) {
    return (
      <RoleBasedLayout>
        <ActivityIndicator style={{ marginTop: 20 }} />
      </RoleBasedLayout>
    );
  }

  return (
    <RoleBasedLayout>
      <View style={styles.container}>
        <Text style={styles.header}>Gestión de Ejercicios</Text>

        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        {/* 🔎 Barra de búsqueda + chips debajo */}
        <View style={styles.filtersBlock}>
          <View style={styles.searchBox}>
            <Ionicons name="search-outline" size={18} style={styles.searchIcon} />
            <TextInput
              placeholder="Buscar por nombre..."
              value={query}
              onChangeText={setQuery}
              style={styles.searchInput}
              autoCapitalize="none"
              autoCorrect={false}
              clearButtonMode="while-editing"
            />
          </View>

          {/* 🫧 Burbujas de grupo muscular (una selección) */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.chipsRow}
          >
            {grupos.map((g) => {
              const active = selectedGroup === g;
              return (
                <TouchableOpacity
                  key={g}
                  style={[styles.chipBubble, active && styles.chipBubbleActive]}
                  onPress={() => setSelectedGroup(g)}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.chipBubbleText, active && styles.chipBubbleTextActive]}>
                    {g}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* Lista de tarjetas */}
        <ScrollView contentContainerStyle={styles.listContent}>
          {ejercicios.map((ej) => (
            <View key={ej.id} style={styles.card}>
              <Text style={styles.title}>{ej.nombre}</Text>
              <Text style={styles.chip}>{ej.grupoMuscular}</Text>

              <View style={styles.videoContainer}>
                {Platform.OS === 'web' ? (
                  <View style={styles.iframeWrapper}>
                    <iframe
                      width="100%"
                      height="100%"
                      src={`https://www.youtube.com/embed/${getYoutubeId(ej.urlMedia)}`}
                      title="YouTube video player"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      style={{ border: 0 }}
                    />
                  </View>
                ) : YoutubePlayer ? (
                  <YoutubePlayer
                    height={220}
                    width={Dimensions.get('window').width - 32}
                    videoId={getYoutubeId(ej.urlMedia)}
                    play={false}
                  />
                ) : (
                  <Text style={styles.videoPlaceholder}>Cargando video...</Text>
                )}
              </View>

              <View style={styles.instructionsBlock}>
                <Text style={styles.subHeader}>Instrucciones</Text>
                {ej.instrucciones?.split('\n').map((line, idx) => (
                  <Text key={idx} style={styles.instructionLine}>
                    {idx + 1}. {line.trim()}
                  </Text>
                ))}
              </View>

              <View style={styles.actionsRow}>
                <TouchableOpacity style={styles.editBtn} onPress={() => handleEdit(ej)}>
                  <Ionicons name="create-outline" size={18} />
                  <Text style={styles.actionText}>Editar</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.deleteBtn} onPress={() => onDelete(ej)}>
                  <Ionicons name="trash-outline" size={18} />
                  <Text style={styles.actionText}>Eliminar</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}

          {ejercicios.length === 0 && !loading && !error ? (
            <Text style={styles.emptyText}>No hay ejercicios que coincidan con el filtro.</Text>
          ) : null}
        </ScrollView>

        {/* Botón flotante (+) */}
        <TouchableOpacity style={styles.fab} onPress={handleCreate} activeOpacity={0.9}>
          <Ionicons name="add" size={28} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* MODAL crear/editar */}
      <Modal
        visible={openModal}
        animationType="slide"
        onRequestClose={() => setOpenModal(false)}
      >
        <View style={{ flex: 1, backgroundColor: '#f5f6f8' }}>
          <EjercicioForm
            ejercicio={editing}
            onCancel={() => setOpenModal(false)}
            onSuccess={handleSuccess}
          />
        </View>
      </Modal>
    </RoleBasedLayout>
  );
}
