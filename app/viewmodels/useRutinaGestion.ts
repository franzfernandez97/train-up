import { useEffect, useState } from 'react';
import type { Ejercicio } from '../models/Ejercicio';
import type { Rutina } from '../models/Rutina';
import {
  createRutina as apiCreateRutina,
  deleteRutina as apiDeleteRutina,
  updateRutina as apiUpdateRutina,
  fetchRutinas,
} from '../services/RutinaService';
import { showAlert, showConfirm } from '../utils/AlertService';
import { getItem } from '../utils/SecureStorage';

type RutinaCreateInput = { nombre: string; tipo?: 'publica' | 'privada' };
type RutinaUpdatePatch = Partial<{ nombre: string; tipo: 'publica' | 'privada' }>;

/**
 * ViewModel de gestión de rutinas.
 * Siempre sincroniza la UI con el backend vía reload (sin optimistic UI).
 */
export default function useRutinaGestion() {
  const [rutinas, setRutinas] = useState<Rutina[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  // Entrenador actual (desde SecureStorage)
  async function getEntrenadorId(): Promise<number> {
    const userStr = await getItem('user');
    if (!userStr) return 0;
    try {
      const user = JSON.parse(userStr);
      return Number(user?.id) || 0;
    } catch {
      return 0;
    }
  }

  // Cargar rutinas existentes (desde service) y mapear a modelo estricto
  const load = async () => {
    try {
      setLoading(true);
      const entrenador_id = await getEntrenadorId();

      const data: any[] = await fetchRutinas();

      const nowIso = new Date().toISOString();
      const mapped: Rutina[] = (data ?? []).map((r: any) => ({
        id: Number(r?.id),
        nombre: String(r?.nombre ?? 'Rutina'),
        tipo: r?.tipo === 'publica' || r?.tipo === 'privada' ? r.tipo : 'privada',
        entrenador_id: Number(r?.entrenador_id ?? entrenador_id),
        created_at: String(r?.created_at ?? nowIso),
        updated_at: String(r?.updated_at ?? nowIso),
        ejercicios: Array.isArray(r?.ejercicios) ? (r.ejercicios as Ejercicio[]) : [],
      }));

      setRutinas(mapped);
      setError('');
    } catch (e: any) {
      setError(e?.message ?? 'Error al cargar rutinas');
      setRutinas([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  // Crear (sin optimistic): llama API y recarga
  const createRutina = async (input: RutinaCreateInput) => {
    try {
      setLoading(true);
      if (!input?.nombre?.trim()) {
        throw new Error('El nombre de la rutina es obligatorio');
      }
      // Si no se indica tipo, el service lo fuerza a "privada"
      await apiCreateRutina({ nombre: input.nombre.trim(), tipo: input.tipo });
      showAlert('Rutina creada', 'La rutina se creó correctamente.');
    } catch (e: any) {
      const msg = e?.message ?? 'No se pudo crear la rutina';
      setError(msg);
      showAlert('Error', msg);
    } finally {
      await load(); // 🔁 siempre recarga para quedar en sync
    }
  };

  // Actualizar (sin optimistic): llama API y recarga
  const updateRutina = async (id: number, patch: RutinaUpdatePatch) => {
    try {
      setLoading(true);
      if (patch?.nombre !== undefined && !patch.nombre.trim()) {
        throw new Error('El nombre no puede estar vacío');
      }
      await apiUpdateRutina(id, patch);
      showAlert('Rutina actualizada', 'La rutina se actualizó correctamente.');
    } catch (e: any) {
      const msg = e?.message ?? 'No se pudo actualizar la rutina';
      setError(msg);
      showAlert('Error', msg);
    } finally {
      await load(); // 🔁 recarga después de la operación
    }
  };

  // Eliminar (sin optimistic): confirma → llama API → recarga
  const deleteRutina = async (id: number) => {
    showConfirm(
      'Eliminar rutina',
      '¿Estás seguro de que deseas eliminar esta rutina? Esta acción no se puede deshacer.',
      async () => {
        try {
          setLoading(true);
          await apiDeleteRutina(id);
          showAlert('Rutina eliminada', 'La rutina se eliminó correctamente.');
        } catch (e: any) {
          const msg = e?.message ?? 'No se pudo eliminar la rutina';
          setError(msg);
          showAlert('Error', msg);
        } finally {
          await load(); // 🔁 recarga tras el delete
        }
      }
    );
  };

  return {
    rutinas,
    loading,
    error,
    reload: load,
    createRutina,
    updateRutina,
    deleteRutina,
  };
}
