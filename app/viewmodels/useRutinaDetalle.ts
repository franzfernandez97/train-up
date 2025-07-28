import { useEffect, useState } from 'react';
import { Ejercicio } from '../models/Ejercicio';
import { fetchEjerciciosPorRutina } from '../services/RutinaEjercicioService';

export default function useRutinaDetalleViewModel(rutinaId: number) {
  const [ejercicios, setEjercicios] = useState<Ejercicio[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const load = async () => {
    try {
      setLoading(true);
      const data = await fetchEjerciciosPorRutina(rutinaId);
      setEjercicios(data);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [rutinaId]);

  return { ejercicios, loading, error, reload: load };
}
