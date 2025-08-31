import { useCallback, useEffect, useMemo, useState } from 'react';
import type { Ejercicio } from '../models/Ejercicio';
import { deleteEjercicio, getAllEjercicios } from '../services/EjercicioService';
import { showAlert, showConfirm } from '../utils/AlertService';

export default function useEjercicioGestion() {
  const [ejercicios, setEjercicios] = useState<Ejercicio[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // filtros
  const [query, setQuery] = useState('');
  const [selectedGroup, setSelectedGroup] = useState<'Todos' | string>('Todos');

  const fetchEjercicios = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const data = await getAllEjercicios();
      setEjercicios(data);
    } catch (e: any) {
      const msg = e?.message ?? 'Error cargando ejercicios';
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEjercicios();
  }, [fetchEjercicios]);

  const onCreate = useCallback(() => {
    showAlert('Crear ejercicio', 'Abrir modal de creación (pendiente de implementar)');
  }, []);

  const onEdit = useCallback((ejercicio: Ejercicio) => {
    showAlert('Editar ejercicio', `Abrir modal para editar: ${ejercicio.nombre}`);
  }, []);

  const onDelete = useCallback((ejercicio: Ejercicio) => {
    showConfirm(
      'Eliminar ejercicio',
      `¿Seguro que deseas eliminar "${ejercicio.nombre}"?`,
      async () => {
        try {
          setLoading(true);
          await deleteEjercicio(ejercicio.id);
          await fetchEjercicios();
          showAlert('Eliminado', 'El ejercicio fue eliminado correctamente.');
        } catch (e: any) {
          const msg = e?.message ?? 'Error al eliminar el ejercicio';
          setError(msg);
          showAlert('Error', msg);
        } finally {
          setLoading(false);
        }
      }
    );
  }, [fetchEjercicios]);

  /** Utilitario para extraer el ID de YouTube */
  const getYoutubeId = useCallback((url: string): string => {
    const match = url?.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|v\/))([^&\n?#]+)/);
    return match?.[1] ?? '';
  }, []);

  // grupos únicos para el selector
  const grupos = useMemo(() => {
    const set = new Set<string>();
    ejercicios.forEach(e => e.grupoMuscular && set.add(e.grupoMuscular));
    return ['Todos', ...Array.from(set).sort((a, b) => a.localeCompare(b))];
  }, [ejercicios]);

  // filtro combinado por nombre y grupo
  const filteredEjercicios = useMemo(() => {
    const q = query.trim().toLowerCase();
    return ejercicios.filter(ej => {
      const matchNombre = q ? ej.nombre.toLowerCase().includes(q) : true;
      const matchGrupo = selectedGroup === 'Todos' ? true : ej.grupoMuscular === selectedGroup;
      return matchNombre && matchGrupo;
    });
  }, [ejercicios, query, selectedGroup]);

  return {
    ejercicios: filteredEjercicios,
    loading,
    error,
    fetchEjercicios,
    onCreate,
    onEdit,
    onDelete,
    getYoutubeId,

    // filtros UI
    query,
    setQuery,
    selectedGroup,
    setSelectedGroup,
    grupos,
  };
}
