// /viewmodels/useEntrenamiento.ts
import { useRoute } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Rutina } from '../models/Rutina';
import { RutinaEjercicio } from '../models/RutinaEjercicio';
import {
  EjercicioSeriesPayload,
  finalizarEntrenamiento,
} from '../services/EntrenamientoService';
import { fetchEjerciciosPorRutina } from '../services/RutinaEjercicioService';
import { fetchRutinaDetalle } from '../services/RutinaService';

type MarcaInputs = Record<number, { repeticiones: string; peso: string; comentario?: string }[]>;

export default function useEntrenamiento() {
  const route = useRoute<any>();
  const { rutinaId } = route.params;

  const { user } = useAuth();
  const [nombreRutina, setNombreRutina] = useState('');
  const [ejercicios, setEjercicios] = useState<RutinaEjercicio[]>([]);
  const [loading, setLoading] = useState(true);
  const [completados, setCompletados] = useState<number[]>([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);

        // 1. Obtener nombre de la rutina
        const rutina: Rutina = await fetchRutinaDetalle(rutinaId);
        setNombreRutina(rutina.nombre);

        // 2. Obtener ejercicios de la rutina
        const ejerciciosData: RutinaEjercicio[] = await fetchEjerciciosPorRutina(rutinaId);
        setEjercicios(ejerciciosData);
      } catch (error) {
        console.error('Error al cargar datos del entrenamiento:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [rutinaId]);

  const toggleCompletar = (id: number) => {
    setCompletados((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  // Construye el payload esperado por el servicio a partir del estado "marcas" de la vista
   const buildPayload = (marcas: MarcaInputs): EjercicioSeriesPayload[] => {
    const payload: EjercicioSeriesPayload[] = [];

    ejercicios.forEach((item) => {
      const ejercicioIdReal = item.ejercicio.id;   // id real en BD
      const key = item.id;                         // id de RutinaEjercicio
      const seriesObjetivo = item.seriesObjetivo;  // cuántas series se esperaban
      let filas = marcas[key] ?? [];

      // ✅ Si el usuario no ingresó nada, crear N filas por defecto en "0"
      if (filas.length === 0) {
        filas = Array.from({ length: seriesObjetivo }, () => ({
          repeticiones: '0',
          peso: '0',
          comentario: '', // opcional
        }));
      }

      payload.push({
        ejercicio_id: ejercicioIdReal,
        series: filas
          .map((f) => ({
            repeticiones: f.repeticiones?.trim() || '0',
            peso: f.peso?.trim() || '0',
            comentario: f.comentario ?? '',
          }))
          // 👇 descartar series con repeticiones == 0
          .filter((f) => {
            const n = Number(String(f.repeticiones).replace(/[^0-9.-]/g, ''));
            return Number.isFinite(n) && n > 0; // solo > 0 pasan
          }),
      });
    });

    return payload;
  };

  const handleFinalizar = async (marcas: MarcaInputs) => {
    if (!user?.id) {
      throw new Error('Debes iniciar sesión nuevamente.');
    }

    // ✅ A partir de ahora, siempre habrá payload (porque generamos por defecto)
    const ejerciciosPayload = buildPayload(marcas);

    const resp = await finalizarEntrenamiento({
      atleta_id: user.id,
      ejercicios: ejerciciosPayload,
    });

    return resp; // { ok: true, resumen }
  };

  return {
    nombreRutina,
    ejercicios,
    loading,
    completados,
    toggleCompletar,
    handleFinalizar, // <- expuesto
  };
}