import { Ejercicio } from './Ejercicio';

export interface RutinaEjercicio {
  id: number;
  rutina_id: number;
  ejercicio_id: number;
  seriesObjetivo: number;
  repObjetivo: number;
  descanso: string;
  comentario: string | null;
  created_at: string;
  updated_at: string;
  ejercicio: Ejercicio;
}
