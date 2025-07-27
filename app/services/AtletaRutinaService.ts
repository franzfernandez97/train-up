import axios from 'axios';
import { AtletaRutina } from '../models/AtletaRutina';
import { getItem } from '../utils/SecureStorage';

const API_URL = 'http://147.93.114.243:8080/api';

export const getRutinasAsignadasPorDia = async (dia: string): Promise<AtletaRutina[]> => {
  try {
    const token = await getItem('token');
    const response = await axios.get(`${API_URL}/atleta-rutinas`, {
      params: { dia },
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    const rutinas = response.data.data; // 🔧 ESTA es la lista real

    return Array.isArray(rutinas) ? rutinas : [];
  } catch (error) {
    console.error('Error al obtener rutina asignada:', error);
    return [];
  }
};
