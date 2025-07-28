import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React from 'react';
import { Button, FlatList, Text, TouchableOpacity, View, } from 'react-native';
import { RootStackParamList } from '../../navigation/AppNavigator';
import useAtletaRutinas from '../../viewmodels/useAtletaRutinas';
import { styles } from '../styles/HomeScreen.styles';

export default function HomeAtleta() {
  const { rutinas } = useAtletaRutinas();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  if (rutinas.length === 0) {
    return (
      <View style={{ width: '100%' }}>
        <Text style={styles.subtitle}>No tienes planificación para hoy.</Text>
        <Text style={{ marginBottom: 12 }}>¿Deseas iniciar alguna rutina?</Text>

        <View style={styles.buttonContainer}>
          <Button
            title="Ver Rutinas Disponibles"
            onPress={() => {
              // Aquí puedes navegar a la pantalla de selección de rutina
              navigation.navigate('Rutinas')
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
          <TouchableOpacity
            style={[styles.rutinaBox, { flexDirection: 'row', alignItems: 'center' }]}
            onPress={() =>
              navigation.navigate('RutinaDetalle', {
                rutinaId: item.rutina.id,
                rutinaNombre: item.rutina.nombre,
              })
            }
          >
            <Ionicons
              name="warning-outline"
              size={24}
              color="#f1c40f"
              style={{ marginRight: 8 }}
            />
            <View>
              <Text style={styles.rutinaNombre}>
                {item.rutina?.nombre ?? 'Rutina'}
              </Text>
              <Text style={styles.subtitle}>{item.rutina?.ejercicios?.length ?? 0} Ejercicios</Text>
            </View>
          </TouchableOpacity>
        )}
        contentContainerStyle={{ paddingBottom: 40 }} // espacio bajo la lista
        showsVerticalScrollIndicator={false}

        ListFooterComponent={
          <View style={{ marginTop: 24 }}>
            <Text style={{ marginBottom: 8, textAlign: 'center' }}>
              ¿Deseas realizar alguna otra rutina?
            </Text>
            <View style={styles.buttonContainer}>
              <Button
                title="Ver Rutinas Disponibles"
                onPress={() => {
                  // Aquí puedes navegar a la pantalla de selección de rutina
                  navigation.navigate('Rutinas')
                }}
                color="#007bff" // o cualquier otro color que uses
              />
            </View>
          </View>
        }
      />
    </View>
  );
}
