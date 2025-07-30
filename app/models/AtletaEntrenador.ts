import { User } from './User';

export interface AtletaEntrenador {
  id: number;
  atleta_id: number;
  entrenador_id: number;
  created_at: string;
  updated_at: string;
  entrenador?: User;
  atleta?: User;
  admin?: User;    
}