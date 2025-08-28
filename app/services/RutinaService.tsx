import axios from 'axios';
import { Rutina } from '../models/Rutina';
import { getItem } from '../utils/SecureStorage';

const API_URL = 'http://147.93.114.243:8080/api';

export const fetchRutinas = async (): Promise<Rutina[]> => {
  try {
    const token = await getItem('token');
    const response = await axios.get(`${API_URL}/rutinas`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    // El backend retorna { message: string, data: Rutina[] }
    return response.data.data;
  } catch (error: any) {
    const msg = error?.response?.data?.message ?? 'Error al obtener las rutinas';
    throw new Error(msg);
  }
};

export const fetchRutinaDetalle = async (id: number): Promise<Rutina> => {
  try {
    const token = await getItem('token');
    const response = await axios.get(`${API_URL}/rutinas/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    // El backend retorna { message: string, data: Rutina }
    return response.data.data;
  } catch (error: any) {
    const msg = error?.response?.data?.message ?? 'Error al obtener el detalle de la rutina';
    throw new Error(msg);
  }
};

export const deleteRutina = async (id: number): Promise<void> => {
  try {
    const token = await getItem('token');
    await axios.delete(`${API_URL}/rutinas/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
  } catch (error: any) {
    const msg = error?.response?.data?.message ?? 'Error al eliminar la rutina';
    throw new Error(msg);
  }
};

/**
 * Crear una nueva rutina
 * Por defecto las rutinas de cualquier entrenador se crean como privadas,
 * pero si se envía "publica" en el body el backend lo acepta.
 */
export const createRutina = async (input: {
  nombre: string;
  tipo?: 'publica' | 'privada';
}): Promise<Rutina> => {
  try {
    const token = await getItem('token');

    // Si no se pasa tipo, se fuerza a "privada"
    const payload = {
      nombre: input.nombre,
      tipo: input.tipo ?? 'privada',
    };

    const response = await axios.post(`${API_URL}/rutinas`, payload, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    // El backend retorna { message: string, data: Rutina }
    return response.data.data;
  } catch (error: any) {
    const msg = error?.response?.data?.message ?? 'Error al crear la rutina';
    throw new Error(msg);
  }
};

/**
 * Actualizar una rutina existente (nombre y tipo)
 */
export const updateRutina = async (
  id: number,
  patch: Partial<{ nombre: string; tipo: 'publica' | 'privada' }>
): Promise<Rutina> => {
  try {
    const token = await getItem('token');

    const response = await axios.put(`${API_URL}/rutinas/${id}`, patch, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    // El backend retorna { message: string, data: Rutina }
    return response.data.data;
  } catch (error: any) {
    const msg = error?.response?.data?.message ?? 'Error al actualizar la rutina';
    throw new Error(msg);
  }
};
