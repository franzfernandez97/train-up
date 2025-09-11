export type Serie = {
  id: number;
  serie: number;
  repeticiones: number;
  valor: number;
  comentario: string | null;
  created_at: string;
  updated_at: string;
  marca_personal_id: number;
};

export type EjercicioLite = {
  id: number;
  nombre: string;
  grupoMuscular: string;
  instrucciones?: string;
  urlMedia?: string | null;
  entrenador_id: number;
  created_at: string;
  updated_at: string;
};

export type MarcaPersonal = {
  id: number;
  ejercicio_id: number;
  atleta_id: number;
  fecha: string; // YYYY-MM-DD
  created_at: string;
  updated_at: string;
  atleta?: {
    id: number;
    name: string;
    email: string;
    role: string;
    created_at: string;
    updated_at: string;
  };
  ejercicio: EjercicioLite;
  series: Serie[];
};

export type MarcasResponse = {
  message: string;
  data: MarcaPersonal[];
};
