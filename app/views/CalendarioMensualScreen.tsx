// /screens/CalendarioScreen.tsx
// -----------------------------------------------------------------------------
// Calendario mensual con dos modos de uso:
// 1) Comportamiento original: abrir AgendaScreen con fecha (y atletaId si aplica).
// 2) Modo retorno: si se reciben params (returnTo, returnParamName, returnExtra),
//    devuelve la fecha a una pantalla existente (p.ej. 'AI') usando:
//      - navigation.navigate({ name: returnTo, params: { [returnParamName]: fecha, ...returnExtra }, merge: true })
//      - navigation.goBack()
//    Esto evita remontar la pantalla de destino y conserva su estado.
// ----------------------------------------------------------------------------- 

import { Ionicons } from '@expo/vector-icons';
import type { RouteProp } from '@react-navigation/native';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React from 'react';
import { Dimensions, Text, TouchableOpacity, View } from 'react-native';
import RoleBasedLayout from '../components/RoleBasedLayout';
import { RootStackParamList } from '../navigation/AppNavigator';
import useCalendarioMensualViewModel from '../viewmodels/useCalendarioMensual';
import { styles } from './styles/CalendarioMensualScreen.styles';

type CalendarioRouteProp = RouteProp<RootStackParamList, 'CalendarioMensual'>;

export default function CalendarioMensualScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<CalendarioRouteProp>();

  // atletaId opcional (modo entrenador). Si no viene, funciona para el atleta autenticado.
  const atletaId = route.params?.atletaId;

  // --------- NUEVO: soporte "modo retorno" sin tocar el tipo global ----------
  // Nota: RootStackParamList no define estos campos; para no romper tipos
  //       los leemos de forma segura usando "as any".
  const rparams = (route.params as any) ?? {};
  const returnTo = rparams.returnTo as keyof RootStackParamList | undefined;        // ej: 'AI'
  const returnParamName = (rparams.returnParamName as string) ?? 'fechaPreSeleccionada';
  const returnExtra = (rparams.returnExtra as Record<string, any>) ?? {};

  const { diasMes, mesActual, cambiarMes, numeroFilas } =
    useCalendarioMensualViewModel(atletaId);

  const nombreMes = mesActual.toLocaleDateString('es-ES', {
    month: 'long',
    year: 'numeric',
  });

  const handleSeleccionarDia = (fecha: string) => {
    // Si se especifica "returnTo", devolvemos la fecha a esa pantalla YA montada
    // y regresamos con goBack() para mantener su estado.
  if (returnTo) {
    // ✅ Volver a la instancia existente de la pantalla destino y mezclar params
    navigation.navigate({
      name: returnTo as keyof RootStackParamList,
      params: { [returnParamName]: fecha, ...returnExtra } as any,
      merge: true,
    } as any);
    
    return;
  }

    // Comportamiento original: ir a AgendaScreen con la fecha seleccionada
    navigation.navigate('AgendaScreen', {
      fechaPreSeleccionada: fecha,
      ...(atletaId ? { atletaId } : {}),
    });
  };

  // Altura dinámica para el grid
  const { height: alturaPantalla } = Dimensions.get('window');
  const alturaDisponible = alturaPantalla - 200;
  const alturaFila = alturaDisponible / numeroFilas;

  return (
    <RoleBasedLayout>
      <View style={styles.container}>
        {/* Header con navegación de mes */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => cambiarMes(-1)}>
            <Ionicons name="chevron-back" size={24} />
          </TouchableOpacity>
          <Text style={styles.headerText}>
            {nombreMes.charAt(0).toUpperCase() + nombreMes.slice(1)}
          </Text>
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
                !item.esDelMes && styles.diaFueraMes,
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
