import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Button, FlatList, Text, View } from 'react-native';
import useAtletaRutinasDelDia from '../../viewmodels/useAtletaRutinasDelDia';
import { styles } from '../styles/HomeScreen.styles';

export default function HomeAtleta() {
  const { rutinas, loading } = useAtletaRutinasDelDia();

  if (rutinas.length === 0) {
    return (
      <View style={{ width: '100%' }}>
        <Text style={styles.subtitle}>No tienes planificación para hoy2.</Text>
        <Text style={{ marginBottom: 12 }}>¿Deseas iniciar alguna rutina?</Text>

        <View style={styles.buttonContainer}>
          <Button
            title="Ver Rutinas Disponibles"
            onPress={() => {
              // Aquí puedes navegar a la pantalla de selección de rutina
              console.log('Ir a rutinas disponibles');
            }}
            color="#007bff" // o cualquier otro color que uses
          />
        </View>
      </View>
    );
  }

  return (
    <View style={{ width: '100%' }}>
      <Text style={styles.subtitle}>Rutina planificada para hoy</Text>

      <FlatList
        data={rutinas}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.rutinaBox}>
            <Ionicons
              name="warning-outline"
              size={24}
              color="#f1c40f"
              style={{ marginRight: 8 }}
            />
            <View>
              <Text style={styles.rutinaNombre}>{item.rutina?.nombre ?? 'Rutina'}</Text>
              <Text>ID: {item.rutina_id}</Text>
            </View>
          </View>
        )}
        contentContainerStyle={{ paddingBottom: 40 }} // espacio bajo la lista
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}
