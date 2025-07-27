import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import AdminLayout from './AdminLayout';
import AtletaLayout from './AtletaLayout';
import EntrenadorLayout from './EntrenadorLayout';

interface Props {
  children: React.ReactNode;
}

export default function RoleBasedLayout({ children }: Props) {
  const { user } = useAuth();

  if (!user?.role) {
    // Opcional: puedes mostrar un loader o layout vacío si no hay rol aún
    return null;
  }

  if (user.role.toLowerCase() === 'atleta') {
    return <AtletaLayout>{children}</AtletaLayout>;
  }

  if (user.role.toLowerCase() === 'entrenador') {
    return <EntrenadorLayout>{children}</EntrenadorLayout>;
  }

  if (user.role.toLowerCase() === 'admin') {
    return <AdminLayout>{children}</AdminLayout>;
  }

  // Layout por defecto si no coincide con ninguno
  return null
}
