import axios from 'axios';
import { AtletaRutina } from '../models/AtletaRutina';
import { getItem } from '../utils/SecureStorage';

const API_URL = 'http://147.93.114.243:8080/api';

/**
 * Obtiene las rutinas asignadas para un día específico.
 * Si se pasa atletaId, filtra por ese atleta (modo entrenador).
 * Ejemplo de request:
 *   GET /atleta-rutinas?dia=2025-08-24&atleta_id=5
 */
export const getRutinasAsignadasPorDia = async (
  dia: string,
  atletaId?: number
): Promise<AtletaRutina[]> => {
  try {
    const token = await getItem('token');

    const response = await axios.get(`${API_URL}/atleta-rutinas`, {
      params: {
        dia,
        ...(typeof atletaId === 'number' ? { atleta_id: atletaId } : {}),
      },
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    const rutinas = response.data?.data;
    return Array.isArray(rutinas) ? rutinas : [];
  } catch (error) {
    console.error('Error al obtener rutina asignada por día:', error);
    return [];
  }
};

/**
 * Obtiene todas las rutinas asignadas.
 * Si se pasa atletaId, filtra por ese atleta (modo entrenador).
 * Ejemplo de request:
 *   GET /atleta-rutinas?atleta_id=5
 */
export const getTodasLasRutinasAsignadas = async (
  atletaId?: number
): Promise<AtletaRutina[]> => {
  try {
    const token = await getItem('token');

    const response = await axios.get(`${API_URL}/atleta-rutinas`, {
      params: {
        ...(typeof atletaId === 'number' ? { atleta_id: atletaId } : {}),
      },
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    const data = response.data?.data;
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error('Error al obtener todas las rutinas asignadas:', error);
    return [];
  }
};


/**
 * Crea una nueva asignación de rutina para un atleta.
 */
export const createAtletaRutina = async (
  atleta_id: number,
  rutina_id: number,
  dia: string,
  frecuencia: string = '1'
): Promise<void> => {
  try {
    const token = await getItem('token');

    await axios.post(
      `${API_URL}/atleta-rutinas`,
      { atleta_id, rutina_id, dia, frecuencia },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error: any) {
    const msg = error?.response?.data?.message ?? 'Error al crear la rutina asignada';
    console.error(msg);
    throw new Error(msg);
  }
};
