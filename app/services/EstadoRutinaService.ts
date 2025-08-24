import axios from 'axios';
import { getItem } from '../utils/SecureStorage';

const API_URL = 'http://147.93.114.243:8080/api';

export interface EstadoRutinaDia {
  atleta_id: number;
  estado: string; // "Rutina asignada" | "Pendiente por asignar" | otros
  dia: string;    // "YYYY-MM-DD"
}

// YYYY-MM-DD en zona "America/Bogota"
function hoyBogota(): string {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/Bogota',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date());
}

/**
 * Consulta el estado de rutina del día para un atleta.
 * @param atletaId id del atleta
 * @param dia (opcional) "YYYY-MM-DD". Si no se pasa, usa hoy (America/Bogota).
 */
export async function getEstadoRutinaHoy(atletaId: number, dia?: string): Promise<EstadoRutinaDia> {
  const token = await getItem('token');
  if (!token) throw new Error('Token inexistente o inválido');

  const fecha = dia || hoyBogota();

  const res = await axios.get(
    `${API_URL}/atletas/${atletaId}/rutina/estado-hoy`,
    {
      params: { dia: fecha },
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    }
  );

  const data = res?.data?.data;
  if (!data) throw new Error('Respuesta sin data en estado-hoy');

  return {
    atleta_id: Number(data.atleta_id),
    estado: String(data.estado),
    dia: String(data.dia),
  };
}
