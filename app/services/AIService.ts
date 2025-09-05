// /services/AIService.ts
import axios, { AxiosError } from 'axios';
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
  'Calentamiento','Funcional','Abdominales','Pierna','Gluteo',
  'Espalda','Pecho','Hombro','Biceps','Triceps','Antebrazo'
] as const;
export type GrupoMuscular = typeof GRUPOS[number];

// ======== Tipos de solicitud ========
export type GenerarRutinaAIRequest = {
  objetivo: Objetivo;
  dia?: string;                     // opcional (backend usa hoy si falta)
  nivel: Nivel;
  grupoMuscular: GrupoMuscular[];   // multi-selección
  duracion: number;                 // 10..180
  atleta_id?: number;               // opcional (si un entrenador genera para otro)
};

// ======== Tipos de respuesta de éxito ========
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

export type PlannerCalcDebug = {
  objetivoEj?: number;
  series?: number;
  descanso?: number;
};
export type PlannerServiceDebug = {
  correlation_id?: string;
  calc?: PlannerCalcDebug;
  reparto?: Record<string, number>;
};

export type DebugAI = {
  planner_input?: any;
  violations?: string[];
  ai_plan?: Array<any> | null;
  razonamiento?: string;
  service_debug?: PlannerServiceDebug;
};

export type GenerarRutinaAIResponse = {
  message: string; // "Rutina AI generada correctamente"
  data: {
    rutina: Rutina;
    rutina_ejercicios: RutinaEjercicio[];
    explicacion_ai?: string | null;
  };
  // el backend también envía debug_ai en éxito
  debug_ai?: DebugAI;
};

// ======== Tipos de respuesta de error (backend) ========
export type BackendErrorResponse = {
  message?: string;
  error?: {
    message?: string;
    status?: number | null;
    body?: any;
  };
  debug_ai?: DebugAI;
};

// ======== Error enriquecido para MVVM/UI ========
export class AiServiceError extends Error {
  status?: number;
  body?: any;
  debugAI?: DebugAI;
  isBackend: boolean;

  constructor(msg: string, opts?: { status?: number; body?: any; debugAI?: DebugAI; isBackend?: boolean }) {
    super(msg);
    this.name = 'AiServiceError';
    this.status = opts?.status;
    this.body = opts?.body;
    this.debugAI = opts?.debugAI;
    this.isBackend = Boolean(opts?.isBackend);
  }

  get correlationId(): string | undefined {
    return this.debugAI?.service_debug?.correlation_id;
  }
}

// ======== Helper común ========
const authHeaders = async () => {
  const token = await getItem('token');
  if (!token) throw new AiServiceError('No se encontró un token de autenticación.', { isBackend: false });
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

// ======== Detectores & helpers para la VM ========
export const isGenerarRutinaAIResponse = (x: any): x is GenerarRutinaAIResponse =>
  x && typeof x === 'object' && 'data' in x && 'rutina' in x.data;

export const getCorrelationId = (x?: { debug_ai?: DebugAI } | AiServiceError): string | undefined => {
  if (!x) return undefined;
  if (x instanceof AiServiceError) return x.correlationId;
  return x.debug_ai?.service_debug?.correlation_id;
};

// Normaliza el error de Axios → AiServiceError enriquecido
const normalizeAxiosError = (err: AxiosError): AiServiceError => {
  const status = err.response?.status;
  const data = err.response?.data as BackendErrorResponse | string | undefined;

  // Backend envía JSON con { message, error?, debug_ai? }
  if (data && typeof data === 'object') {
    const be = data as BackendErrorResponse;
    const msg =
      be.message ||
      be.error?.message ||
      (typeof err.message === 'string' ? err.message : 'Fallo en la solicitud');
    return new AiServiceError(msg, {
      status: be.error?.status ?? status,
      body: be.error?.body,
      debugAI: be.debug_ai,
      isBackend: true,
    });
  }

  // Texto plano o sin respuesta (network, CORS, timeout)
  const fallbackMsg =
    typeof data === 'string'
      ? data
      : err.message || 'Error al generar la rutina con IA';
  return new AiServiceError(fallbackMsg, { status, body: data, isBackend: false });
};

// ======== Servicio AI ========
export const generarRutinaAI = async (
  payload: GenerarRutinaAIRequest
): Promise<GenerarRutinaAIResponse> => {
  const headers = await authHeaders();

  // Normalización mínima (el backend ya valida todo)
  const body: GenerarRutinaAIRequest = {
    ...payload,
    dia: ensureYMD(payload.dia),
  };

  try {
    const response = await axios.post(`${API_URL}/ai/rutinas`, body, { headers });

    // Éxito: 201 + { message, data: {...}, debug_ai? }
    const data = response.data as GenerarRutinaAIResponse;
    return data;
  } catch (e: any) {
    if (axios.isAxiosError(e)) {
      throw normalizeAxiosError(e);
    }
    // Error no Axios (throw, parsing, etc.)
    const msg = e?.message || 'Error inesperado en el cliente';
    throw new AiServiceError(msg, { isBackend: false });
  }
};

// ======== Helpers opcionales para la UI ========
export const mapToRutinaEjercicioList = (resp: GenerarRutinaAIResponse): RutinaEjercicio[] =>
  resp?.data?.rutina_ejercicios ?? [];

export const getNombreRutina = (resp: GenerarRutinaAIResponse): string =>
  resp?.data?.rutina?.nombre ?? 'Rutina IA';
