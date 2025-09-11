// /services/MetricsService.ts
import axios from "axios";
import type { MarcaPersonal, MarcasResponse } from "../models/MarcaPersonal";
import { showAlert } from "../utils/AlertService";
import { getItem } from "../utils/SecureStorage";

/**
 * Base URL de tu API
 */
const API_URL = "http://147.93.114.243:8080/api";

/**
 * GET /marcas-personales
 * Obtiene todas las marcas personales del usuario autenticado.
 * - Requiere token guardado en SecureStorage.
 * - Devuelve el array data del backend (o [] si viene vacío).
 */
export const fetchMarcasPersonales = async (): Promise<MarcaPersonal[]> => {
  try {
    const token = await getItem("token");
    if (!token) {
      const msg = "No hay token de autenticación";
      showAlert("Métricas", msg);
      throw new Error(msg);
    }

    const res = await axios.get<MarcasResponse>(`${API_URL}/marcas-personales`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    return res.data?.data ?? [];
  } catch (error: any) {
    const msg =
      error?.response?.data?.message ??
      (error?.code === "ECONNABORTED"
        ? "Tiempo de espera agotado"
        : "Error al obtener las marcas personales");

    showAlert("Métricas", msg);
    throw new Error(msg);
  }
};

/**
 * Construye opciones únicas de ejercicios para usar en un Picker.
 * - Devuelve [{ id, label }] ordenado alfabéticamente ASC por label.
 * - Si necesitas DESC, ordénalo en el ViewModel.
 */
export const buildExerciseOptions = (marcas: MarcaPersonal[]) => {
  const map = new Map<number, string>();

  for (const m of marcas) {
    // ⛔️ Ignorar ejercicios sin series
    const hasSeries = Array.isArray(m.series) && m.series.length > 0;
    if (!hasSeries) continue;

    if (m?.ejercicio && !map.has(m.ejercicio_id)) {
      map.set(m.ejercicio_id, m.ejercicio.nombre);
    }
  }

  return Array.from(map.entries())
  .map(([id, label]) => ({ id, label }))
  .sort((a, b) => a.label.localeCompare(b.label, 'es', { sensitivity: 'base' }));
};

/**
 * Representa una serie “aplanada” que incluye la fecha y metadatos
 * de la marca personal (día, ejercicio, atleta).
 */
export type RawSerie = {
  id: number;
  serie: number;
  repeticiones: number;
  valor: number;
  comentario: string | null;
  created_at: string;
  updated_at: string;
  marca_personal_id: number;
  marca_personal: {
    id: number;
    ejercicio_id: number;
    atleta_id: number;
    fecha: string; // YYYY-MM-DD
    created_at: string;
    updated_at: string;
  };
  ejercicio?: { id: number; nombre: string };
};

/**
 * Aplana el arreglo de marcas en un arreglo de series diarias (RawSerie),
 * copiando la fecha/ids de la marca para que la vista pueda agrupar por día.
 */
export const flattenMarcasToRawSeries = (
  marcas: MarcaPersonal[]
): RawSerie[] => {
  const rows: RawSerie[] = [];

  for (const m of marcas) {
    for (const s of m.series) {
      rows.push({
        ...s,
        marca_personal: {
          id: m.id,
          ejercicio_id: m.ejercicio_id,
          atleta_id: m.atleta_id,
          fecha: m.fecha,
          created_at: m.created_at,
          updated_at: m.updated_at,
        },
        ejercicio: m.ejercicio
          ? { id: m.ejercicio.id, nombre: m.ejercicio.nombre }
          : undefined,
      });
    }
  }

  return rows;
};

/**
 * Calcula el PROMEDIO DIARIO para un campo Y dado:
 *  - yField: "repeticiones" | "valor"
 *  - Agrupa por fecha (YYYY-MM-DD) y devuelve { date, y, count }
 *    donde y = promedio y count = cantidad de series ese día.
 *
 * ÚNICO modo de agregación requerido por la vista.
 */
export const aggregateDailyAverage = (
  series: RawSerie[],
  yField: "repeticiones" | "valor"
): Array<{ date: string; y: number; count: number }> => {
  const byDate = new Map<string, { sum: number; count: number }>();

  for (const r of series) {
    const date = r.marca_personal.fecha;
    const y =
      yField === "repeticiones"
        ? Number(r.repeticiones ?? 0)
        : Number(r.valor ?? 0);

    if (!byDate.has(date)) byDate.set(date, { sum: 0, count: 0 });

    const bucket = byDate.get(date)!;
    bucket.sum += y;
    bucket.count += 1;
  }

  return Array.from(byDate.entries())
    .map(([date, b]) => ({
      date,
      y: b.count ? b.sum / b.count : 0,
      count: b.count,
    }))
    .sort((a, b) => a.date.localeCompare(b.date));
};
