import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import { styles } from './styles/AtletaFooter.styles';

export default function AthleteFooter() {
  const navigation = useNavigation<any>();

  return (
    <View style={styles.footer}>
      <TouchableOpacity onPress={() => navigation.navigate('Home')}>
        <Ionicons name="home" size={24} />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Agenda')}>
        <MaterialCommunityIcons name="calendar-month-outline" size={24} />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Progress')}>
        <Ionicons name="bar-chart-outline" size={24} />
      </TouchableOpacity>
    </View>
  );
}
