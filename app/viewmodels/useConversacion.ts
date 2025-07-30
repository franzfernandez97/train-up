import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Mensaje } from '../models/Mensaje';
import { User } from '../models/User';
import { getConversacionConUsuario, marcarComoLeido } from '../services/MensajeService';

export default function useConversacion(usuario: User) {
  const [mensajes, setMensajes] = useState<Mensaje[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  
  const cargarMensajes = async () => {
    try {
      const data = await getConversacionConUsuario(usuario.id);
      
      
      setMensajes(data);

      // Marcar como leído el último mensaje recibido si aplica
      const mensajeNoLeido = data.find(
        (msg) => msg.receptor_id === user?.id && msg.estado === 'no_leido'
      );

      if (mensajeNoLeido) {
        await marcarComoLeido(mensajeNoLeido.id);
      }
    } catch (error) {
      console.error('Error al obtener la conversación:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarMensajes();
  }, [usuario]);

  return { mensajes, loading, refrescarMensajes: cargarMensajes };
}
