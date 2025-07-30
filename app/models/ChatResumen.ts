// /models/ChatResumen.ts
import { Mensaje } from './Mensaje';
import { User } from './User';

export interface ChatResumen {
  usuario: User;
  mensaje: Mensaje;
}
