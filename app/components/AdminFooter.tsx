import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { styles } from './styles/AdminFooter.styles';

export default function AdminFooter() {
  const navigation = useNavigation<any>();

  return (
    <View style={styles.footer}>
      <TouchableOpacity onPress={() => navigation.navigate('Home')}>
        <Ionicons name="home" size={22} />
        <Text style={styles.label}>Home</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Usuarios')}>
        <MaterialCommunityIcons name="account-group" size={22} />
        <Text style={styles.label}>Usuarios</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Rutinas')}>
        <MaterialCommunityIcons name="clipboard-text-outline" size={22} />
        <Text style={styles.label}>Rutinas</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Ejercicios')}>
        <MaterialCommunityIcons name="dumbbell" size={22} />
        <Text style={styles.label}>Ejercicios</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Agenda')}>
        <MaterialCommunityIcons name="calendar-month-outline" size={22} />
        <Text style={styles.label}>Agenda</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Progreso')}>
        <Ionicons name="bar-chart-outline" size={22} />
        <Text style={styles.label}>Progreso</Text>
      </TouchableOpacity>
    </View>
  );
}
