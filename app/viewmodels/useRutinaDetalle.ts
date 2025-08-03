import { useEffect, useState } from 'react';
import { RutinaEjercicio } from '../models/RutinaEjercicio';
import { createAtletaRutina } from '../services/AtletaRutinaService';
import { fetchEjerciciosPorRutina } from '../services/RutinaEjercicioService';
import { getItem } from '../utils/SecureStorage';

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

  /**
   * Inicia el entrenamiento creando la entrada en AtletaRutina
   * @param fechaISO Fecha en formato 'YYYY-MM-DD'. Si no se pasa, se toma la fecha actual.
   */
  const iniciarEntrenamiento = async (fechaISO?: string) => {
    try {
      console.log("Fecha ISO:",fechaISO);
      const userString = await getItem('user');
      if (!userString) throw new Error('Usuario no autenticado');

      const user = JSON.parse(userString);
      const atletaId = user.id;

      const dia = fechaISO ?? new Date().toISOString().split('T')[0];
      console.log("dia:",dia)
      await createAtletaRutina(atletaId, rutinaId, dia, '1');
    } catch (e: any) {
      throw new Error(e.message ?? 'Error al iniciar entrenamiento');
    }
  };

  return {
    rutinaEjercicios,
    loading,
    error,
    reload: load,
    iniciarEntrenamiento, // ✅ ahora con soporte para fecha personalizada
  };
}
