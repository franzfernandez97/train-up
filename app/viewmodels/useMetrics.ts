// app/viewmodels/useMetrics.ts
import { useEffect, useMemo, useState } from "react";
import {
    aggregateDailyAverage,
    buildExerciseOptions,
    fetchMarcasPersonales,
    flattenMarcasToRawSeries,
    type RawSerie,
} from "../services/MetricsService";
import { showAlert } from "../utils/AlertService";
import {
    ymdToMillisUTC, // 'YYYY-MM-DD' -> ms (UTC-safe)
    ymdToUTCDate, // 'YYYY-MM-DD' -> Date (UTC-safe)
} from "../views/components/metrics/dateUtils";

export type YField = "repeticiones" | "valor";
export type Range  = { from: string; to: string };
export type Point  = { idx: number; date: string; y: number };
export type DayDetail = {
  date: string; // YYYY-MM-DD
  avg: number;  // promedio del yField visible
  series: Array<{ serie: number; repeticiones: number; valor: number }>;
};

export function useMetricsViewModel(initialExerciseId?: number) {
  // ===== Estado =====
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState<string>("");

  const [allRaw, setAllRaw] = useState<RawSerie[]>([]);

  const [exerciseOptions, setExerciseOptions] = useState<{ id: number; label: string }[]>([]);
  const [selectedExerciseId, setSelectedExerciseId] = useState<number | undefined>(undefined);

  const [yField, setYField] = useState<YField>("repeticiones");

  // Rango mostrado en los inputs
  const [range, _setRange] = useState<Range>({ from: "", to: "" });
  const [rangeDirty, setRangeDirty] = useState(false); // se activa al primer cambio del usuario
  const setRange = (r: Range) => { setRangeDirty(true); _setRange(r); };

  // ===== Carga inicial =====
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setError("");

        const marcas = await fetchMarcasPersonales();

        // Sólo marcas con series
        const marcasConSeries = marcas.filter(m => Array.isArray(m.series) && m.series.length > 0);

        // Opciones A→Z
        const optsAsc = buildExerciseOptions(marcasConSeries);
        setExerciseOptions(optsAsc);

        // Aplanado
        setAllRaw(flattenMarcasToRawSeries(marcasConSeries));

        // Selección por defecto
        if (initialExerciseId && optsAsc.some(o => o.id === initialExerciseId)) {
          setSelectedExerciseId(initialExerciseId);
        } else if (optsAsc[0]) {
          setSelectedExerciseId(optsAsc[0].id);
        }
      } catch (e: any) {
        const msg = e?.message ?? "Error cargando métricas";
        setError(msg);
        showAlert("Métricas", msg);
      } finally {
        setLoading(false);
      }
    })();
  }, [initialExerciseId]);

  // ===== Derivados =====

  // 1) Filtrado por ejercicio
  const filteredByExercise = useMemo(() => {
    if (!selectedExerciseId) return [];
    return allRaw.filter(r => r.marca_personal.ejercicio_id === selectedExerciseId);
  }, [allRaw, selectedExerciseId]);

  // 2) Promedio diario por fecha (orden ASC)
  const dailyAvg = useMemo(
    () => aggregateDailyAverage(filteredByExercise, yField),
    [filteredByExercise, yField]
  );

  // 3) Límites REALES del dataset actual como strings YMD
  const chartMinYMD = dailyAvg.length ? dailyAvg[0].date : "";
  const chartMaxYMD = dailyAvg.length ? dailyAvg[dailyAvg.length - 1].date : "";

  // 4) Autollenado de inputs: Desde=min, Hasta=max (sin activar filtro aún)
  useEffect(() => {
    // Si no hay datos, limpia y sal
    if (!chartMinYMD || !chartMaxYMD) {
      if (range.from !== "" || range.to !== "") _setRange({ from: "", to: "" });
      if (rangeDirty) setRangeDirty(false);
      return;
    }

    // Evita setState si ya están iguales (corta el bucle)
    const next = { from: chartMinYMD, to: chartMaxYMD };
    if (range.from !== next.from || range.to !== next.to) {
      _setRange(next);         // inicializa inputs
      setRangeDirty(false);    // no filtrar hasta interacción
    }
  }, [selectedExerciseId, chartMinYMD, chartMaxYMD]); // <- ¡no dependas de objetos Date!

  // 5) Aplicar rango SOLO si el usuario lo tocó (comparaciones UTC-safe)
  const filteredByRange = useMemo(() => {
    if (!rangeDirty) return dailyAvg;
    const fromTs = ymdToMillisUTC(range.from);
    const toTs   = ymdToMillisUTC(range.to);
    if (fromTs === null && toTs === null) return dailyAvg;

    return dailyAvg.filter(row => {
      const ts = ymdToMillisUTC(row.date)!;
      if (fromTs !== null && ts < fromTs) return false;
      if (toTs   !== null && ts > toTs)   return false;
      return true;
    });
  }, [dailyAvg, range, rangeDirty]);

  // 6) Puntos para el gráfico
  const points: Point[] = useMemo(
    () => filteredByRange.map((row, idx) => ({ idx, date: row.date, y: row.y })),
    [filteredByRange]
  );

  // 7) series por dia + promedio
  const dayDetails: DayDetail[] = useMemo(() => {
  // Fechas visibles según lo que realmente se muestra en el chart
  const visibleDates = new Set(filteredByRange.map(d => d.date));
  if (!visibleDates.size) return [];

  // Agrupar series por fecha (solo del ejercicio seleccionado)
  const byDate = new Map<string, DayDetail["series"]>();
  for (const r of filteredByExercise) {
    const date = r.marca_personal.fecha;
    if (!visibleDates.has(date)) continue; // respeta el mismo rango del chart
    const arr = byDate.get(date) ?? [];
    arr.push({
      serie: r.serie,
      repeticiones: Number(r.repeticiones ?? 0),
      valor: Number(r.valor ?? 0),
    });
    byDate.set(date, arr);
  }

  // Armar salida ordenada por fecha ascendente y calcular promedio del yField
  const dates = Array.from(visibleDates).sort(); // ASC (igual que la gráfica)
  return dates.map(date => {
    const arr = (byDate.get(date) ?? []).slice().sort((a, b) => a.serie - b.serie);
    const values = arr.map(s => (yField === "repeticiones" ? s.repeticiones : s.valor));
    const avg = values.length ? values.reduce((a, b) => a + b, 0) / values.length : 0;
    return { date, avg, series: arr };
    });
    }, [filteredByExercise, filteredByRange, yField]);


  // 8) Fechas como Date (UTC) para límites de los pickers — memoizadas por YMD
  const minDataDate = useMemo(
    () => (chartMinYMD ? ymdToUTCDate(chartMinYMD) : undefined),
    [chartMinYMD]
  );
  const maxDataDate = useMemo(
    () => (chartMaxYMD ? ymdToUTCDate(chartMaxYMD) : undefined),
    [chartMaxYMD]
  );

  // ===== API VM =====
  return {
    loading,
    error,

    exerciseOptions,
    selectedExerciseId,
    setSelectedExerciseId,

    yField,
    setYField,

    range,        // lo que ven los inputs
    setRange,     // activa el filtro en el primer cambio del usuario

    points,

    minDataDate,
    maxDataDate,

    dayDetails,
  };
}
