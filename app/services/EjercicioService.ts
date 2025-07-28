import axios from 'axios';
import { Ejercicio } from '../models/Ejercicio';
import { getItem } from '../utils/SecureStorage';

const API_URL = 'http://147.93.114.243:8080/api';

export const getEjercicioById = async (id: number): Promise<Ejercicio | null> => {
  try {
    const token = await getItem('token');
    const response = await axios.get(`${API_URL}/ejercicios/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    return response.data.data ?? null
  } catch (error) {
    console.error('Error al obtener el ejercicio:', error);
    return null;
  }
};
