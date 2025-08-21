// /services/EntrenamientoService.ts
import axios from 'axios';
import { getItem } from '../utils/SecureStorage';

const API_URL = 'http://147.93.114.243:8080/api';

// Si ya tienes modelos formales para Serie / Marca, impórtalos aquí.
// Por ahora tipamos lo mínimo necesario para el flujo de finalización.
export interface SerieInputUI {
  repeticiones: string; // viene como string desde los TextInput
  peso: string;         // viene como string desde los TextInput
  comentario?: string;  // opcional
}

export interface EjercicioSeriesPayload {
  ejercicio_id: number;         // id real del ejercicio en BD
  series: SerieInputUI[];       // el índice representa la serie (1-based al enviar)
}

export interface FinalizarEntrenamientoParams {
  atleta_id: number;            // id del atleta autenticado
  ejercicios: EjercicioSeriesPayload[];
}

// Helper para números seguros desde inputs
const toNumber = (v: string): number => {
  const cleaned = String(v ?? '').replace(/[^0-9.-]/g, '');
  const n = Number(cleaned);
  return Number.isFinite(n) ? n : 0;
};

/**
 * POST /marcas-personales → retorna id de la marca creada
 */
async function crearMarcaPersonal(
  token: string,
  atleta_id: number,
  ejercicio_id: number
): Promise<number> {
  try {
    const res = await axios.post(
      `${API_URL}/marcas-personales`,
      { atleta_id, ejercicio_id },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    // El endpoint retorna { message: string, data: { id: number, ... } }
    const id = res?.data?.data?.id;
    if (!id) throw new Error('La respuesta de /marcas-personales no contiene id.');
    return id;
  } catch (error: any) {
    const msg =
      error?.response?.data?.message ||
      `Error creando marca personal (ejercicio_id=${ejercicio_id}).`;
    throw new Error(msg);
  }
}

/**
 * POST /series → crea una fila de serie asociada a la marca
 */
async function crearSerie(
  token: string,
  params: {
    marca_personal_id: number;
    indexSerie: number; // 1-based
    repeticiones: number;
    valor: number; // peso/tiempo/etc
    comentario?: string;
  }
): Promise<void> {
  try {
    await axios.post(
      `${API_URL}/series`,
      {
        serie: params.indexSerie,
        repeticiones: params.repeticiones,
        valor: params.valor,
        comentario: params.comentario ?? '',
        marca_personal_id: params.marca_personal_id,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error: any) {
    const msg =
      error?.response?.data?.message ||
      `Error creando serie #${params.indexSerie} (marca_personal_id=${params.marca_personal_id}).`;
    throw new Error(msg);
  }
}

/**
 * Finaliza el entrenamiento creando:
 *  - 1 marca personal por ejercicio
 *  - N series por cada marca (según lo ingresado por el usuario)
 *
 * Retorna un resumen por ejercicio con marca creada y número de series insertadas.
 */
export async function finalizarEntrenamiento(params: FinalizarEntrenamientoParams) {
  const token = await getItem('token');
  if (!token) throw new Error('Token no encontrado. Debes iniciar sesión nuevamente.');

  const resumen: Array<{
    ejercicio_id: number;
    marca_personal_id: number;
    seriesCreadas: number;
  }> = [];

  // Secuencial por ejercicio (asegura orden y manejo claro de errores)
  for (const ej of params.ejercicios) {
    // 1) Crear la marca del ejercicio
    const marcaId = await crearMarcaPersonal(token, params.atleta_id, ej.ejercicio_id);

    // 2) Crear todas las series (en paralelo por ejercicio)
    const tareas = ej.series.map((s, idx) =>
      crearSerie(token, {
        marca_personal_id: marcaId,
        indexSerie: idx + 1,
        repeticiones: toNumber(s.repeticiones),
        valor: toNumber(s.peso),
        comentario: s.comentario ?? '',
      })
    );

    await Promise.all(tareas);

    resumen.push({
      ejercicio_id: ej.ejercicio_id,
      marca_personal_id: marcaId,
      seriesCreadas: ej.series.length,
    });
  }

  return { ok: true, resumen } as const;
}