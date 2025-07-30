import { useEffect, useState } from 'react';
import { User } from '../models/User';
import { getUsuariosRelacionados } from '../services/AtletaEntrenadorService';


export default function useSeleccionarUsuarioChat() {
  const [usuariosRelacionados, setUsuariosRelacionados] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [busqueda, setBusqueda] = useState('');

  const cargarUsuariosRelacionados = async () => {
    setLoading(true);
    try {
      const usuarios = await getUsuariosRelacionados();
      setUsuariosRelacionados(usuarios);
    } catch (error) {
      console.error('Error al cargar usuarios relacionados:', error);
    } finally {
      setLoading(false);
    }
  };

  const usuariosFiltrados = usuariosRelacionados.filter((u) =>
    u.name.toLowerCase().includes(busqueda.toLowerCase()) ||
    u.email.toLowerCase().includes(busqueda.toLowerCase())
  );

  useEffect(() => {
    cargarUsuariosRelacionados();
  }, []);

  return {
    relaciones: usuariosFiltrados,
    loading,
    busqueda,
    setBusqueda,
  };
}