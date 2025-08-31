// /services/AiService.ts
import axios from 'axios';
import { Ejercicio } from '../models/Ejercicio';
import { Rutina } from '../models/Rutina';
import { getItem } from '../utils/SecureStorage';

const API_URL = 'http://147.93.114.243:8080/api';

// ======== Enums/constantes compatibles con el backend ========
export const OBJETIVOS = ['fuerza','hipertrofia','resistencia','perdida grasa','movilidad'] as const;
export type Objetivo = typeof OBJETIVOS[number];

export const NIVELES = ['principiante','intermedio','avanzado'] as const;
export type Nivel = typeof NIVELES[number];

export const GRUPOS = [
  'Abdominales','Pierna','Gluteo',
  'Espalda','Pecho','Hombro','Biceps','Triceps','Antebrazo'
] as const;
export type GrupoMuscular = typeof GRUPOS[number];

// ======== Tipos de solicitud/respuesta ========
export type GenerarRutinaAIRequest = {
  objetivo: Objetivo;
  dia?: string;                       // opcional (backend usa hoy si falta)
  nivel: Nivel;
  grupoMuscular: GrupoMuscular[];     // multi-selección
  duracion: number;                   // 10..180
  atleta_id?: number;                 // opcional (si un entrenador genera para otro)
};

export type RutinaEjercicio = {
  id: number;
  rutina_id: number;
  ejercicio_id: number;
  seriesObjetivo: number;
  repObjetivo: number;
  descanso: number;
  comentario: string | null;
  created_at: string;
  updated_at: string;
  ejercicio: Ejercicio;
};

export type GenerarRutinaAIResponse = {
  message: string; // "Rutina AI generada correctamente"
  data: {
    rutina: Rutina;                     // incluye ejercicios: Ejercicio[]
    rutina_ejercicios: RutinaEjercicio[];
    explicacion_ai?: string | null;
  };
};

// ======== Helper común (idéntico patrón) ========
const authHeaders = async () => {
  const token = await getItem('token');
  if (!token) throw new Error('No se encontró un token de autenticación.');
  return {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
    Accept: 'application/json',
  };
};

// ======== Utilidad mínima ========
const ensureYMD = (d?: string) => {
  if (!d) return undefined;
  if (/^\d{4}-\d{2}-\d{2}$/.test(d)) return d;
  const dt = new Date(d);
  if (isNaN(dt.getTime())) return undefined;
  const yyyy = dt.getFullYear();
  const mm = String(dt.getMonth() + 1).padStart(2, '0');
  const dd = String(dt.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
};

// ======== Servicio AI ========
export const generarRutinaAI = async (
  payload: GenerarRutinaAIRequest
): Promise<GenerarRutinaAIResponse> => {
  try {
    const headers = await authHeaders();

    // Normalización mínima (el backend ya valida todo)
    const body: GenerarRutinaAIRequest = {
      ...payload,
      dia: ensureYMD(payload.dia),
    };

    const response = await axios.post(`${API_URL}/ai/rutinas`, body, { headers });
    // Backend: 201 + { message, data: { rutina, rutina_ejercicios, explicacion_ai } }
    return response.data as GenerarRutinaAIResponse;
  } catch (error: any) {
    const msg =
      error?.response?.data?.message ??
      (typeof error?.response?.data === 'string' ? error.response.data : null) ??
      'Error al generar la rutina con IA';
    throw new Error(msg);
  }
};

// ======== Helpers opcionales para la UI ========
export const mapToRutinaEjercicioList = (resp: GenerarRutinaAIResponse): RutinaEjercicio[] =>
  resp?.data?.rutina_ejercicios ?? [];

export const getNombreRutina = (resp: GenerarRutinaAIResponse): string =>
  resp?.data?.rutina?.nombre ?? 'Rutina IA';
