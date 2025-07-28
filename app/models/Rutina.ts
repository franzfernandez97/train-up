import { Ejercicio } from './Ejercicio';

export interface Rutina {
  id: number;
  nombre: string;
  tipo: 'publica' | 'privada';
  entrenador_id: number;
  created_at: string;
  updated_at: string;
  ejercicios: Ejercicio[];
}