import axios from 'axios';
import { User } from '../models/User';
import { getItem } from '../utils/SecureStorage';

const API_URL = 'http://147.93.114.243:8080/api';

export const getUsuariosRelacionados = async (): Promise<User[]> => {
  try {
    const token = await getItem('token');

    const response = await axios.get(`${API_URL}/usuarios-relacionados`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    return response.data.data ?? [];
  } catch (error) {
    console.error('Error al obtener usuarios relacionados', error);
    return [];
  }
};
