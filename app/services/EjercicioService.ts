// /services/EjercicioService.ts
import axios from 'axios';
import { Ejercicio } from '../models/Ejercicio';
import { getItem } from '../utils/SecureStorage';

const API_URL = 'http://147.93.114.243:8080/api';

// ======== Tipos (DTOs) ========
export type CreateEjercicioDTO = {
  nombre: string;
  grupoMuscular: string;
  instrucciones: string;
  urlMedia: string;
};

export type UpdateEjercicioDTO = Partial<CreateEjercicioDTO>;

// ======== Helper común ========
const authHeaders = async () => {
  const token = await getItem('token');
  if (!token) throw new Error('No se encontró un token de autenticación.');
  return {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  };
};

// ======== EXISTENTES ========
export const getEjercicioById = async (id: number): Promise<Ejercicio | null> => {
  try {
    const headers = await authHeaders();
    const response = await axios.get(`${API_URL}/ejercicios/${id}`, { headers });
    return response.data?.data ?? null;
  } catch (error: any) {
    console.error('Error al obtener el ejercicio:', error);
    return null;
  }
};

export const getAllEjercicios = async (): Promise<Ejercicio[]> => {
  try {
    const headers = await authHeaders();
    const response = await axios.get(`${API_URL}/ejercicios`, { headers });
    // Backend: { message: string, data: Ejercicio[] }
    return response.data?.data ?? [];
  } catch (error: any) {
    const msg = error?.response?.data?.message ?? 'Error al obtener los ejercicios';
    throw new Error(msg);
  }
};

// ======== NUEVOS ========

// Crear ejercicio (POST /ejercicios)
export const createEjercicio = async (payload: CreateEjercicioDTO): Promise<Ejercicio> => {
  try {
    const headers = await authHeaders();
    const response = await axios.post(`${API_URL}/ejercicios`, payload, { headers });
    // Backend esperado: { message: string, data: Ejercicio }
    return response.data?.data as Ejercicio;
  } catch (error: any) {
    const msg = error?.response?.data?.message ?? 'Error al crear el ejercicio';
    throw new Error(msg);
  }
};

// Actualizar ejercicio (PUT /ejercicios/:id)
export const updateEjercicio = async (
  id: number,
  payload: UpdateEjercicioDTO
): Promise<Ejercicio> => {
  try {
    const headers = await authHeaders();
    const response = await axios.put(`${API_URL}/ejercicios/${id}`, payload, { headers });
    // Backend esperado: { message: string, data: Ejercicio }
    return response.data?.data as Ejercicio;
  } catch (error: any) {
    const msg = error?.response?.data?.message ?? 'Error al actualizar el ejercicio';
    throw new Error(msg);
  }
};

// Eliminar ejercicio (DELETE /ejercicios/:id)
export const deleteEjercicio = async (id: number): Promise<boolean> => {
  try {
    const headers = await authHeaders();
    await axios.delete(`${API_URL}/ejercicios/${id}`, { headers });
    // Si no lanza excepción, asumimos éxito
    return true;
  } catch (error: any) {
    const msg = error?.response?.data?.message ?? 'Error al eliminar el ejercicio';
    throw new Error(msg);
  }
};
