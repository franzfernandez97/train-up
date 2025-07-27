import { useEffect, useState } from 'react';
import { AtletaRutina } from '../models/AtletaRutina';
import { getRutinasAsignadasPorDia } from '../services/AtletaRutinaService';

export default function useAtletaRutinasDelDia() {
  const [rutinas, setRutinas] = useState<AtletaRutina[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  const fetchData = async () => {
    try {
      const hoy = new Date().toISOString().slice(0, 10);
      const data = await getRutinasAsignadasPorDia(hoy);
      console.log('API result:', data);
      setRutinas(data);
    } catch (e) {
      console.error('Error al cargar rutinas del día:', e);
    } finally {
      setLoading(false); // <- asegúrate de que esto SIEMPRE ocurra
    }
  };

  fetchData();
}, []);


  return { rutinas, loading };
}
