// /models/Mensaje.ts
import { User } from './User';

export interface Mensaje {
  id: number;
  contenido: string;
  fechaHora: string; // Formato YYYY-MM-DD HH:mm:ss
  estado: 'leido' | 'no_leido';
  emisor_id: number;
  receptor_id: number;
  created_at: string;
  updated_at: string;
  emisor: User;
  receptor: User;
}
