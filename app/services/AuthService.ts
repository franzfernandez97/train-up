import axios from 'axios';
import { User } from '../models/User';

const API_URL = 'http://147.93.114.243:8080/api';

/**
 * Inicia sesión del usuario.
 */
export const login = async (email: string, password: string) => {
  const response = await axios.post(`${API_URL}/login`, {
    email,
    password,
  });
  return response.data;
};

/**
 * Registra un nuevo usuario.
 */
export const register = async (name: string, email: string, password: string) => {
  const response = await axios.post(`${API_URL}/register`, {
    name,
    email,
    password,
  });
  return response.data;
};

/**
 * Cierra sesión en el backend utilizando el token actual.
 */
export const logout = async (token: string) => {
  const response = await axios.post(
    `${API_URL}/logout`,
    {}, // cuerpo vacío
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data; // Ej: { message: 'Sesión cerrada' }
};
  /**
 * Actualiza data del usuario
 */
export async function getCurrentUser(id: number, token: string): Promise<User> {

  const response = await axios.get(`${API_URL}/users/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  
  
  return response.data;
};


