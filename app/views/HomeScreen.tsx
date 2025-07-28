import React, { useEffect } from 'react';
import { Text, View } from 'react-native';
import RoleBasedLayout from '../components/RoleBasedLayout';
import { useAuth } from '../contexts/AuthContext';
import HomeAtleta from './home/HomeAtleta';
import { styles } from './styles/HomeScreen.styles';

export default function HomeScreen() {
  const { user, refreshUser } = useAuth();

  useEffect(() => {
    refreshUser(); // Llama a la función cuando entra a HomeScreen
  }, []);

  const renderContenidoPorRol = () => {
    switch (user?.role) {
      case 'atleta':
        return <HomeAtleta />;
      // case 'entrenador':
      //   return <HomeEntrenador />;
      // case 'admin':
      //   return <HomeAdmin />;
      default:
        return <Text>No tienes contenido disponible para este rol.</Text>;
    }
  };

  return (
    <RoleBasedLayout>
      <View style={styles.container}>
        <Text style={styles.title}>¡Bienvenido, {user?.name}!</Text>
        {renderContenidoPorRol()}
      </View>
    </RoleBasedLayout>
  );
}
