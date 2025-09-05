// /screens/AIScreen.tsx
// -----------------------------------------------------------------------------
// Esta pantalla guía al usuario paso a paso para generar una rutina con IA.
// Cambios solicitados:
// - El Paso 1 ahora es la FECHA del ejercicio.
// - Si la fecha seleccionada es menor que hoy, NO se puede avanzar.
// - El resto de pasos mantiene su orden relativo (nivel, objetivo, grupos,
//   duración, resumen).
//
// Integración con CalendarioMensual:
//   navigation.navigate({ name: 'AI', params: { fechaPreSeleccionada: fecha }, merge: true } as any);
//   navigation.goBack();
// -----------------------------------------------------------------------------

import type { RouteProp } from '@react-navigation/native';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Modal,
  Platform,
  ScrollView,
  Share,
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

// ---------------------- Pequeños componentes UI reutilizables ----------------

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

const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <Text style={styles.sectionTitle}>{children}</Text>
);

// Bloque para ver/compartir JSON en el modal de debug
const JsonBlock = ({ title, data }: { title: string; data: any }) => {
  const json = useMemo(() => {
    try {
      return JSON.stringify(data, null, 2);
    } catch {
      return String(data);
    }
  }, [data]);

  const shareIt = async () => {
    try {
      await Share.share({ message: json, title });
    } catch {}
  };

  if (data == null) return null;

  return (
    <View style={styles.modalSection}>
      <View style={[styles.modalRow, { justifyContent: 'space-between', alignItems: 'center' }]}>
        <Text style={styles.modalSectionTitle}>{title}</Text>
        <TouchableOpacity onPress={shareIt} style={[styles.modalBtnMini]}>
          <Text style={styles.modalBtnMiniText}>Compartir</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.jsonBox}>
        <ScrollView>
          <Text style={styles.jsonText} selectable>{json}</Text>
        </ScrollView>
      </View>
    </View>
  );
};

// ------------------------------ Tipos y utilidades ---------------------------

type AIRouteProp = RouteProp<RootStackParamList, 'AI'>;

