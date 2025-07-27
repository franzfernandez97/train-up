export interface AtletaRutina {
  id: number;
  atleta_id: number;
  rutina_id: number;
  dia: string; // formato YYYY-MM-DD
  frecuencia: string;
  created_at: string;
  updated_at: string;
  rutina?: {
    id: number;
    nombre: string;
  };
}
