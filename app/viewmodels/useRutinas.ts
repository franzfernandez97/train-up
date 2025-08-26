import { useEffect, useState } from 'react';
import { Rutina } from '../models/Rutina';
import { fetchRutinas } from '../services/RutinaService';

export default function useRutinasViewModel(atletaId?: number) {
  const [rutinas, setRutinas] = useState<Rutina[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const loadRutinas = async () => {
    try {
      setLoading(true);
      // Si en el futuro necesitas filtrar por atletaId, ajusta fetchRutinas(atletaId)
      const data = await fetchRutinas();
      setRutinas(data);
    } catch (e: any) {
      setError(e.message ?? 'Error al cargar rutinas');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRutinas();
    // reintenta si cambia el atleta en modo entrenador (por si luego filtras en el service)
  }, [atletaId]);

  return { rutinas, loading, error, reload: loadRutinas };
}
