import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Modal,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import RoleBasedLayout from '../components/RoleBasedLayout';
import type { RootStackParamList } from '../navigation/AppNavigator';
import {
  GRUPOS,
  GenerarRutinaAIRequest,
  NIVELES,
  OBJETIVOS,
} from '../services/AIService';
import useAISolicitud from '../viewmodels/useAISolicitud';
import { styles } from './styles/AIScreen.styles';

const Chip = ({
  label,
  active,
  onPress,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
}) => (
  <TouchableOpacity
    onPress={onPress}
    style={[
      styles.chip,
      { borderColor: active ? '#111' : '#ccc', backgroundColor: active ? '#eee' : '#fff' },
    ]}
  >
    <Text style={styles.chipText}>{label}</Text>
  </TouchableOpacity>
);

const monthNames = [
  'Enero','Febrero','Marzo','Abril','Mayo','Junio',
  'Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre',
];

function daysInMonth(year: number, monthIndex0: number) {
  return new Date(year, monthIndex0 + 1, 0).getDate();
}

export default function AIScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { resultado, loading, error, solicitarRutina } = useAISolicitud();

  const [objetivo, setObjetivo] = useState<GenerarRutinaAIRequest['objetivo']>('hipertrofia');
  const [nivel, setNivel] = useState<GenerarRutinaAIRequest['nivel']>('intermedio');
  const [duracion, setDuracion] = useState<number>(60);
  const [grupoMuscular, setGrupoMuscular] = useState<GenerarRutinaAIRequest['grupoMuscular']>([]);

  const now = new Date();
  const [year, setYear] = useState<number>(now.getFullYear());
  const [month, setMonth] = useState<number>(now.getMonth());
  const [day, setDay] = useState<number>(now.getDate());

  const [showModal, setShowModal] = useState(false);

  const maxDays = useMemo(() => daysInMonth(year, month), [year, month]);
  const diaISO = useMemo(() => {
    const dd = String(Math.min(day, maxDays)).padStart(2, '0');
    const mm = String(month + 1).padStart(2, '0');
    return `${year}-${mm}-${dd}`;
  }, [year, month, day, maxDays]);

  const toggleGrupo = (g: string) => {
    setGrupoMuscular(prev =>
      prev.includes(g as any) ? prev.filter(x => x !== g) : [...prev, g as any]
    );
  };

  const handleEnviar = async () => {
    const payload: GenerarRutinaAIRequest = {
      objetivo,
      nivel,
      grupoMuscular,
      duracion,
      dia: diaISO,
    };

    if (!payload.grupoMuscular?.length) return alert('Selecciona al menos un grupo muscular');
    if (payload.duracion < 10 || payload.duracion > 180) {
      return alert('La duración debe estar entre 10 y 180 minutos');
    }

    try {
      await solicitarRutina(payload);
      // Si no hubo error, mostramos modal con resumen + resultado
      setShowModal(true);
    } catch {
      // el hook ya setea error; no abrimos modal
    }
  };

  const YearPicker = () => {
    const years = Array.from({ length: 5 }, (_, i) => now.getFullYear() - 2 + i);
    return (
      <View style={styles.rowWrap}>
        {years.map((y) => (
          <Chip key={y} label={String(y)} active={year === y} onPress={() => setYear(y)} />
        ))}
      </View>
    );
  };

  const MonthPicker = () => (
    <View style={styles.rowWrap}>
      {monthNames.map((m, idx) => (
        <Chip key={m} label={m} active={month === idx} onPress={() => setMonth(idx)} />
      ))}
    </View>
  );

  const DayPicker = () => {
    const days = Array.from({ length: maxDays }, (_, i) => i + 1);
    return (
      <View style={styles.rowWrap}>
        {days.map((d) => (
          <Chip key={d} label={String(d)} active={day === d} onPress={() => setDay(d)} />
        ))}
      </View>
    );
  };

  return (
    <RoleBasedLayout>
      {/* Overlay de cargando a pantalla completa */}
      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#fff" />
          <Text style={styles.loadingText}>Generando rutina...</Text>
        </View>
      )}

      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.sectionTitle}>Objetivo</Text>
        <View style={styles.rowWrap}>
          {OBJETIVOS.map((o) => (
            <Chip key={o} label={o} active={objetivo === o} onPress={() => setObjetivo(o)} />
          ))}
        </View>

        <Text style={styles.sectionTitle}>Nivel</Text>
        <View style={styles.rowWrap}>
          {NIVELES.map((n) => (
            <Chip key={n} label={n} active={nivel === n} onPress={() => setNivel(n)} />
          ))}
        </View>

        <Text style={styles.sectionTitle}>Grupos musculares</Text>
        <View style={styles.rowWrap}>
          {GRUPOS.map((g) => (
            <Chip key={g} label={g} active={grupoMuscular.includes(g)} onPress={() => toggleGrupo(g)} />
          ))}
        </View>

        <Text style={styles.sectionTitle}>Duración (minutos)</Text>
        <TextInput
          value={String(duracion)}
          onChangeText={(t) => {
            const v = parseInt(t, 10);
            if (!Number.isNaN(v)) setDuracion(v);
          }}
          keyboardType={Platform.OS === 'ios' ? 'number-pad' : 'numeric'}
          placeholder="60"
          style={styles.input}
        />

        <Text style={styles.sectionTitle}>Fecha</Text>
        <Text style={styles.hint}>Selecciona año, mes y día. Actual: {diaISO}</Text>

        <Text style={styles.subTitle}>Año</Text>
        <YearPicker />

        <Text style={styles.subTitle}>Mes</Text>
        <MonthPicker />

        <Text style={styles.subTitle}>Día</Text>
        <DayPicker />

        <TouchableOpacity style={styles.btn} disabled={loading} onPress={handleEnviar}>
          <Text style={styles.btnText}>Generar rutina</Text>
        </TouchableOpacity>

        {!!error && <Text style={styles.error}>{error}</Text>}
      </ScrollView>

      {/* Modal de resumen + resultado */}
      <Modal
        visible={showModal && !!resultado}
        transparent
        animationType="fade"
        onRequestClose={() => setShowModal(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Rutina generada</Text>

            {/* Resumen del formulario */}
            <View style={styles.modalSection}>
              <Text style={styles.modalSectionTitle}>Resumen seleccionado</Text>
              <View style={styles.modalRow}><Text style={styles.modalLabel}>Objetivo:</Text><Text style={styles.modalValue}>{objetivo}</Text></View>
              <View style={styles.modalRow}><Text style={styles.modalLabel}>Nivel:</Text><Text style={styles.modalValue}>{nivel}</Text></View>
              <View style={styles.modalRow}><Text style={styles.modalLabel}>Fecha:</Text><Text style={styles.modalValue}>{diaISO}</Text></View>
              <View style={styles.modalRow}><Text style={styles.modalLabel}>Duración:</Text><Text style={styles.modalValue}>{duracion} min</Text></View>
              <View style={styles.modalRow}><Text style={styles.modalLabel}>Grupos:</Text><Text style={styles.modalValue}>{grupoMuscular.join(', ')}</Text></View>
            </View>

            {/* Resultado IA */}
            {!!resultado && (
              <View style={styles.modalSection}>
                <Text style={styles.modalSectionTitle}>Resultado</Text>
                <Text style={styles.modalRutinaNombre}>{resultado.data.rutina.nombre}</Text>
                {!!resultado.data.explicacion_ai && (
                  <Text style={styles.modalExplicacion}>{resultado.data.explicacion_ai}</Text>
                )}
                <Text style={styles.modalEjTitle}>Ejercicios:</Text>
                <View style={{ maxHeight: 180 }}>
                  <ScrollView>
                    {resultado.data.rutina.ejercicios.map((e) => (
                      <Text key={e.id} style={styles.modalEjItem}>• {e.nombre} ({e.grupoMuscular})</Text>
                    ))}
                  </ScrollView>
                </View>
              </View>
            )}

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.modalBtn, styles.modalBtnSecondary]}
                onPress={() => setShowModal(false)}
              >
                <Text style={styles.modalBtnTextSecondary}>Cerrar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalBtn, styles.modalBtnPrimary]}
                onPress={() => {
                  setShowModal(false);
                  navigation.navigate('Home');
                }}
              >
                <Text style={styles.modalBtnTextPrimary}>Aceptar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </RoleBasedLayout>
  );
}
