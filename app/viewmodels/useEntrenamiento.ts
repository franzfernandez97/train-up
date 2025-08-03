import { useRoute } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import { Rutina } from '../models/Rutina';
import { RutinaEjercicio } from '../models/RutinaEjercicio';
import { fetchEjerciciosPorRutina } from '../services/RutinaEjercicioService';
import { fetchRutinaDetalle } from '../services/RutinaService';

export default function useEntrenamiento() {
  const route = useRoute<any>();
  const { rutinaId } = route.params;

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

  return {
    nombreRutina,
    ejercicios,
    loading,
    completados,
    toggleCompletar,
  };
}
