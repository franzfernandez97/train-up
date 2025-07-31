import axios from 'axios';
import { RutinaEjercicio } from '../models/RutinaEjercicio';
import { getItem } from '../utils/SecureStorage';

const API_URL = 'http://147.93.114.243:8080/api';


/**
 * Obtiene los ejercicios asociados a una rutina específica.
 * @param rutinaId ID de la rutina
 * @returns Lista de RutinaEjercicio
 */
export const fetchEjerciciosPorRutina = async (
  rutinaId: number
): Promise<RutinaEjercicio[]> => {
  try {
    const token = await getItem('token');
    const response = await axios.get(`${API_URL}/rutina-ejercicios/rutina/${rutinaId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    // La respuesta del backend es { message: string, data: RutinaEjercicio[] }
    return response.data.data;
  } catch (error: any) {
    const msg =
      error?.response?.data?.message ??
      'Error al obtener los ejercicios de la rutina';
    throw new Error(msg);
  }
};