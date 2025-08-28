import { useEffect, useMemo, useState } from 'react';
import type { Ejercicio } from '../models/Ejercicio';
import type { RutinaEjercicio } from '../models/RutinaEjercicio';
import { getAllEjercicios } from '../services/EjercicioService';
import {
  actualizarRutinaEjercicio,
  crearRutinaEjercicio,
  eliminarRutinaEjercicio,
  fetchEjerciciosPorRutina,
} from '../services/RutinaEjercicioService';
import { showAlert } from '../utils/AlertService';

export default function useRutinaEjercicios(rutinaId: number | null) {
  // ─────────────────────────────────────────────────────────────────────────────
  // Estado: catálogo de ejercicios (para combo/búsqueda)
  // ─────────────────────────────────────────────────────────────────────────────
  const [ejercicios, setEjercicios] = useState<Ejercicio[]>([]);
  const [q, setQ] = useState('');
  const [loadingEjercicios, setLoadingEjercicios] = useState(false);

  // ─────────────────────────────────────────────────────────────────────────────
  // Estado: relaciones RutinaEjercicio de la rutina actual
  // ─────────────────────────────────────────────────────────────────────────────
  const [rutinaEjercicios, setRutinaEjercicios] = useState<RutinaEjercicio[]>([]);
  const [loadingRutina, setLoadingRutina] = useState(false);

  // Selección para agregar
  const [selectedEjercicioId, setSelectedEjercicioId] = useState<number | null>(null);

  // ─────────────────────────────────────────────────────────────────────────────
  // Cargar catálogo de ejercicios
  // ─────────────────────────────────────────────────────────────────────────────
  const loadEjercicios = async () => {
    try {
      setLoadingEjercicios(true);
      const all = await getAllEjercicios();
      setEjercicios(all);
    } catch (e: any) {
      showAlert('Error', e?.message ?? 'No se pudieron cargar los ejercicios');
      setEjercicios([]);
    } finally {
      setLoadingEjercicios(false);
    }
  };

  // ─────────────────────────────────────────────────────────────────────────────
  // Cargar relaciones de la rutina (uso puntual o pull-to-refresh)
  // ─────────────────────────────────────────────────────────────────────────────
  const loadRutina = async () => {
    if (!rutinaId) return;
    try {
      setLoadingRutina(true);
      const list = await fetchEjerciciosPorRutina(rutinaId);
      setRutinaEjercicios(list);
    } catch (e: any) {
      showAlert('Error', e?.message ?? 'No se pudieron cargar los ejercicios de la rutina');
      setRutinaEjercicios([]);
    } finally {
      setLoadingRutina(false);
    }
  };

  // ─────────────────────────────────────────────────────────────────────────────
  // Filtrado local para combo/búsqueda
  // ─────────────────────────────────────────────────────────────────────────────
  const filteredEjercicios = useMemo(() => {
    if (!q.trim()) return ejercicios;
    const term = q.toLowerCase();
    return ejercicios.filter(
      (e) =>
        e.nombre.toLowerCase().includes(term) ||
        e.grupoMuscular.toLowerCase().includes(term)
    );
  }, [q, ejercicios]);

  // ─────────────────────────────────────────────────────────────────────────────
  // Agregar ejercicio a la rutina
  // 👉 IMPORTANTE: el backend no devuelve el objeto "ejercicio" expandido;
  // por eso, tras crear, recargamos la lista para que la tarjeta muestre el nombre real.
  // ─────────────────────────────────────────────────────────────────────────────
  const addSelectedEjercicio = async () => {
    if (!rutinaId || !selectedEjercicioId) return;
    try {
      await crearRutinaEjercicio({
        rutina_id: rutinaId,
        ejercicio_id: selectedEjercicioId,
        seriesObjetivo: 4,
        repObjetivo: 10,
        descanso: 60, // seg
        comentario: null,
      });

      await loadRutina(); // 🔁 reload para traer el "ejercicio" expandido (nombre visible)
      setSelectedEjercicioId(null);
      showAlert('Ejercicio agregado', 'El ejercicio fue agregado a la rutina.');
    } catch (e: any) {
      showAlert('Error', e?.message ?? 'No se pudo agregar el ejercicio');
    }
  };

  // ─────────────────────────────────────────────────────────────────────────────
  // Guardar cambios de una tarjeta (SIN reload: reemplaza sólo ese item)
  // Devuelve el elemento actualizado para que la tarjeta pueda reflejar estado.
  // ─────────────────────────────────────────────────────────────────────────────
  const saveRutinaEjercicio = async (re: RutinaEjercicio): Promise<RutinaEjercicio> => {
    try {
      const updated = await actualizarRutinaEjercicio(re.id, {
        rutina_id: re.rutina_id,
        ejercicio_id: re.ejercicio_id,
        seriesObjetivo: re.seriesObjetivo,
        repObjetivo: re.repObjetivo,
        descanso: re.descanso, // el service normaliza a number
        comentario: re.comentario ?? null,
      });
      // 🔁 merge local: no hacemos reload para no perder inputs de otras tarjetas
      setRutinaEjercicios((prev) =>
        prev.map((x) => (x.id === updated.id ? updated : x))
      );
      return updated;
    } catch (e: any) {
      showAlert('Error', e?.message ?? 'No se pudo guardar el ejercicio');
      throw e;
    }
  };

  // ─────────────────────────────────────────────────────────────────────────────
  // Eliminar relación RutinaEjercicio (SIN reload: filtramos localmente)
  // ─────────────────────────────────────────────────────────────────────────────
  const removeRutinaEjercicio = async (id: number): Promise<void> => {
    try {
      await eliminarRutinaEjercicio(id);
      setRutinaEjercicios((prev) => prev.filter((x) => x.id !== id));
    } catch (e: any) {
      showAlert('Error', e?.message ?? 'No se pudo quitar el ejercicio de la rutina');
      throw e;
    }
  };

  // ─────────────────────────────────────────────────────────────────────────────
  // Efectos iniciales / cuando cambia la rutina
  // ─────────────────────────────────────────────────────────────────────────────
  useEffect(() => {
    loadEjercicios();
  }, []);

  useEffect(() => {
    loadRutina();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rutinaId]);

  // ─────────────────────────────────────────────────────────────────────────────
  // Exposición del hook
  // ─────────────────────────────────────────────────────────────────────────────
  return {
    // catálogo / búsqueda
    ejercicios,
    filteredEjercicios,
    q,
    setQ,
    selectedEjercicioId,
    setSelectedEjercicioId,
    loadingEjercicios,

    // relaciones de la rutina
    rutinaEjercicios,
    loadingRutina,
    reloadRutina: loadRutina,

    // acciones
    addSelectedEjercicio,     // ← crea + reload (para ver nombre real)
    saveRutinaEjercicio,      // ← NO reload
    removeRutinaEjercicio,    // ← NO reload
  };
}
