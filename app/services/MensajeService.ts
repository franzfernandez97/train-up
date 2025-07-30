// /services/MensajeService.ts
import axios from 'axios';
import { ChatResumen } from '../models/ChatResumen';
import { Mensaje } from '../models/Mensaje';
import { getItem } from '../utils/SecureStorage';

const API_URL = 'http://147.93.114.243:8080/api';

export const getMensajes = async (): Promise<Mensaje[]> => {
  try {
    const token = await getItem('token');

    const response = await axios.get(`${API_URL}/mensajes`, {
      params: {
        timezone: 'America/Bogota',
        order: 'asc',
      },
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    return response.data.data ?? null
  } catch (error) {
    console.error('Error al obtener los mensajes:', error);
    return [];
  }
};

/**
 * Obtiene la lista de usuarios con los que se tiene un chat.
 */
export const getChats = async (): Promise<ChatResumen[]> => {
  try {
    const token = await getItem('token');
    const response = await axios.get(`${API_URL}/chats`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    return response.data ?? null // Ya viene con usuario + mensaje completo
  } catch (error) {
    console.error('Error al obtener los chats:', error);
    return [];
  }
};

/**
 * Obtener todas las conversaciones de un usuario
 */

export const getConversacionConUsuario = async (
  usuarioId: number,
  timezone = 'America/Bogota',
  order = 'asc'
): Promise<Mensaje[]> => {
  try {
    const token = await getItem('token');

    const response = await axios.get(`${API_URL}/conversacion/${usuarioId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      params: {
        timezone,
        order,
      },
    });

    return response.data ?? [];
  } catch (error) {
    console.error('Error al obtener la conversación:', error);
    return [];
  }
};

/**
 * Enviar Mensaje
 */

export const enviarMensaje = async (contenido: string, receptor_id: number): Promise<boolean> => {
  try {
    const token = await getItem('token');

    await axios.post(`${API_URL}/mensajes`, {
      contenido,
      receptor_id,
    }, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    return true;
  } catch (error) {
    console.error('Error al enviar mensaje:', error);
    return false;
  }
};

/**
 * Marcar como leido
 */
export const marcarComoLeido = async (mensajeId: number): Promise<boolean> => {
  try {
    const token = await getItem('token');

    await axios.patch(`${API_URL}/mensajes/${mensajeId}/leido`, null, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    return true;
  } catch (error) {
    console.error(`Error al marcar mensaje ${mensajeId} como leído:`, error);
    return false;
  }
};