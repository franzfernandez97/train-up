import { useEffect, useState } from 'react';
import { Ejercicio } from '../models/Ejercicio';
import { getEjercicioById } from '../services/EjercicioService';

export default function useEjercicio(ejercicioId: number) {
  const [ejercicio, setEjercicio] = useState<Ejercicio | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchEjercicio = async () => {
      try {
        const data = await getEjercicioById(ejercicioId);
        if (data) {
          setEjercicio(data);
        } else {
          setError('No se encontró el ejercicio.');
        }
      } catch (e) {
        setError('Error al cargar el ejercicio.');
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    fetchEjercicio();
  }, [ejercicioId]);

  return { ejercicio, loading, error };
}
