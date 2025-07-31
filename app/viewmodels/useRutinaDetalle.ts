import { useEffect, useState } from 'react';
import { RutinaEjercicio } from '../models/RutinaEjercicio';
import { fetchEjerciciosPorRutina } from '../services/RutinaEjercicioService';

export default function useRutinaDetalleViewModel(rutinaId: number) {
  const [rutinaEjercicios, setRutinaEjercicios] = useState<RutinaEjercicio[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const load = async () => {
    try {
      setLoading(true);
      const data = await fetchEjerciciosPorRutina(rutinaId);
      setRutinaEjercicios(data);
      setError('');
    } catch (e: any) {
      setError(e.message ?? 'Error al cargar ejercicios');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [rutinaId]);

  return {
    rutinaEjercicios, // 🔄 Ahora contiene todo (objetivo, descanso, comentario y objeto ejercicio)
    loading,
    error,
    reload: load,
  };
}
