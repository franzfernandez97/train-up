import axios from 'axios';
import { RutinaEjercicio } from '../models/RutinaEjercicio';
import { getItem } from '../utils/SecureStorage';

const API_URL = 'http://147.93.114.243:8080/api';

// ========= Tipos de entrada =========
export type CrearRutinaEjercicioInput = {
  rutina_id: number;
  ejercicio_id: number;
  seriesObjetivo: number;
  repObjetivo: number;
  descanso: number | string;     // acepta ambos
  comentario?: string | null;
};

export type ActualizarRutinaEjercicioInput = Partial<{
  rutina_id: number;
  ejercicio_id: number;
  seriesObjetivo: number;
  repObjetivo: number;
  descanso: number | string;     // acepta ambos
  comentario: string | null;
}>;

// ========= Helpers =========
const toNumber = (v: number | string | undefined | null): number | undefined => {
  if (v === undefined || v === null) return undefined;
  if (typeof v === 'number') return v;
  const n = parseInt(String(v), 10);
  return isNaN(n) ? undefined : n;
};

const mapRutinaEjercicio = (raw: any): RutinaEjercicio => {
  return {
    id: Number(raw?.id),
    rutina_id: Number(raw?.rutina_id),
    ejercicio_id: Number(raw?.ejercicio_id),
    seriesObjetivo: Number(raw?.seriesObjetivo),
    repObjetivo: Number(raw?.repObjetivo),
    // 🔒 garantizamos string para tu modelo
    descanso: String(raw?.descanso ?? ''),
    comentario: raw?.comentario ?? null,
    created_at: String(raw?.created_at ?? ''),
    updated_at: String(raw?.updated_at ?? ''),
    ejercicio: raw?.ejercicio, // se asume que el backend lo incluye; si no, ajusta aquí
  };
};

/**
 * Obtiene los ejercicios asociados a una rutina específica.
 */
export const fetchEjerciciosPorRutina = async (
  rutinaId: number
): Promise<RutinaEjercicio[]> => {
  try {
    const token = await getItem('token');
    const response = await axios.get(
      `${API_URL}/rutina-ejercicios/rutina/${rutinaId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const data = response.data?.data ?? [];
    return data.map(mapRutinaEjercicio);
  } catch (error: any) {
    const msg =
      error?.response?.data?.message ??
      'Error al obtener los ejercicios de la rutina';
    throw new Error(msg);
  }
};

/**
 * Crea una relación Rutina-Ejercicio.
 */
export const crearRutinaEjercicio = async (
  input: CrearRutinaEjercicioInput
): Promise<RutinaEjercicio> => {
  try {
    const token = await getItem('token');

    // enviamos descanso como número (segundos)
    const payload = {
      ...input,
      descanso: toNumber(input.descanso),
    };

    const response = await axios.post(`${API_URL}/rutina-ejercicios`, payload, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    return mapRutinaEjercicio(response.data.data);
  } catch (error: any) {
    const msg =
      error?.response?.data?.message ??
      'Error al crear el ejercicio en la rutina';
    throw new Error(msg);
  }
};

/**
 * Actualiza una relación Rutina-Ejercicio existente.
 */
export const actualizarRutinaEjercicio = async (
  id: number,
  patch: ActualizarRutinaEjercicioInput
): Promise<RutinaEjercicio> => {
  try {
    const token = await getItem('token');

    const payload: any = { ...patch };
    if (patch.descanso !== undefined) {
      payload.descanso = toNumber(patch.descanso);
    }

    const response = await axios.put(
      `${API_URL}/rutina-ejercicios/${id}`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    return mapRutinaEjercicio(response.data.data);
  } catch (error: any) {
    const msg =
      error?.response?.data?.message ??
      'Error al actualizar el ejercicio de la rutina';
    throw new Error(msg);
  }
};

/**
 * Elimina una relación Rutina-Ejercicio por su ID.
 * Backend: DELETE /rutina-ejercicios/{id}
 * Suele responder 204 No Content (sin body).
 */
export const eliminarRutinaEjercicio = async (id: number): Promise<void> => {
  try {
    const token = await getItem('token');
    await axios.delete(`${API_URL}/rutina-ejercicios/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    // Si tu backend devolviera {message, data}, podrías leer response.data aquí.
  } catch (error: any) {
    const msg =
      error?.response?.data?.message ??
      'Error al eliminar el ejercicio de la rutina';
    throw new Error(msg);
  }
};