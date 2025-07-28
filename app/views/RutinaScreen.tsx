import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React from 'react';
import {
  ActivityIndicator,
  FlatList,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import RoleBasedLayout from '../components/RoleBasedLayout';
import { RootStackParamList } from '../navigation/AppNavigator';
import useRutinasViewModel from '../viewmodels/useRutinas';
import { styles } from './styles/RutinaScreen.style';

export default function RutinasScreen() {
  const { rutinas, loading, error } = useRutinasViewModel();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

  const renderItem = ({ item }: any) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() =>
        navigation.navigate('RutinaDetalle', {
          rutinaId: item.id,
          rutinaNombre: item.nombre,
        })
      }
    >
      <Ionicons
        name="clipboard-outline"
        size={32}
        color="#000"
        style={styles.icon}
      />
      <View style={styles.cardContent}>
        <Text style={styles.title}>{item.nombre}</Text>
        <Text style={styles.subtitle}>
          {item.ejercicios?.length ?? 'X'} Ejercicios
        </Text>
        <Text style={styles.subtitle}>Tipo: {capitalize(item.tipo)}</Text>
      </View>
    </TouchableOpacity>
  );

  if (loading) return <ActivityIndicator style={{ marginTop: 20 }} />;
  if (error) return <Text style={{ color: 'red' }}>{error}</Text>;

  return (
    <RoleBasedLayout>
      <View style={styles.container}>
        <Text style={styles.header}>Seleccionar rutina</Text>
        <FlatList
          data={rutinas}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
        />
      </View>
    </RoleBasedLayout>
  );
}