function todayISO(): string {
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const dd = String(now.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

// --------------------------------- Componente --------------------------------

export default function AIScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<AIRouteProp>();
  const { resultado, loading, error: errorObj, solicitarRutina, clearError } = useAISolicitud();

  // --------------------------- Estado del wizard/flujo -----------------------
  // Nuevo orden de pasos:
  // 0 saludo, 1 fecha, 2 nivel, 3 objetivo, 4 grupos, 5 duración, 6 resumen
  const [step, setStep] = useState<number>(0);
  const TOTAL_STEPS = 6;

  // ---------------------------- Estado del formulario ------------------------
  const [objetivo, setObjetivo] = useState<GenerarRutinaAIRequest['objetivo']>('hipertrofia');
  const [nivel, setNivel] = useState<GenerarRutinaAIRequest['nivel']>('principiante');
  const [grupoMuscular, setGrupoMuscular] = useState<GenerarRutinaAIRequest['grupoMuscular']>(['Calentamiento']); // "Calentamiento" por defecto

  // Duración como texto para permitir campo vacío mientras escribe
  const [duracionText, setDuracionText] = useState<string>('90');
  const duracionNum = useMemo(() => {
    const v = parseInt(duracionText, 10);
    return Number.isFinite(v) ? v : NaN;
  }, [duracionText]);

  // Fecha elegida (solo mediante CalendarioMensual) — por defecto hoy
  const [selectedDateISO, setSelectedDateISO] = useState<string>(todayISO());

  // Al volver del calendario, si llega la fecha por params, se actualiza y
  // garantizamos que el usuario esté (al menos) en el paso 1 (Fecha).
  useEffect(() => {
    const fecha = route.params?.fechaPreSeleccionada;
    if (fecha) {
      setSelectedDateISO(fecha);
      setStep((s) => (s < 1 ? 1 : s));
    }
  }, [route.params?.fechaPreSeleccionada]);

  // ---------------------------- Helpers de navegación ------------------------
  const next = () => setStep((s) => Math.min(s + 1, TOTAL_STEPS));
  const prev = () => setStep((s) => Math.max(s - 1, 0));

  const toggleGrupo = (g: string) => {
    setGrupoMuscular(prev =>
      prev.includes(g as any) ? prev.filter(x => x !== g) : [...prev, g as any]
    );
  };

  // ------------------------------ Validaciones -------------------------------
  // Se ejecutan al pulsar "Siguiente" en cada paso
  const validateCurrentStep = (): string | null => {
    switch (step) {
      case 1: { // Fecha
        if (!selectedDateISO) return 'Selecciona una fecha.';
        if (!/^\d{4}-\d{2}-\d{2}$/.test(selectedDateISO)) return 'La fecha no es válida.';
        const today = todayISO();
        if (selectedDateISO < today) return 'La fecha no puede ser anterior a hoy.';
        return null;
      }
      case 2: // Nivel
        if (!nivel) return 'Selecciona un nivel para continuar.';
        return null;
      case 3: // Objetivo
        if (!objetivo) return 'Selecciona un objetivo para continuar.';
        return null;
      case 4: { // Grupos musculares
        if (!grupoMuscular || grupoMuscular.length === 0) {
          return 'Selecciona al menos un grupo muscular.';
        }
        // Exigir al menos uno adicional a "Calentamiento"
        if (grupoMuscular.filter(g => g !== 'Calentamiento').length < 1) {
          return 'Agrega al menos un grupo muscular además de "Calentamiento".';
        }
        return null;
      }
      case 5: { // Duración
        if (!Number.isFinite(duracionNum)) return 'Ingresa una duración válida.';
        if (duracionNum < 20 || duracionNum > 180) {
          return 'La duración debe estar entre 20 y 180 minutos.';
        }
        return null;
      }
      default:
        return null;
    }
  };

  function handleNextWithValidation() {
    const err = validateCurrentStep();
    if (err) {
      alert(err);
      return;
    }
    next();
  }

  async function handleEnviar() {
    // Reforzamos validaciones críticas por seguridad antes de enviar
    if (selectedDateISO < todayISO()) {
      alert('La fecha no puede ser anterior a hoy.');
      setStep(1);
      return;
    }
    if (grupoMuscular.filter(g => g !== 'Calentamiento').length < 1) {
      alert('Debes seleccionar al menos un grupo muscular adicional a "Calentamiento".');
      setStep(4);
      return;
    }
    if (!Number.isFinite(duracionNum) || duracionNum < 20 || duracionNum > 180) {
      alert('La duración debe estar entre 20 y 180 minutos.');
      setStep(5);
      return;
    }

    const payload: GenerarRutinaAIRequest = {
      objetivo,
      nivel,
      grupoMuscular,
      duracion: duracionNum,
      dia: selectedDateISO,
    };

    try {
      await solicitarRutina(payload);
      setShowSuccess(true);
      setShowError(false);
    } catch {
      setShowError(true);
      setShowSuccess(false);
    }
  }

  // --------------------------- UI de navegación (botones) --------------------
  function WizardNav({
    onNext,
    onBack,
    showBack = false,
  }: {
    onNext: () => void;
    onBack?: () => void;
    showBack?: boolean;
  }) {
    return (
      <View style={{ flexDirection: 'row', justifyContent: showBack ? 'space-between' : 'flex-end', marginTop: 12 }}>
        {showBack && (
          <TouchableOpacity style={[styles.btn, { backgroundColor: '#ddd' }]} onPress={onBack}>
            <Text style={[styles.btnText, { color: '#111' }]}>Atrás</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity style={styles.btn} onPress={onNext}>
          <Text style={styles.btnText}>Siguiente</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // ---------------------------- Vistas por cada paso -------------------------

  const PasoGreeting = () => (
    <View>
      {/* Saludo con fuente más grande */}
      <Text style={[styles.sectionTitle, { fontSize: 22, lineHeight: 28 }]}>
        ¡Hola! Soy <Text style={{ fontWeight: '700' }}>DAKO</Text>, tu entrenador personal creado con IA.
      </Text>
      <Text style={[styles.hint, { marginTop: 6 }]}>
        Responde estas preguntas y diseñaré un plan de entrenamiento a tu medida.
      </Text>
      <TouchableOpacity style={[styles.btn, { marginTop: 12 }]} onPress={next}>
        <Text style={styles.btnText}>Comenzar</Text>
      </TouchableOpacity>
    </View>
  );

  const PasoFecha = () => (
    <View>
      <SectionTitle>¿Para qué fecha es tu entrenamiento?</SectionTitle>
      <Text style={styles.hint}>Fecha seleccionada: {selectedDateISO}</Text>

      {/* Navega a CalendarioMensual para devolver la fecha a esta pantalla */}
      <TouchableOpacity
        style={[styles.btn, { backgroundColor: '#f5f5f5', marginTop: 8 }]}
        onPress={() =>
          navigation.navigate('CalendarioMensual', {
            returnTo: 'AI',
            returnParamName: 'fechaPreSeleccionada',
          } as any)
        }
      >
        <Text style={[styles.btnText, { color: '#111' }]}>Elegir fecha en calendario</Text>
      </TouchableOpacity>

      <WizardNav onNext={handleNextWithValidation} onBack={prev} showBack />
    </View>
  );

  const PasoNivel = () => (
    <View>
      <SectionTitle>¿Qué tan exigente quieres que sea el entrenamiento?</SectionTitle>
      <View style={styles.rowWrap}>
        {NIVELES.map((n) => (
          <Chip key={n} label={n} active={nivel === n} onPress={() => setNivel(n)} />
        ))}
      </View>
      <WizardNav onNext={handleNextWithValidation} onBack={prev} showBack />
    </View>
  );

  const PasoObjetivo = () => (
    <View>
      <SectionTitle>¿Cuál es tu objetivo principal?</SectionTitle>
      <View style={styles.rowWrap}>
        {OBJETIVOS.map((o) => (
          <Chip key={o} label={o} active={objetivo === o} onPress={() => setObjetivo(o)} />
        ))}
      </View>
      <WizardNav onNext={handleNextWithValidation} onBack={prev} showBack />
    </View>
  );

  const PasoGrupos = () => (
    <View>
      <SectionTitle>¿Qué grupos musculares quieres entrenar?</SectionTitle>
      <Text style={styles.hint}>
        Puedes elegir varios. “Calentamiento” ya está incluido; selecciona al menos uno adicional.
      </Text>
      <View style={styles.rowWrap}>
        {GRUPOS.map((g) => (
          <Chip key={g} label={g} active={grupoMuscular.includes(g)} onPress={() => toggleGrupo(g)} />
        ))}
      </View>
      <WizardNav onNext={handleNextWithValidation} onBack={prev} showBack />
    </View>
  );

  const PasoDuracion = () => (
    <View>
      <SectionTitle>¿Cuánto tiempo quieres entrenar? (minutos)</SectionTitle>
      <TextInput
        value={duracionText}
        onChangeText={setDuracionText}
        keyboardType={Platform.OS === 'ios' ? 'number-pad' : 'numeric'}
        placeholder="90"
        style={styles.input}
      />
      <Text style={styles.hint}>Se requiere entre 20 y 180 minutos.</Text>
      <WizardNav onNext={handleNextWithValidation} onBack={prev} showBack />
    </View>
  );

  const PasoResumen = () => (
    <View>
      <SectionTitle>Resumen</SectionTitle>
      <View style={styles.modalSection}>
        <View style={styles.modalRow}><Text style={styles.modalLabel}>Nivel:</Text><Text style={styles.modalValue}>{nivel}</Text></View>
        <View style={styles.modalRow}><Text style={styles.modalLabel}>Objetivo:</Text><Text style={styles.modalValue}>{objetivo}</Text></View>
        <View style={styles.modalRow}><Text style={styles.modalLabel}>Grupos:</Text><Text style={styles.modalValue}>{grupoMuscular.join(', ')}</Text></View>
        <View style={styles.modalRow}><Text style={styles.modalLabel}>Duración:</Text><Text style={styles.modalValue}>{Number.isFinite(duracionNum) ? `${duracionNum} min` : '(sin especificar)'}</Text></View>
        <View style={styles.modalRow}><Text style={styles.modalLabel}>Fecha:</Text><Text style={styles.modalValue}>{selectedDateISO}</Text></View>
      </View>

      {/* Último paso: permitir Atrás y Generar */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 12 }}>
        <TouchableOpacity style={[styles.btn, { backgroundColor: '#ddd' }]} onPress={prev}>
          <Text style={[styles.btnText, { color: '#111' }]}>Atrás</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.btn} disabled={loading} onPress={handleEnviar}>
          <Text style={styles.btnText}>Generar rutina</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  // Decide qué paso renderizar (nuevo orden con fecha primero)
  const renderStep = () => {
    switch (step) {
      case 0: return <PasoGreeting />;
      case 1: return <PasoFecha />;
      case 2: return <PasoNivel />;
      case 3: return <PasoObjetivo />;
      case 4: return <PasoGrupos />;
      case 5: return <PasoDuracion />;
      case 6: return <PasoResumen />;
      default: return <PasoGreeting />;
    }
  };

  const Progress = () => (
    <Text style={[styles.hint, { textAlign: 'right', marginBottom: 6 }]}>
      Paso {Math.min(step, TOTAL_STEPS)} de {TOTAL_STEPS}
    </Text>
  );

  // --------------------------------- Render ----------------------------------

  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);

  return (
    <RoleBasedLayout>
      {/* Overlay de cargando */}
      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#fff" />
          <Text style={styles.loadingText}>Generando rutina...</Text>
        </View>
      )}

      <ScrollView contentContainerStyle={styles.container}>
        <Progress />
        {renderStep()}
      </ScrollView>

      {/* ------------------------------ Modal Éxito --------------------------- */}
      <Modal
        visible={showSuccess && !!resultado}
        transparent
        animationType="fade"
        onRequestClose={() => setShowSuccess(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Rutina generada</Text>

            {/* Resumen del formulario */}
            <View style={styles.modalSection}>
              <Text style={styles.modalSectionTitle}>Resumen seleccionado</Text>
              <View style={styles.modalRow}><Text style={styles.modalLabel}>Objetivo:</Text><Text style={styles.modalValue}>{objetivo}</Text></View>
              <View style={styles.modalRow}><Text style={styles.modalLabel}>Nivel:</Text><Text style={styles.modalValue}>{nivel}</Text></View>
              <View style={styles.modalRow}><Text style={styles.modalLabel}>Fecha:</Text><Text style={styles.modalValue}>{selectedDateISO}</Text></View>
              <View style={styles.modalRow}><Text style={styles.modalLabel}>Duración:</Text><Text style={styles.modalValue}>{duracionNum} min</Text></View>
              <View style={styles.modalRow}><Text style={styles.modalLabel}>Grupos:</Text><Text style={styles.modalValue}>{grupoMuscular.join(', ')}</Text></View>
            </View>

            {/* Resultado IA */}
            {!!resultado && (
              <>
                <View style={styles.modalSection}>
                  <Text style={styles.modalSectionTitle}>Resultado</Text>
                  <Text style={styles.modalRutinaNombre}>{resultado.response.data.rutina.nombre}</Text>
                  {!!resultado.response.data.explicacion_ai && (
                    <Text style={styles.modalExplicacion}>{resultado.response.data.explicacion_ai}</Text>
                  )}
                  <Text style={styles.modalEjTitle}>Ejercicios:</Text>
                  <View style={{ maxHeight: 180 }}>
                    <ScrollView>
                      {resultado.response.data.rutina.ejercicios.map((e: any) => (
                        <Text key={e.id} style={styles.modalEjItem}>• {e.nombre} ({e.grupoMuscular})</Text>
                      ))}
                    </ScrollView>
                  </View>
                </View>

                {/* Debug IA (éxito) */}
                {!!resultado.correlationId && (
                  <View style={styles.modalSection}>
                    <View style={styles.modalRow}>
                      <Text style={styles.modalSectionTitle}>Correlation ID:</Text>
                      <Text style={[styles.modalValue, { marginLeft: 6 }]}>{resultado.correlationId}</Text>
                    </View>
                  </View>
                )}
                <JsonBlock title="AI Plan (raw filtrado)" data={resultado.debug?.ai_plan ?? null} />
                <JsonBlock title="Planner Input" data={resultado.debug?.planner_input ?? null} />
                <JsonBlock title="Calc/Reparto" data={resultado.debug?.service_debug ?? null} />
              </>
            )}

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.modalBtn, styles.modalBtnSecondary]}
                onPress={() => setShowSuccess(false)}
              >
                <Text style={styles.modalBtnTextSecondary}>Cerrar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalBtn, styles.modalBtnPrimary]}
                onPress={() => {
                  setShowSuccess(false);
                  navigation.navigate('Home');
                }}
              >
                <Text style={styles.modalBtnTextPrimary}>Aceptar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* ------------------------------ Modal Error --------------------------- */}
      <Modal
        visible={showError && !!errorObj}
        transparent
        animationType="fade"
        onRequestClose={() => { setShowError(false); clearError(); }}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Error de IA</Text>

            {!!errorObj && (
              <>
                <View style={styles.modalSection}>
                  <View style={styles.modalRow}>
                    <Text style={styles.modalLabel}>Mensaje:</Text>
                    <Text style={[styles.modalValue, { flex: 1 }]}>{errorObj.message}</Text>
                  </View>
                  {!!errorObj.status && (
                    <View style={styles.modalRow}>
                      <Text style={styles.modalLabel}>HTTP:</Text>
                      <Text style={styles.modalValue}>{errorObj.status}</Text>
                    </View>
                  )}
                  {!!errorObj.correlationId && (
                    <View style={styles.modalRow}>
                      <Text style={styles.modalLabel}>Correlation ID:</Text>
                      <Text style={styles.modalValue}>{errorObj.correlationId}</Text>
                    </View>
                  )}
                </View>

                <JsonBlock title="AI Plan (raw filtrado)" data={errorObj.debug?.ai_plan ?? null} />
                <JsonBlock title="Planner Input" data={errorObj.debug?.planner_input ?? null} />
                <JsonBlock title="Calc/Reparto" data={errorObj.debug?.service_debug ?? null} />
                <JsonBlock title="Backend body" data={errorObj.body ?? null} />
              </>
            )}

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.modalBtn, styles.modalBtnSecondary]}
                onPress={() => { setShowError(false); clearError(); }}
              >
                <Text style={styles.modalBtnTextSecondary}>Cerrar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalBtn, styles.modalBtnPrimary]}
                onPress={() => { setShowError(false); clearError(); }}
              >
                <Text style={styles.modalBtnTextPrimary}>Entendido</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </RoleBasedLayout>
  );
}
