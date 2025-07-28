import { Rutina } from './Rutina';

export interface AtletaRutina {
  id: number;
  atleta_id: number;
  rutina_id: number;
  dia: string; // formato YYYY-MM-DD
  frecuencia: string;
  created_at: string;
  updated_at: string;
  rutina: Rutina; // ✅ Enlace correcto al modelo completo
}
