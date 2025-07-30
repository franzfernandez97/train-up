import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React from 'react';
import { Dimensions, Text, TouchableOpacity, View } from 'react-native';
import RoleBasedLayout from '../components/RoleBasedLayout';
import { RootStackParamList } from '../navigation/AppNavigator';
import useCalendarioMensualViewModel from '../viewmodels/useCalendarioMensual';
import { styles } from './styles/CalendarioMensualScreen.styles';

export default function CalendarioMensualScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { diasMes, mesActual, cambiarMes, numeroFilas } = useCalendarioMensualViewModel();

  const nombreMes = mesActual.toLocaleDateString('es-ES', {
    month: 'long',
    year: 'numeric',
  });

  const handleSeleccionarDia = (fecha: string) => {
    navigation.navigate('AgendaScreen', { fechaPreSeleccionada: fecha });
  };

  // Calcular altura dinámica para que el calendario se vea completo
  const { height: alturaPantalla } = Dimensions.get('window');
  const alturaDisponible = alturaPantalla - 200; // Espacio restante para el grid (header + márgenes)
  const alturaFila = alturaDisponible / numeroFilas;

  return (
    <RoleBasedLayout>
      <View style={styles.container}>
        {/* Header con navegación de mes */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => cambiarMes(-1)}>
            <Ionicons name="chevron-back" size={24} />
          </TouchableOpacity>
          <Text style={styles.headerText}>{nombreMes.charAt(0).toUpperCase() + nombreMes.slice(1)}</Text>
          <TouchableOpacity onPress={() => cambiarMes(1)}>
            <Ionicons name="chevron-forward" size={24} />
          </TouchableOpacity>
        </View>

        {/* Encabezados de días de la semana */}
        <View style={styles.grid}>
          {['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'].map((dia, idx) => (
            <Text key={idx} style={styles.diaSemana}>{dia}</Text>
          ))}

          {/* Días del mes */}
          {diasMes.map((item, idx) => (
            <TouchableOpacity
                key={idx}
                style={[
                styles.dia,
                { height: alturaFila },
                !item.esDelMes && styles.diaFueraMes, // nuevo estilo
                item.tieneRutina && styles.diaConRutina,
                item.esHoy && styles.diaHoy,
                ]}
                onPress={() => handleSeleccionarDia(item.fecha)}
            >
                <Text>{item.dia}</Text>
            </TouchableOpacity>
            ))}

        </View>
      </View>
    </RoleBasedLayout>
  );
}
