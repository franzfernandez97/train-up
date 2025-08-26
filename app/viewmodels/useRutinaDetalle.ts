import { useEffect, useState } from 'react';
import { RutinaEjercicio } from '../models/RutinaEjercicio';
import { createAtletaRutina } from '../services/AtletaRutinaService'; // firma posicional
import { fetchEjerciciosPorRutina } from '../services/RutinaEjercicioService';
import { getItem } from '../utils/SecureStorage';

function toYMDLocal(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

/**
 * Hook de detalle de rutina.
 * @param rutinaId  Id de la rutina.
 * @param atletaId  (opcional) Id del atleta (modo entrenador).
 *                  Si no se pasa, se usará el id del usuario autenticado (modo atleta).
 */
export default function useRutinaDetalleViewModel(rutinaId: number, atletaId?: number) {
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
      setError(e?.message ?? 'Error al cargar ejercicios');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [rutinaId]);

  /**
   * Crea/inicia el entrenamiento:
   * - Prioriza `atletaIdOverride` si se pasa en la llamada.
   * - Si no, usa el `atletaId` recibido en el hook.
   * - Si tampoco hay, usa el id del usuario autenticado (modo atleta).
   * @param fechaISO YYYY-MM-DD (opcional). Si no, usa la fecha local de hoy.
   * @param atletaIdOverride Id de atleta para forzar en esta llamada (opcional).
   */
  const iniciarEntrenamiento = async (fechaISO?: string, atletaIdOverride?: number) => {
    try {
      // Resolver ID efectivo de atleta
      let effectiveAtletaId = atletaIdOverride ?? atletaId;

      if (typeof effectiveAtletaId !== 'number') {
        const userString = await getItem('user');
        if (!userString) throw new Error('Usuario no autenticado');
        const user = JSON.parse(userString);
        effectiveAtletaId = user?.id;
      }

      if (typeof effectiveAtletaId !== 'number') {
        throw new Error('No se pudo determinar el atleta para crear el entrenamiento.');
      }

      const dia = fechaISO ?? toYMDLocal(new Date());
      await createAtletaRutina(effectiveAtletaId, rutinaId, dia, '1'); // ← servicio posicional
    } catch (e: any) {
      throw new Error(e?.message ?? 'Error al iniciar/crear entrenamiento');
    }
  };

  return {
    rutinaEjercicios,
    loading,
    error,
    reload: load,
    iniciarEntrenamiento, // acepta (fechaISO?, atletaIdOverride?)
  };
}
