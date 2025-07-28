import { useEffect, useState } from 'react';
import { Rutina } from '../models/Rutina';
import { fetchRutinas } from '../services/RutinaService';

export default function useRutinasViewModel() {
  const [rutinas, setRutinas] = useState<Rutina[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const loadRutinas = async () => {
    try {
      setLoading(true);
      const data = await fetchRutinas();
      setRutinas(data);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRutinas();
  }, []);

  return { rutinas, loading, error, reload: loadRutinas };
}
