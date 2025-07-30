import React, { createContext, useContext, useEffect, useState } from 'react';
import type { AuthResponse } from '../models/AuthResponse';
import type { User } from '../models/User';
import { login as apiLogin, logout as apiLogout, getCurrentUser } from '../services/AuthService';
import { showAlert } from '../utils/AlertService'; // ✅ Importación
import { deleteItem, getItem, saveItem } from '../utils/SecureStorage';
import { sanitizeUser } from '../utils/sanitizerUser';

interface AuthContextProps {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  loading: boolean;
  error: string;
  initializing: boolean;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [initializing, setInitializing] = useState(true);
  const [error, setError] = useState('');


  const refreshUser = async () => {
    try {
      const token = await getItem('token');
      const storedUser = await getItem('user');
      if (!token || !storedUser) return;

      const parsedUser = JSON.parse(storedUser);
      const updatedUser = await getCurrentUser(parsedUser.id, token);
      
      //Sanitizar Usuarioconst sanitizedUser = sanitizeUser(res.user);
      const sanitizedUser = sanitizeUser(updatedUser);
      await saveItem('user', JSON.stringify(sanitizedUser));
      //await saveItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
    } catch (e) {
      console.warn('Error actualizando usuario:', e);

      // Limpieza y redirección
      await deleteItem('token');
      await deleteItem('user');
      setUser(null); // Fuerza que AppNavigator redireccione
    }
  };

  useEffect(() => {
    const loadUser = async () => {
      try {
        const storedUser = await getItem('user');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        } else {
          setUser(null); // Asegura fallback
        }
      } catch (err) {
        console.warn('Error cargando usuario desde SecureStorage:', err);
        setUser(null); // También en error
      } finally {
        setInitializing(false);
      }
    };
    loadUser();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      const res: AuthResponse = await apiLogin(email, password);
      await saveItem('token', res.token);

      //Sanitizar Usuarioconst sanitizedUser = sanitizeUser(res.user);
      const sanitizedUser = sanitizeUser(res.user);
      await saveItem('user', JSON.stringify(sanitizedUser));
      //await saveItem('user', JSON.stringify(res.user));
      setUser(res.user);
      setError('');
    } catch (e: any) {
      const msg = e?.response?.data?.message ?? 'Error al iniciar sesión';
      setError(msg);
      showAlert('Login Fallido', msg); // ✅ Alerta usando servicio
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      const token = await getItem('token');
      if (token) await apiLogout(token);
    } catch (e) {
      console.warn('Error al cerrar sesión:', e);
    } finally {
      await deleteItem('token');
      await deleteItem('user');
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, login, logout, refreshUser, loading, error, initializing }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextProps => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider');
  }
  return context;
};
