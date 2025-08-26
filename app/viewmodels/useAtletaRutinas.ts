import { useCallback, useEffect, useState } from 'react';
import { AtletaRutina } from '../models/AtletaRutina';
import { getRutinasAsignadasPorDia } from '../services/AtletaRutinaService';

export default function useAtletaRutinas(atletaId?: number) {
  const [rutinas, setRutinas] = useState<AtletaRutina[]>([]);
  const [loading, setLoading] = useState(true);

  function getLocalDateString(): string {
    const today = new Date();
    const year = today.getFullYear();
    const month = (today.getMonth() + 1).toString().padStart(2, '0');
    const day = today.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  const fetchData = useCallback(async () => {
    let mounted = true;
    try {
      setLoading(true);
      const hoy = getLocalDateString();
      const data = await getRutinasAsignadasPorDia(hoy, atletaId); // ← atletaId opcional
      if (mounted) setRutinas(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error('Error al cargar rutinas del día:', e);
      if (mounted) setRutinas([]);
    } finally {
      if (mounted) setLoading(false);
    }
    return () => {
      mounted = false;
    };
  }, [atletaId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const refresh = () => fetchData();

  return { rutinas, loading, refresh };
}
