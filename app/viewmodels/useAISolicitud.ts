// /viewmodels/useAISolicitud.ts
import { useState } from 'react';
import {
  AiServiceError,
  generarRutinaAI,
  getCorrelationId,
  type DebugAI,
  type GenerarRutinaAIRequest,
  type GenerarRutinaAIResponse,
} from '../services/AIService';

type UISuccess = {
  response: GenerarRutinaAIResponse;
  correlationId?: string;
  debug?: DebugAI;
};

type UIError = {
  message: string;
  status?: number;
  correlationId?: string;
  debug?: DebugAI;
  body?: any;
  isBackend: boolean;
};

export default function useAISolicitud() {
  const [resultado, setResultado] = useState<UISuccess | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [errorObj, setErrorObj] = useState<UIError | null>(null);
  const [lastRequest, setLastRequest] = useState<GenerarRutinaAIRequest | null>(null);

  const clearError = () => setErrorObj(null);
  const clearAll = () => {
    setResultado(null);
    setErrorObj(null);
    setLastRequest(null);
  };

  const solicitarRutina = async (payload: GenerarRutinaAIRequest) => {
    setLoading(true);
    setErrorObj(null);
    setResultado(null);
    setLastRequest(payload);

    try {
      const resp = await generarRutinaAI(payload);

      setResultado({
        response: resp,
        correlationId: getCorrelationId(resp),
        debug: resp.debug_ai, // para el modal (violations, ai_plan, planner_input, etc.)
      });
    } catch (err) {
      const e = err as AiServiceError;

      setErrorObj({
        message: e.message,
        status: e.status,
        correlationId: e.correlationId,
        debug: e.debugAI,
        body: e.body,
        isBackend: e.isBackend,
      });
      // Mantén lastRequest para reproducir desde el modal si quieres
    } finally {
      setLoading(false);
    }
  };

  return {
    // estados principales
    resultado,        // { response, correlationId, debug }
    loading,
    error: errorObj,  // objeto rico para el modal

    // depuración
    lastRequest,      // útil para mostrar/copy JSON en el modal

    // acciones
    solicitarRutina,
    clearError,
    clearAll,
  };
}
