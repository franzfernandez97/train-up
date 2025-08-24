import { useCallback, useEffect, useState } from 'react';
import type { AtletaEntrenador } from '../models/AtletaEntrenador';
import type { User } from '../models/User';
import { getUsuariosRelacionados } from '../services/AtletaEntrenadorService';
import { getEstadoRutinaHoy } from '../services/EstadoRutinaService';
import { showAlert } from '../utils/AlertService';

export interface AtletaRel {
  id: number;            // id de la fila en la lista
  atleta_id: number;     // id del atleta
  nombre: string;
  estado: string;        // ← TEXTO original de la API (p.ej., "Rutina asignada")
}

// type-guard: ¿es relación con atleta anidado?
function esRelacion(x: any): x is AtletaEntrenador {
  return x && typeof x === 'object' && ('atleta' in x || 'atleta_id' in x);
}

// Mapea la lista base (sin estado) desde Users planos o relaciones
function mapBase(items: (User | AtletaEntrenador)[]): AtletaRel[] {
  return (items ?? []).map((it) => {
    if (esRelacion(it)) {
      const nombre = it.atleta?.name ?? `Atleta #${it.atleta_id}`;
      return { id: it.id ?? it.atleta_id, atleta_id: it.atleta_id, nombre, estado: '' };
    } else {
      const u = it as User;
      const nombre = u.name ?? `Atleta #${u.id}`;
      return { id: u.id, atleta_id: u.id, nombre, estado: '' };
    }
  });
}

export default function useHomeEntrenador() {
  const [atletas, setAtletas] = useState<AtletaRel[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    let mounted = true;
    try {
      setLoading(true);

      // 1) Obtener los atletas (actualmente tu endpoint responde User[])
      const items = await getUsuariosRelacionados();
      console.groupCollapsed('[HomeEntrenador] /usuarios-relacionados');
      console.log('Cantidad:', items?.length);
      console.log('Ejemplo:', items?.[0]);
      console.groupEnd();

      // 2) Mapa base
      const base = mapBase(items);

      // 3) Traer estado del día por atleta (en paralelo) y conservar el texto original
      const resultados = await Promise.allSettled(
        base.map(async (a) => {
          const est = await getEstadoRutinaHoy(a.atleta_id);
          return { atleta_id: a.atleta_id, estado: est.estado }; // ← sin normalizar
        })
      );

      // 4) Combinar base + estado (si falla alguno, dejamos "Sin datos")
      const estadoPorId = new Map<number, string>();
      resultados.forEach((r) => {
        if (r.status === 'fulfilled') {
          estadoPorId.set(r.value.atleta_id, r.value.estado);
        }
      });

      const conEstado = base.map((a) => ({
        ...a,
        estado: estadoPorId.get(a.atleta_id) ?? 'Sin datos',
      }));

      if (mounted) setAtletas(conEstado);
    } catch (e) {
      console.error('[HomeEntrenador] fetchData ERROR:', e);
      showAlert('Error', 'No se pudieron cargar los atletas o su estado.');
      if (mounted) setAtletas([]);
    } finally {
      if (mounted) setLoading(false);
    }
    return () => { mounted = false; };
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const refresh = () => fetchData();

  return { atletas, loading, refresh };
}
