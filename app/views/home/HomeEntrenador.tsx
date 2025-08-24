import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React from 'react';
import { ActivityIndicator, FlatList, Text, TouchableOpacity, View } from 'react-native';
import { RootStackParamList } from '../../navigation/AppNavigator';
import useHomeEntrenador from '../../viewmodels/useHomeEntrenador';
import { styles } from '../styles/HomeScreen.styles';

export default function HomeEntrenador() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { atletas, loading, refresh } = useHomeEntrenador();

  return (
    <View style={styles.container}>
      <Text style={styles.etiqueta}>Atletas</Text>

      {loading ? (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator size="large" />
        </View>
      ) : (
        <FlatList
          data={atletas}
          keyExtractor={(item) => String(item.id)}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 40, flexGrow: 1 }}
          refreshing={loading}
          onRefresh={refresh}
          renderItem={({ item }) => {
            const esAsignada = /asignada/i.test(item.estado || '');
            return (
              <TouchableOpacity
                style={styles.card}
                onPress={() => {
                  // navigation.navigate('AsignarRutina', { atletaId: item.atleta_id });
                  console.log('Abrir detalle de atleta', item.atleta_id);
                }}
              >
                <View style={styles.avatarWrap}>
                  <Ionicons name="person-circle-outline" size={36} />
                </View>

                <View style={{ flex: 1 }}>
                  <Text style={styles.nombre}>{item.nombre}</Text>
                  <Text
                    style={esAsignada ? styles.estadoAsignada : styles.estadoPendiente}
                    accessibilityLabel={`Estado: ${item.estado || 'Sin datos'}`}
                  >
                    {item.estado || 'Sin datos'}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          }}
          ListEmptyComponent={
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingVertical: 24 }}>
              <Ionicons name="people-outline" size={44} />
              <Text style={[styles.subtitle, { textAlign: 'center', marginTop: 8 }]}>
                Actualmente no tienes atletas asignados. Por favor, contacta al administrador para gestionar la asignación.
              </Text>
            </View>
          }
        />
      )}
    </View>
  );
}
