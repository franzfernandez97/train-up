import React, { useMemo, useState } from 'react';
import {
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import type { Ejercicio } from '../models/Ejercicio';
import {
    createEjercicio,
    CreateEjercicioDTO,
    updateEjercicio,
    UpdateEjercicioDTO,
} from '../services/EjercicioService';
import { showAlert } from '../utils/AlertService';
import { styles } from './styles/EjercicioForm.styles';

type Props = {
  /** Si se provee, el formulario entra en modo edición */
  ejercicio?: Ejercicio;
  /** Se dispara cuando el create/update termina OK, retorna el Ejercicio resultante */
  onSuccess: (saved: Ejercicio) => void;
  /** Opcional: cerrar modal o limpiar selección */
  onCancel?: () => void;
};

const MUSCLE_GROUPS = [
    'Calentamiento', 'Funcional', 'Abdominales', 'Pierna','Gluteo', 
    'Espalda', 'Pecho', 'Hombro', 'Biceps','Triceps','Antebrazo'
];

export default function EjercicioForm({ ejercicio, onSuccess, onCancel }: Props) {
  const isEdit = !!ejercicio;

  const [nombre, setNombre] = useState(ejercicio?.nombre ?? '');
  const [grupoMuscular, setGrupoMuscular] = useState<string>(
    ejercicio?.grupoMuscular ?? MUSCLE_GROUPS[0]
  );
  const [instrucciones, setInstrucciones] = useState(ejercicio?.instrucciones ?? '');
  const [urlMedia, setUrlMedia] = useState(ejercicio?.urlMedia ?? '');
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ [k: string]: string }>({});

  const title = isEdit ? 'Editar ejercicio' : 'Crear ejercicio';
  const cta = isEdit ? 'Guardar cambios' : 'Crear';

  const payload: CreateEjercicioDTO | UpdateEjercicioDTO = useMemo(
    () => ({
      nombre: nombre.trim(),
      grupoMuscular: grupoMuscular.trim(),
      instrucciones: instrucciones.trim(),
      urlMedia: urlMedia.trim(),
    }),
    [nombre, grupoMuscular, instrucciones, urlMedia]
  );

  const validate = () => {
    const e: { [k: string]: string } = {};
    if (!payload.nombre) e.nombre = 'El nombre es obligatorio';
    if (!payload.grupoMuscular) e.grupoMuscular = 'Selecciona un grupo muscular';
    if (!payload.instrucciones) e.instrucciones = 'Agrega instrucciones';
    if (!payload.urlMedia) e.urlMedia = 'La URL del video/medio es obligatoria';
    // Validación sencilla de URL
    const urlRegex = /^(https?:\/\/)[^\s]+$/i;
    if (payload.urlMedia && !urlRegex.test(payload.urlMedia)) {
      e.urlMedia = 'Ingresa una URL válida (http/https)';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    try {
      setSubmitting(true);
      if (isEdit && ejercicio) {
        const saved = await updateEjercicio(ejercicio.id, payload as UpdateEjercicioDTO);
        showAlert('Ejercicio actualizado', 'Los cambios se guardaron correctamente.');
        onSuccess(saved);
      } else {
        const saved = await createEjercicio(payload as CreateEjercicioDTO);
        showAlert('Ejercicio creado', 'Se creó el ejercicio correctamente.');
        onSuccess(saved);
      }
    } catch (err: any) {
      const msg = err?.message ?? (isEdit ? 'No se pudo actualizar' : 'No se pudo crear');
      showAlert('Error', msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={{ flex: 1 }}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>{title}</Text>

        {/* Nombre */}
        <View style={styles.field}>
          <Text style={styles.label}>Nombre *</Text>
          <TextInput
            value={nombre}
            onChangeText={setNombre}
            placeholder="Ej. Press de banca inclinado"
            style={[styles.input, errors.nombre && styles.inputError]}
            autoCapitalize="sentences"
          />
          {errors.nombre ? <Text style={styles.errorText}>{errors.nombre}</Text> : null}
        </View>

        {/* Grupo Muscular - Burbujas */}
        <View style={styles.field}>
          <Text style={styles.label}>Grupo muscular *</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.chipsRow}
          >
            {MUSCLE_GROUPS.map((g) => {
              const active = grupoMuscular === g;
              return (
                <TouchableOpacity
                  key={g}
                  style={[styles.chipBubble, active && styles.chipBubbleActive]}
                  onPress={() => setGrupoMuscular(g)}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.chipBubbleText, active && styles.chipBubbleTextActive]}>
                    {g}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
          {errors.grupoMuscular ? (
            <Text style={styles.errorText}>{errors.grupoMuscular}</Text>
          ) : null}
        </View>

        {/* Instrucciones */}
        <View style={styles.field}>
          <Text style={styles.label}>Instrucciones *</Text>
          <TextInput
            value={instrucciones}
            onChangeText={setInstrucciones}
            placeholder={'Escribe pasos o recomendaciones.\nUsa saltos de línea para enumerar.'}
            style={[styles.textarea, errors.instrucciones && styles.inputError]}
            multiline
            numberOfLines={5}
            textAlignVertical="top"
          />
          {errors.instrucciones ? <Text style={styles.errorText}>{errors.instrucciones}</Text> : null}
        </View>

        {/* URL Media */}
        <View style={styles.field}>
          <Text style={styles.label}>URL del video/medio *</Text>
          <TextInput
            value={urlMedia}
            onChangeText={setUrlMedia}
            placeholder="https://www.youtube.com/watch?v=XXXX o cualquier URL válida"
            style={[styles.input, errors.urlMedia && styles.inputError]}
            autoCapitalize="none"
            keyboardType="url"
          />
          {errors.urlMedia ? <Text style={styles.errorText}>{errors.urlMedia}</Text> : null}
        </View>

        {/* Acciones */}
        <View style={styles.actionsRow}>
          {onCancel ? (
            <TouchableOpacity style={styles.cancelBtn} onPress={onCancel} disabled={submitting}>
              <Text style={styles.cancelText}>Cancelar</Text>
            </TouchableOpacity>
          ) : null}

          <TouchableOpacity
            style={[styles.submitBtn, submitting && { opacity: 0.7 }]}
            onPress={handleSubmit}
            disabled={submitting}
          >
            {submitting ? <ActivityIndicator /> : <Text style={styles.submitText}>{cta}</Text>}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
