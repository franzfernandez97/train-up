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
