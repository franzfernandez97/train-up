import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { styles } from './styles/EntrenadorFooter.styles';

export default function TrainerFooter() {
  const navigation = useNavigation<any>();

  return (
    <View style={styles.footer}>
      <TouchableOpacity onPress={() => navigation.navigate('Home')}>
        <Ionicons name="home" size={24} />
        <Text style={styles.label}>Home</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('RutinaGestion')}>
        <MaterialCommunityIcons name="clipboard-text-outline" size={24} />
        <Text style={styles.label}>Rutinas</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Ejercicios')}>
        <MaterialCommunityIcons name="dumbbell" size={24} />
        <Text style={styles.label}>Ejercicios</Text>
      </TouchableOpacity>
    </View>
  );
}
