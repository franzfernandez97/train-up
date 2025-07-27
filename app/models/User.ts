export interface User {
  id: number;
  name: string;
  email: string;
  email_verified_at: string | null;
  role: 'admin' | 'entrenador' | 'atleta' | string; // ajusta según tus roles reales
  created_at: string;
  updated_at: string;
}
