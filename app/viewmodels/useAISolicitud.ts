import { useState } from 'react';
import { GenerarRutinaAIRequest, GenerarRutinaAIResponse, generarRutinaAI } from '../services/AIService';

export default function useAISolicitud() {
  const [resultado, setResultado] = useState<GenerarRutinaAIResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const solicitarRutina = async (payload: GenerarRutinaAIRequest) => {
    setLoading(true);
    setError('');
    try {
      const data = await generarRutinaAI(payload);
      setResultado(data);
    } catch (e: any) {
      console.error('Error al generar la rutina AI:', e);
      setError(e?.message ?? 'Error al generar la rutina con IA.');
    } finally {
      setLoading(false);
    }
  };

  return { resultado, loading, error, solicitarRutina };
}
