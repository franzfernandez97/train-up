// /services/UserService.ts
import axios from 'axios';
import { getItem } from '../utils/SecureStorage';

const API_URL = 'http://147.93.114.243:8080/api';

export const updateUser = async (
  id: number,
  data: {
    name: string;
    email: string;
    current_password?: string;
    new_password?: string;
    new_password_confirmation?: string;
  }
) => {
  const token = await getItem('token');

  const response = await axios.put(`${API_URL}/users/${id}`, data, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  return response.data;
};
