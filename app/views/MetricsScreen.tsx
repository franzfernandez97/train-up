import type { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import React, { useMemo, useState } from 'react';
import {
  Dimensions,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Svg, { Line, Path, Rect, Text as SvgText } from 'react-native-svg';
import RoleBasedLayout from '../components/RoleBasedLayout';
import { styles } from './styles/MetricsScreen.styles';

// ================== Tipos ==================
type RawSerie = {
  id: number;
  serie: number;
  repeticiones: number;
  valor: number; // peso/tiempo/etc
  comentario: string | null;
  created_at: string;
  updated_at: string;
  marca_personal_id: number;
  marca_personal: {
    id: number;
    ejercicio_id: number;
    atleta_id: number;
    fecha: string; // "YYYY-MM-DD"
    created_at: string;
    updated_at: string;
  };
};

type Point = { idx: number; date: string; y: number };

// ================== Datos dummy ==================
// Reemplaza este arreglo por lo que devuelva tu servicio
const MOCK_RAW: RawSerie[] = [
  {
    id: 69, serie: 2, repeticiones: 4, valor: 0, comentario: null,
    created_at: '2025-08-21T23:26:10.000000Z', updated_at: '2025-08-21T23:26:10.000000Z',
    marca_personal_id: 21,
    marca_personal: {
      id: 21, ejercicio_id: 7, atleta_id: 4, fecha: '2025-08-21',
      created_at: '2025-08-21T23:26:09.000000Z', updated_at: '2025-08-21T23:26:09.000000Z'
    }
  },
  {
    id: 70, serie: 1, repeticiones: 10, valor: 20, comentario: null,
    created_at: '2025-08-22T10:00:00.000000Z', updated_at: '2025-08-22T10:00:00.000000Z',
    marca_personal_id: 22,
    marca_personal: {
      id: 22, ejercicio_id: 7, atleta_id: 4, fecha: '2025-08-22',
      created_at: '2025-08-22T10:00:00.000000Z', updated_at: '2025-08-22T10:00:00.000000Z'
    }
  },
  {
    id: 71, serie: 3, repeticiones: 0, valor: 25, comentario: null,
    created_at: '2025-08-23T10:00:00.000000Z', updated_at: '2025-08-23T10:00:00.000000Z',
    marca_personal_id: 23,
    marca_personal: {
      id: 23, ejercicio_id: 7, atleta_id: 4, fecha: '2025-08-23',
      created_at: '2025-08-23T10:00:00.000000Z', updated_at: '2025-08-23T10:00:00.000000Z'
    }
  },
];

// ================== Helpers ==================
const EXERCISES = [
  { id: 'jalon_pecho', label: 'Jalón de pecho' },
  { id: 'press_banca', label: 'Press de banca' },
  { id: 'sentadilla', label: 'Sentadilla' },
  { id: 'peso_muerto', label: 'Peso muerto' },
];

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

function parseDateOrNull(s?: string): number | null {
  if (!s) return null;
  const str = s.trim();
  if (!DATE_RE.test(str)) return null;
  const t = Date.parse(str); // interpreta YYYY-MM-DD
  return isNaN(t) ? null : t;
}

function formatYMD(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${dd}`;
}

function niceMax(n: number): number {
  const step = 5;
  const base = Math.ceil(n / step) * step;
  return Math.max(base, 10); // siempre al menos 10
}

/**
 * Transforma series crudas -> puntos (orden por fecha asc).
 * yField: 'repeticiones' | 'valor'
 * Rango por fechas (inclusive) si from/to existen.
 */
function buildPoints(
  raw: RawSerie[],
  yField: 'repeticiones' | 'valor',
  fromDate?: string,
  toDate?: string
): Point[] {
  const fTs = parseDateOrNull(fromDate);
  const tTs = parseDateOrNull(toDate);

  const sorted = [...raw].sort((a, b) => {
    const ta = Date.parse(a.marca_personal.fecha);
    const tb = Date.parse(b.marca_personal.fecha);
    return ta - tb; // ascendente
  });

  const filtered = sorted.filter((r) => {
    const ts = Date.parse(r.marca_personal.fecha);
    if (fTs !== null && ts < fTs) return false;
    if (tTs !== null && ts > tTs) return false;
    return true;
  });

  return filtered.map((r, idx) => ({
    idx,
    date: r.marca_personal.fecha,
    y: yField === 'repeticiones' ? Number(r.repeticiones || 0) : Number(r.valor || 0),
  }));
}

/**
 * Genera paths y escalas. Usa scroll horizontal con paso fijo X.
 */
function buildAreaPath(
  pts: Point[],
  contentW: number,
  h: number,
  padding: number,
  stepX: number
): {
  area: string;
  line: string;
  scaleX: (i: number) => number;
  scaleY: (y: number) => number;
  yMax: number;
} {
  const innerW = Math.max(contentW - padding * 2, 1);
  const innerH = Math.max(h - padding * 2, 1);

  if (!pts.length) {
    const yMax = 10;
    const scaleX = (_i: number) => padding + innerW / 2;
    const scaleY = (_y: number) => padding + innerH; // base
    return { area: '', line: '', scaleX, scaleY, yMax };
  }

  const yVals = pts.map((p) => p.y);
  const yMax = niceMax(Math.max(...yVals, 0));
  const yMin = 0;

  const iMin = pts[0].idx;
  const iMax = pts[pts.length - 1].idx;

  // X por pasos fijos para scroll horizontal
  const scaleX = (i: number) => padding + (i - iMin) * stepX;

  const scaleY = (y: number) => {
    if (yMax === yMin) return padding + innerH;
    return padding + innerH - ((y - yMin) / (yMax - yMin)) * innerH;
  };

  // Línea
  let line = `M ${scaleX(pts[0].idx)} ${scaleY(pts[0].y)}`;
  for (let k = 1; k < pts.length; k++) {
    line += ` L ${scaleX(pts[k].idx)} ${scaleY(pts[k].y)}`;
  }

  // Área (cerrando a base)
  let area = line;
  area += ` L ${scaleX(pts[pts.length - 1].idx)} ${scaleY(0)}`;
  area += ` L ${scaleX(pts[0].idx)} ${scaleY(0)} Z`;

  return { area, line, scaleX, scaleY, yMax };
}

// ================== DatePicker cross-platform ==================
// En nativo: @react-native-community/datetimepicker
// En web: input type="date"
const RNDateTimePicker =
  Platform.OS === 'web' ? null : require('@react-native-community/datetimepicker').default;

function DatePickerControl({
  label,
  value,
  onChange,
  maxDate,
  minDate,
}: {
  label: string;
  value: string;               // YYYY-MM-DD
  onChange: (v: string) => void;
  maxDate?: Date;
  minDate?: Date;
}) {
  const [show, setShow] = useState(false);

  if (Platform.OS === 'web') {
    // @ts-ignore: elemento web
    return (
      <View style={styles.dateCol}>
        <Text style={styles.selectorLabel}>{label}</Text>
        {/* @ts-ignore */}
        <input
          type="date"
          value={value || ''}
          onChange={(e: any) => onChange(e.target.value)}
          max={maxDate ? formatYMD(maxDate) : undefined}
          min={minDate ? formatYMD(minDate) : undefined}
          style={{
            width: '100%',
            height: 44,
            borderWidth: 1,
            borderColor: '#ccc',
            borderRadius: 10,
            padding: 10,
            background: '#fff',
            color: '#111',
          }}
        />
      </View>
    );
  }

  // iOS / Android
  const parsed = parseDateOrNull(value);
  const initial = parsed ? new Date(parsed) : new Date();

  return (
    <View style={styles.dateCol}>
      <Text style={styles.selectorLabel}>{label}</Text>

      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => setShow(true)}
        style={styles.dateButton}
      >
        <Text style={styles.dateValue}>{value || 'Seleccionar fecha'}</Text>
      </TouchableOpacity>

      {show && RNDateTimePicker ? (
      <RNDateTimePicker
        mode="date"
        display={Platform.OS === 'android' ? 'calendar' : 'inline'}
        value={initial}
        onChange={(event: DateTimePickerEvent, selected?: Date) => {
          // En Android, event.type es 'set' o 'dismissed'
          if (Platform.OS === 'android') setShow(false);
          if (event.type === 'set' && selected) {
            onChange(formatYMD(selected));
          }
        }}
        maximumDate={maxDate}
        minimumDate={minDate}
      />
    ) : null}
    </View>
  );
}

// ================== Vista ==================
export default function MetricsScreen() {
  const [selectedExercise, setSelectedExercise] = useState(EXERCISES[0].id);
  const [yField, setYField] = useState<'repeticiones' | 'valor'>('repeticiones');

  // Filtros de fecha
  const [fromDate, setFromDate] = useState<string>(''); // YYYY-MM-DD
  const [toDate, setToDate] = useState<string>('');     // YYYY-MM-DD

  // 🔁 Con datos reales, filtra MOCK_RAW por ejercicio si aplica
  const raw = MOCK_RAW; // aquí podrías filtrar por selectedExercise si tuvieras mapping

  const points = useMemo(
    () => buildPoints(raw, yField, fromDate, toDate),
    [raw, yField, fromDate, toDate]
  );

  const { width } = Dimensions.get('window');
  const baseChartWidth = Math.min(width - 32, 720);
  const chartHeight = 300;
  const padding = 44;

  // Scroll horizontal: ancho dinámico según número de puntos
  const stepX = 84; // px por punto
  const steps = Math.max(points.length - 1, 0);
  const contentWidth = Math.max(baseChartWidth, padding * 2 + steps * stepX);

  const { area, line, scaleX, scaleY, yMax } = useMemo(
    () => buildAreaPath(points, contentWidth, chartHeight, padding, stepX),
    [points, contentWidth, chartHeight]
  );

  // Ticks Y (siempre definidos)
  const yTicks = useMemo(() => {
    const t0 = 0;
    const t1 = Math.round(yMax * 0.33);
    const t2 = Math.round(yMax * 0.66);
    const t3 = yMax;
    return [t0, t1, t2, t3];
  }, [yMax]);

  // min/maxDate dinámicos (en base a datos disponibles)
  const minDataDate = raw.length ? new Date(Date.parse(raw.reduce((min, r) => (r.marca_personal.fecha < min ? r.marca_personal.fecha : min), raw[0].marca_personal.fecha))) : undefined;
  const maxDataDate = raw.length ? new Date(Date.parse(raw.reduce((max, r) => (r.marca_personal.fecha > max ? r.marca_personal.fecha : max), raw[0].marca_personal.fecha))) : undefined;

  return (
    <RoleBasedLayout>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Métricas</Text>
        </View>

        {/* Filtros: Picker + Toggle + Calendarios */}
        <View style={styles.filterRow}>
          {/* ComboBox ejercicios */}
          <View style={styles.selectorBox}>
            <Text style={styles.selectorLabel}>Ejercicio</Text>
            <View style={styles.pickerWrapper}>
              <Picker
                selectedValue={selectedExercise}
                onValueChange={(val) => setSelectedExercise(String(val))}
                style={styles.picker}
                itemStyle={styles.pickerItem}
                dropdownIconColor={Platform.OS === 'android' ? '#222' : undefined}
                mode="dropdown"
              >
                {EXERCISES.map((e) => (
                  <Picker.Item key={e.id} label={e.label} value={e.id} color="#111" />
                ))}
              </Picker>
            </View>
          </View>

          {/* Toggle Repeticiones/Peso */}
          <View style={styles.toggleRow}>
            <TouchableOpacity
              style={[styles.toggleBtn, yField === 'repeticiones' && styles.toggleBtnActive]}
              onPress={() => setYField('repeticiones')}
              activeOpacity={0.8}
            >
              <Text style={[styles.toggleText, yField === 'repeticiones' && styles.toggleTextActive]}>
                Repeticiones
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.toggleBtn, yField === 'valor' && styles.toggleBtnActive]}
              onPress={() => setYField('valor')}
              activeOpacity={0.8}
            >
              <Text style={[styles.toggleText, yField === 'valor' && styles.toggleTextActive]}>
                Peso
              </Text>
            </TouchableOpacity>
          </View>

          {/* Calendarios Desde / Hasta */}
          <View style={styles.dateRow}>
            <DatePickerControl
              label="Desde"
              value={fromDate}
              onChange={setFromDate}
              minDate={minDataDate}
              maxDate={maxDataDate}
            />
            <DatePickerControl
              label="Hasta"
              value={toDate}
              onChange={setToDate}
              minDate={minDataDate}
              maxDate={maxDataDate}
            />
          </View>
        </View>

        {/* Gráfico área (SVG) con scroll horizontal */}
        <View style={styles.chartCard}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator
            contentContainerStyle={{ width: contentWidth }}
          >
            <Svg width={contentWidth} height={chartHeight}>
              {/* Fondo */}
              <Rect x={0} y={0} width={contentWidth} height={chartHeight} fill="white" />

              {/* Grid Y + labels */}
              {yTicks.map((tick, idx) => (
                <React.Fragment key={`yt-${idx}`}>
                  <Line
                    x1={padding}
                    x2={contentWidth - padding + 8}
                    y1={scaleY(tick)}
                    y2={scaleY(tick)}
                    stroke="#eee"
                    strokeWidth={1}
                  />
                  <SvgText
                    x={padding - 8}
                    y={scaleY(tick) + 4}
                    fontSize="10"
                    fill="#666"
                    textAnchor="end"
                  >
                    {tick}
                  </SvgText>
                </React.Fragment>
              ))}

              {/* Eje X: marcas por punto (fecha) */}
              {points.map((p) => (
                <React.Fragment key={`xt-${p.idx}`}>
                  <Line
                    x1={scaleX(p.idx)}
                    x2={scaleX(p.idx)}
                    y1={chartHeight - padding}
                    y2={chartHeight - padding + 6}
                    stroke="#999"
                    strokeWidth={1}
                  />
                  <SvgText
                    x={scaleX(p.idx)}
                    y={chartHeight - padding + 18}
                    fontSize="10"
                    fill="#666"
                    textAnchor="middle"
                  >
                    {p.date}
                  </SvgText>
                </React.Fragment>
              ))}

              {/* Ejes */}
              <Line
                x1={padding}
                x2={contentWidth - padding}
                y1={chartHeight - padding}
                y2={chartHeight - padding}
                stroke="#999"
                strokeWidth={1}
              />
              <Line
                x1={padding}
                x2={padding}
                y1={padding}
                y2={chartHeight - padding}
                stroke="#999"
                strokeWidth={1}
              />

              {/* Área + Línea */}
              {area ? <Path d={area} fill="#3b82f6" opacity={0.2} /> : null}
              {line ? <Path d={line} fill="none" stroke="#3b82f6" strokeWidth={2} /> : null}

              {/* Etiquetas ejes */}
              <SvgText
                x={contentWidth / 2}
                y={chartHeight - 8}
                fontSize="11"
                fill="#666"
                textAnchor="middle"
              >
                Fecha (marca_personal)
              </SvgText>
              <SvgText
                x={12}
                y={padding - 16}
                fontSize="11"
                fill="#666"
                textAnchor="start"
              >
                {yField === 'repeticiones' ? 'Repeticiones' : 'Peso'}
              </SvgText>
            </Svg>
          </ScrollView>
        </View>

        <View style={{ height: 24 }} />
      </ScrollView>
    </RoleBasedLayout>
  );
}
