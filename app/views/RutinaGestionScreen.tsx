import { Ionicons } from '@expo/vector-icons';
import React, { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Modal,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import RoleBasedLayout from '../components/RoleBasedLayout';
import RutinaEjerciciosEditor from '../components/RutinaEjercicioEditor'; // ✅ Editor modular
import { useAuth } from '../contexts/AuthContext';
import type { Rutina } from '../models/Rutina';
import useRutinaGestion from '../viewmodels/useRutinaGestion';
import { styles } from './styles/RutinaGestionScreen.style';

export default function RutinaGestionScreen() {
  const { user } = useAuth();
  const isEntrenador = useMemo(
    () => user?.role?.toLowerCase?.() === 'entrenador',
    [user?.role]
  );

  const {
    rutinas,
    loading,
    error,
    createRutina,
    updateRutina,
    deleteRutina,
    reload,
  } = useRutinaGestion();

  // Estado del modal (crear/editar)
  const [isModalVisible, setModalVisible] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [nombre, setNombre] = useState('');
  const [tipo, setTipo] = useState<'publica' | 'privada'>('privada');

  // Abrir modal para crear
  const openCreateModal = () => {
    setEditingId(null);
    setNombre('');
    setTipo('privada');
    setModalVisible(true);
  };

  // Abrir modal para editar
  const openEditModal = (r: Rutina) => {
    setEditingId(r.id);
    setNombre(r.nombre ?? '');
    setTipo(r.tipo ?? 'privada');
    setModalVisible(true);
  };

  // Cerrar modal
  const closeModal = () => setModalVisible(false);

  // Guardar (crear/editar) — la vista NO muestra alerts: lo hace el VM
  const onSave = async () => {
    if (!nombre.trim()) return;
    if (editingId == null) {
      await createRutina({ nombre: nombre.trim(), tipo });
    } else {
      await updateRutina(editingId, { nombre: nombre.trim(), tipo });
    }
    closeModal();
  };

  // Eliminar — la vista NO confirma ni alerta: lo hace el VM
  const onDelete = async (r: Rutina) => {
    await deleteRutina(r.id);
  };

  // Solo entrenadores
  if (!isEntrenador) {
    return (
      <RoleBasedLayout>
        <View style={styles.centered}>
          <Ionicons name="lock-closed-outline" size={40} />
          <Text style={styles.centeredText}>
            Esta sección es exclusiva para entrenadores.
          </Text>
        </View>
      </RoleBasedLayout>
    );
  }

  if (loading && rutinas.length === 0) {
    return (
      <RoleBasedLayout>
        <View style={styles.centered}>
          <ActivityIndicator size="large" />
        </View>
      </RoleBasedLayout>
    );
  }

  if (error && rutinas.length === 0) {
    return (
      <RoleBasedLayout>
        <View style={styles.centered}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity onPress={reload} style={styles.primaryButton} disabled={loading}>
            <Text style={styles.primaryButtonText}>Reintentar</Text>
          </TouchableOpacity>
        </View>
      </RoleBasedLayout>
    );
  }

  // Tarjeta de rutina
  const renderItem = ({ item }: { item: Rutina }) => (
    <View style={styles.card}>
      <Ionicons name="clipboard-outline" size={28} style={styles.cardIcon} />
      <View style={styles.cardContent}>
        <Text style={styles.title}>{item.nombre}</Text>
        <Text style={styles.subtitle}>
          Tipo: {item.tipo === 'publica' ? 'Pública' : 'Privada'}
        </Text>
        <Text style={styles.subtitle}>
          Ejercicios: {Array.isArray(item.ejercicios) ? item.ejercicios.length : 0}
        </Text>
      </View>

      <View style={styles.cardActions}>
        <TouchableOpacity
          onPress={() => openEditModal(item)}
          style={[styles.iconButton, styles.iconButtonEdit]}
          disabled={loading}
        >
          <Ionicons name="create-outline" size={20} />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => onDelete(item)}
          style={[styles.iconButton, styles.iconButtonDelete]}
          disabled={loading}
        >
          <Ionicons name="trash-outline" size={20} />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <RoleBasedLayout>
      <View style={styles.container}>
        <Text style={styles.header}>Gestionar rutinas</Text>

        <FlatList
          data={rutinas}
          keyExtractor={(item) => String(item.id)}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          refreshing={loading}
          onRefresh={reload}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Ionicons name="documents-outline" size={40} />
              <Text style={styles.emptyText}>
                Aún no tienes rutinas creadas. Usa el botón “＋” para crear la primera.
              </Text>
            </View>
          }
        />

        {/* Botón flotante: crear */}
        <TouchableOpacity style={styles.fab} onPress={openCreateModal} disabled={loading}>
          <Text style={styles.fabIcon}>＋</Text>
        </TouchableOpacity>

        {/* Modal crear/editar */}
        <Modal transparent visible={isModalVisible} animationType="slide" onRequestClose={closeModal}>
          <View style={styles.modalBackdrop}>
            <View style={[styles.modalCard, { maxHeight: '90%' }]}>
              {/* ⬇️ Scroll anidado para evitar conflictos con listas internas */}
              <ScrollView
                contentContainerStyle={{ paddingBottom: 16 }}
                nestedScrollEnabled
                keyboardShouldPersistTaps="handled"
              >
                <Text style={styles.modalTitle}>
                  {editingId == null ? 'Crear rutina' : 'Editar rutina'}
                </Text>

                <TextInput
                  placeholder="Nombre de la rutina"
                  value={nombre}
                  onChangeText={setNombre}
                  style={styles.input}
                  editable={!loading}
                />

                {/* Selector simple de tipo (publica/privada) */}
                <View style={styles.tipoRow}>
                  <TouchableOpacity
                    onPress={() => setTipo('privada')}
                    style={[styles.tipoChip, tipo === 'privada' && styles.tipoChipActive]}
                    disabled={loading}
                  >
                    <Text style={styles.tipoChipText}>Privada</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => setTipo('publica')}
                    style={[styles.tipoChip, tipo === 'publica' && styles.tipoChipActive]}
                    disabled={loading}
                  >
                    <Text style={styles.tipoChipText}>Pública</Text>
                  </TouchableOpacity>
                </View>

                {/* ✅ Editor modular de ejercicios (solo al editar) */}
                {editingId != null && (
                  <RutinaEjerciciosEditor rutinaId={editingId} />
                )}

                <View style={[styles.modalActions, { marginTop: 16 }]}>
                  <TouchableOpacity onPress={closeModal} style={styles.secondaryButton} disabled={loading}>
                    <Text style={styles.secondaryButtonText}>Cerrar</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={onSave} style={styles.primaryButton} disabled={loading || !nombre.trim()}>
                    {loading ? (
                      <ActivityIndicator />
                    ) : (
                      <Text style={styles.primaryButtonText}>
                        {editingId == null ? 'Crear' : 'Guardar'}
                      </Text>
                    )}
                  </TouchableOpacity>
                </View>
              </ScrollView>
            </View>
          </View>
        </Modal>
      </View>
    </RoleBasedLayout>
  );
}
