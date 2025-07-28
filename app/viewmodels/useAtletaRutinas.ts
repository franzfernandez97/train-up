import { useEffect, useState } from 'react';
import { AtletaRutina } from '../models/AtletaRutina';
import { getRutinasAsignadasPorDia } from '../services/AtletaRutinaService';

export default function useAtletaRutinas() {
  const [rutinas, setRutinas] = useState<AtletaRutina[]>([]);
  const [loading, setLoading] = useState(true);

  function getLocalDateString(): string {
    const today = new Date();
    const year = today.getFullYear();
    const month = (today.getMonth() + 1).toString().padStart(2, '0');
    const day = today.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const hoy = getLocalDateString();
        const data = await getRutinasAsignadasPorDia(hoy);
        setRutinas(data);
      } catch (e) {
        console.error('Error al cargar rutinas del día:', e);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);


  return { rutinas, loading };
}
