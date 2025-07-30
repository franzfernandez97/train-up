import { FontAwesome, Ionicons } from '@expo/vector-icons';
import type { RouteProp } from '@react-navigation/native';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import RoleBasedLayout from '../components/RoleBasedLayout';
import { RootStackParamList } from '../navigation/AppNavigator';
import useAgendaViewModel from '../viewmodels/useAgenda';
import { styles } from './styles/AgendaScreen.styles';

type AgendaRouteProp = RouteProp<RootStackParamList, 'AgendaScreen'>;

export default function AgendaScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<AgendaRouteProp>();

  const {
    dias,
    tituloSemana,
    irSemanaAnterior,
    irSemanaSiguiente,
    setDiaSeleccionado,
    diaSeleccionado,
    rutinaSeleccionada,
  } = useAgendaViewModel(route.params?.fechaPreSeleccionada); // ✅ Se pasa directamente aquí

  return (
    <RoleBasedLayout>
      <View style={styles.container}>
        {/* Título */}
        <View style={styles.header}>
          <Text style={styles.title}>Agenda</Text>
          <TouchableOpacity onPress={() => navigation.navigate('CalendarioMensual')}>
            <FontAwesome name="calendar" size={24} color="#ff4d4d" />
          </TouchableOpacity>
        </View>

        {/* Navegación de semanas */}
        <View style={styles.semanaHeader}>
          <TouchableOpacity onPress={irSemanaAnterior}>
            <Ionicons name="chevron-back" size={24} />
          </TouchableOpacity>
          <Text style={styles.subTitle}>{tituloSemana}</Text>
          <TouchableOpacity onPress={irSemanaSiguiente}>
            <Ionicons name="chevron-forward" size={24} />
          </TouchableOpacity>
        </View>

        {/* Días */}
        <View style={styles.diasFila}>
          {dias.map((item, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => setDiaSeleccionado(item.fechaCompleta)}
              style={[
                styles.diaCard,
                item.esSeleccionado
                  ? styles.diaCardSeleccionado
                  : item.esHoy && styles.diaCardHoy,
              ]}
            >
              <Text style={styles.diaNombre}>{item.label}</Text>
              <View style={styles.numeroWrapper}>
                <Text style={styles.diaNumero}>{item.dia}</Text>
              </View>
              {item.tieneRutina && (
                <Image
                  source={require('../assets/images/warning.png')}
                  style={styles.iconoAlerta}
                />
              )}
            </TouchableOpacity>
          ))}
        </View>

        {/* Rutina asociada al día seleccionado */}
          {diaSeleccionado && rutinaSeleccionada && (
          <TouchableOpacity
            style={styles.rutinaCard}
            onPress={() =>
              navigation.navigate('RutinaDetalle', {
                rutinaId: rutinaSeleccionada.rutina.id,
                rutinaNombre: rutinaSeleccionada.rutina.nombre,
              })
            }
          >
            <Image
              source={require('../assets/images/warning.png')}
              style={styles.iconoRutina}
            />
            <View style={styles.textoWrapper}>
              <Text style={styles.rutinaTitulo} numberOfLines={2}>
                {rutinaSeleccionada.rutina.nombre}
              </Text>
              <Text style={styles.rutinaDescripcion}>
                {rutinaSeleccionada.rutina.ejercicios?.length ?? 0} ejercicios
              </Text>
            </View>
          </TouchableOpacity>
        )}

        {/* Botón flotante */}
        <TouchableOpacity
          style={styles.botonFlotante}
          onPress={() => navigation.navigate('Rutinas')}
        >
          <Text style={styles.botonIcono}>＋</Text>
        </TouchableOpacity>
      </View>
    </RoleBasedLayout>
  );
}
