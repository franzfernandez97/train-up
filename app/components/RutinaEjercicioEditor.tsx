import { FontAwesome5, Ionicons } from '@expo/vector-icons';
import React, { useEffect, useMemo, useState } from 'react';
import {
    ActivityIndicator,
    Platform,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import type { RutinaEjercicio } from '../models/RutinaEjercicio';
import useRutinaEjercicios from '../viewmodels/useRutinaEjercicio';
import { styles as rootStyles } from '../views/styles/RutinaGestionScreen.style';

/* ──────────────────────────────────────────────────────────────────────────────
 * Tarjeta hija con estado propio + botón con estados + quitar
 * ────────────────────────────────────────────────────────────────────────────── */
function CardRutinaEjercicio({
  value,
  onSave,
  onRemove,
}: {
  value: RutinaEjercicio;
  onSave: (updated: RutinaEjercicio) => Promise<RutinaEjercicio>;
  onRemove: (id: number) => Promise<void>;
}) {
  const [local, setLocal] = useState<RutinaEjercicio>(value);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<'idle' | 'saved' | 'updated'>('idle');

  const isDirty = useMemo(() => {
    return (
      local.seriesObjetivo !== value.seriesObjetivo ||
      local.repObjetivo !== value.repObjetivo ||
      String(local.descanso ?? '') !== String(value.descanso ?? '') ||
      (local.comentario ?? '') !== (value.comentario ?? '') ||
      local.ejercicio_id !== value.ejercicio_id
    );
  }, [local, value]);

  useEffect(() => {
    if (!saving && value.id === local.id) {
      setLocal(value);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value.id, value.seriesObjetivo, value.repObjetivo, value.descanso, value.comentario]);

  const handleSave = async () => {
    try {
      setSaving(true);
      const updated = await onSave(local);
      setLocal(updated);
      setStatus((prev) => (prev === 'saved' ? 'updated' : 'saved'));
    } finally {
      setSaving(false);
    }
  };

  const buttonStyle =
    status === 'saved' || status === 'updated' ? { backgroundColor: '#22c55e' } : null;

  const buttonText = saving
    ? 'Guardando...'
    : status === 'updated'
    ? 'Actualizado'
    : status === 'saved'
    ? 'Guardado'
    : 'Guardar';

  const isButtonDisabled = saving || !isDirty;

  return (
    <View
      style={{
        borderWidth: 1,
        borderRadius: 10,
        padding: 12,
        marginBottom: 12,
        backgroundColor: '#fff',
        borderColor: '#ddd',
      }}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
        <FontAwesome5 name="dumbbell" size={16} style={{ marginRight: 8 }} />
        <Text style={{ fontSize: 16, fontWeight: 'bold', flex: 1 }}>
          {local.ejercicio?.nombre ?? 'Ejercicio'}
        </Text>
      </View>

      {/* Series */}
      <Text style={{ fontWeight: '600', marginBottom: 4 }}>Series</Text>
      <TextInput
        keyboardType="numeric"
        value={String(local.seriesObjetivo ?? '')}
        onChangeText={(t) => setLocal({ ...local, seriesObjetivo: Number(t || 0) })}
        placeholder="Series"
        style={{
          borderWidth: 1, borderColor: '#ccc', borderRadius: 6,
          paddingHorizontal: 8, paddingVertical: Platform.OS === 'web' ? 6 : 4,
          width: 120, marginBottom: 10,
        }}
      />

      {/* Repeticiones */}
      <Text style={{ fontWeight: '600', marginBottom: 4 }}>Repeticiones</Text>
      <TextInput
        keyboardType="numeric"
        value={String(local.repObjetivo ?? '')}
        onChangeText={(t) => setLocal({ ...local, repObjetivo: Number(t || 0) })}
        placeholder="Repeticiones"
        style={{
          borderWidth: 1, borderColor: '#ccc', borderRadius: 6,
          paddingHorizontal: 8, paddingVertical: Platform.OS === 'web' ? 6 : 4,
          width: 120, marginBottom: 10,
        }}
      />

      {/* Seg de descanso */}
      <Text style={{ fontWeight: '600', marginBottom: 4 }}>Seg de descanso</Text>
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
        <Ionicons name="time-outline" size={16} style={{ marginRight: 6 }} />
        <TextInput
          keyboardType="numeric"
          value={String(local.descanso ?? '')}
          onChangeText={(t) => setLocal({ ...local, descanso: t })}
          placeholder="Seg de descanso"
          style={{
            borderWidth: 1, borderColor: '#ccc', borderRadius: 6,
            paddingHorizontal: 8, paddingVertical: Platform.OS === 'web' ? 6 : 4,
            width: 140, marginRight: 6,
          }}
        />
      </View>

      {/* Comentario */}
      <Text style={{ fontWeight: '600', marginBottom: 4 }}>Comentario</Text>
      <View style={{ flexDirection: 'row', alignItems: 'flex-start', marginBottom: 12 }}>
        <Ionicons name="information-circle-outline" size={16} style={{ marginRight: 6, marginTop: 4 }} />
        <TextInput
          value={local.comentario ?? ''}
          onChangeText={(t) => setLocal({ ...local, comentario: t })}
          placeholder="Comentario / indicaciones"
          multiline
          style={{ borderWidth: 1, borderColor: '#ccc', borderRadius: 6, padding: 8, flex: 1, minHeight: 40 }}
        />
      </View>

      <View style={{ flexDirection: 'row', justifyContent: 'flex-end', gap: 8 }}>
        {/* Quitar (eliminar de la rutina) */}
        <TouchableOpacity
          onPress={() => onRemove(local.id)}
          style={[rootStyles.iconButton, rootStyles.iconButtonDelete]}
        >
          <Ionicons name="trash-outline" size={20} />
        </TouchableOpacity>

        {/* Guardar */}
        <TouchableOpacity
          style={[rootStyles.primaryButton, buttonStyle, isButtonDisabled && { opacity: 0.5 }]}
          onPress={handleSave}
          disabled={isButtonDisabled}
        >
          {saving ? (
            <ActivityIndicator />
          ) : (
            <Text style={rootStyles.primaryButtonText}>{buttonText}</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

/* ──────────────────────────────────────────────────────────────────────────────
 * Editor principal: combo/buscador con ScrollView + tarjetas
 *  - Se quita botón (X) de limpiar selección
 *  - Tras pulsar (+), el VM hace reload para ver nombre del ejercicio
 * ────────────────────────────────────────────────────────────────────────────── */
export default function RutinaEjerciciosEditor({ rutinaId }: { rutinaId: number }) {
  const {
    filteredEjercicios,
    ejercicios,
    q, setQ,
    selectedEjercicioId, setSelectedEjercicioId,
    loadingEjercicios,
    rutinaEjercicios,
    loadingRutina,
    addSelectedEjercicio,
    saveRutinaEjercicio,
    removeRutinaEjercicio,
  } = useRutinaEjercicios(rutinaId);

  return (
    <View>
      <Text style={[rootStyles.subtitle, { marginTop: 16 }]}>
        Define objetivos, descanso y detalles para cada ejercicio
      </Text>

      {/* Buscador/Combo */}
      <View style={{ marginTop: 8, marginBottom: 12 }}>
        <TextInput
          placeholder="Buscar ejercicio (nombre, grupo muscular...)"
          value={q}
          onChangeText={setQ}
          style={rootStyles.input}
        />

        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 8 }}>
          <View style={{ flex: 1, borderWidth: 1, borderColor: '#ccc', borderRadius: 6 }}>
            <ScrollView
              style={{ maxHeight: 180 }}
              nestedScrollEnabled
              keyboardShouldPersistTaps="handled"
            >
              {loadingEjercicios ? (
                <ActivityIndicator style={{ margin: 8 }} />
              ) : filteredEjercicios.length > 0 ? (
                filteredEjercicios.map((item) => (
                  <TouchableOpacity
                    key={item.id}
                    onPress={() => setSelectedEjercicioId(item.id)}
                    style={{
                      padding: 10,
                      backgroundColor:
                        selectedEjercicioId === item.id ? '#e6f2ff' : 'transparent',
                    }}
                  >
                    <Text style={{ fontWeight: '600' }}>{item.nombre}</Text>
                    <Text style={{ color: '#666', fontSize: 12 }}>
                      {item.grupoMuscular}
                    </Text>
                  </TouchableOpacity>
                ))
              ) : ejercicios.length > 0 ? (
                <Text style={{ padding: 10, color: '#666' }}>Sin resultados</Text>
              ) : null}
            </ScrollView>
          </View>

          {/* Agregar */}
          <TouchableOpacity
            onPress={addSelectedEjercicio}
            style={[rootStyles.iconButton, rootStyles.iconButtonEdit, { marginLeft: 8 }]}
            disabled={!selectedEjercicioId}
          >
            <Ionicons name="add-outline" size={20} />
          </TouchableOpacity>

          {/* ❌ Se elimina el botón (X) de limpiar selección, según tu pedido */}
        </View>
      </View>

      {/* Tarjetas RE */}
      {loadingRutina ? (
        <ActivityIndicator />
      ) : (
        rutinaEjercicios.map((re) => (
          <CardRutinaEjercicio
            key={re.id}
            value={re}
            onSave={saveRutinaEjercicio}     // ← NO reload
            onRemove={removeRutinaEjercicio} // ← NO reload
          />
        ))
      )}
    </View>
  );
}
