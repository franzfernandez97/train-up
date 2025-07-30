import { FontAwesome, Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import RoleBasedLayout from '../components/RoleBasedLayout';
import { styles } from './styles/AgendaScreen.styles';

const diasSemana = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];

const diasActuales = [
  { dia: 16, tieneRutina: true },
  { dia: 17, tieneRutina: false },
  { dia: 18, tieneRutina: false },
  { dia: 19, tieneRutina: true },
  { dia: 20, tieneRutina: false },
  { dia: 21, tieneRutina: false },
  { dia: 22, tieneRutina: false },
];

export default function AgendaScreen() {
  return (
    <RoleBasedLayout>

 <View style={styles.container}>
      {/* Título y calendario */}
      <View style={styles.header}>
        <Text style={styles.title}>Agenda</Text>
        <TouchableOpacity onPress={() => console.log('Abrir calendario')}>
          <FontAwesome name="calendar" size={24} color="#ff4d4d" />
        </TouchableOpacity>
      </View>

      {/* Semana actual + navegación */}
      <View style={styles.semanaHeader}>
        <TouchableOpacity onPress={() => console.log('Semana anterior')}>
          <Ionicons name="chevron-back" size={24} />
        </TouchableOpacity>

        <Text style={styles.subTitle}>Jun 2025 - Semana 16 al 22</Text>

        <TouchableOpacity onPress={() => console.log('Semana siguiente')}>
          <Ionicons name="chevron-forward" size={24} />
        </TouchableOpacity>
      </View>

        {/* Días de la semana */}
  <View style={styles.diasFila}>
    {diasActuales.map((item, index) => (
      <View key={index} style={styles.diaCard}>
        <Text style={styles.diaNombre}>{diasSemana[index]}</Text>
        <View style={styles.numeroWrapper}>
          <Text style={styles.diaNumero}>{item.dia}</Text>
        </View>
        {item.tieneRutina && (
          <Image
            source={require('../assets/images/warning.png')}
            style={styles.iconoAlerta}
          />
        )}
      </View>
    ))}
  </View>

  {/* Rutina ejemplo */}
  <View style={styles.rutinaCard}>
    <Image
      source={require('../assets/images/warning.png')}
      style={styles.iconoRutina}
    />
    <View>
      <Text style={styles.rutinaTitulo}>Rutina tren superior</Text>
      <Text style={styles.rutinaDescripcion}>8 Ejercicios</Text>
    </View>
  </View>


      {/* Botón flotante de crear */}
      <TouchableOpacity
        style={styles.botonFlotante}
        onPress={() => console.log('Crear nueva rutina')}
      >
        <Text style={styles.botonIcono}>＋</Text>
      </TouchableOpacity>
    </View>
    </RoleBasedLayout>
   
  );
}