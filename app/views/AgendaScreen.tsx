import { FontAwesome, Ionicons } from '@expo/vector-icons';
import type { RouteProp } from '@react-navigation/native';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React from 'react';
import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import RoleBasedLayout from '../components/RoleBasedLayout';
import { useAuth } from '../contexts/AuthContext';
import { RootStackParamList } from '../navigation/AppNavigator';
import { showAlert } from '../utils/AlertService';
import useAgendaViewModel from '../viewmodels/useAgenda';
import { styles } from './styles/AgendaScreen.styles';

type AgendaRouteProp = RouteProp<RootStackParamList, 'AgendaScreen'>;

export default function AgendaScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<AgendaRouteProp>();

  // ==========================
  // Sesión actual
  // ==========================
  // Leemos el usuario del contexto: lo usamos para saber si es entrenador.
  const { user } = useAuth();
  const isEntrenador = user?.role?.toLowerCase?.() === 'entrenador';

  // ==========================
  // Parámetros (modo entrenador)
  // ==========================
  // Cuando un entrenador abre la Agenda de un atleta, llegan estos params.
  // Si el que abre es un atleta, normalmente vendrán undefined.
  const atletaId = route.params?.atletaId;
  const atletaNombre = route.params?.atletaNombre;

  // ==========================
  // Hook de Agenda (ViewModel)
  // ==========================
  // - fechaPreSeleccionada: si vuelves desde otro flujo (p. ej., Calendario).
  // - atletaId: en modo entrenador, filtra por el atleta seleccionado.
  const {
    dias,                 // Días de la semana (labels, si es hoy, etc.)
    tituloSemana,         // Texto "Mes Año — Semana X al Y"
    irSemanaAnterior,     // Navega a semana anterior
    irSemanaSiguiente,    // Navega a semana siguiente
    setDiaSeleccionado,   // Cambia el día activo
    diaSeleccionado,      // Fecha YYYY-MM-DD actualmente seleccionada
    rutinasDelDia,        // Lista de rutinas asignadas a ese día
  } = useAgendaViewModel(route.params?.fechaPreSeleccionada, atletaId);

  // ============================================================
  // Regla de acceso: ¿el entrenador puede abrir el detalle?
  // ============================================================
  // - Los atletas siempre pueden abrir el detalle de una rutina.
  // - Los entrenadores SOLO si la rutina les pertenece (entrenador_id coincide).
  const canOpenRutina = (r: any) => {
    if (!isEntrenador) return true; // atletas no tienen restricción aquí

    // IMPORTANTE: ajusta esta ruta si tu payload cambia:
    // esperamos que la tarjeta tenga: r.rutina.entrenador_id
    const ownerId = r?.rutina?.entrenador_id;

    // Si no viene el ownerId, por seguridad bloqueamos.
    // Si viene, permitimos solo cuando coincide con el entrenador logueado.
    return typeof ownerId === 'number' && ownerId === user?.id;
  };

  // ============================================================
  // Acción: abrir detalle de rutina (con regla de acceso arriba)
  // ============================================================
  const handleOpenRutina = (r: any, fecha: string | undefined) => {
    // Si NO puede verlo, mostramos alerta y NO navegamos.
    if (!canOpenRutina(r)) {
      showAlert(
        'Acceso denegado',
        'Esta rutina pertenece a otro entrenador y no puedes visualizar su detalle.'
      );
      return;
    }

    // Navegación permitida → vamos a la vista de detalle
    navigation.navigate('RutinaDetalle', {
      rutinaId: r.rutina.id,
      rutinaNombre: r.rutina.nombre,
      fechaPreSeleccionada: fecha,
      atletaId, // conserva contexto del atleta (en modo entrenador)
    });
  };

  return (
    <RoleBasedLayout>
      <View style={styles.container}>
        {/* ==========================
            Encabezado con título + icono calendario
           ========================== */}
        <View style={styles.header}>
          <Text style={styles.title}>
            {/* Si estamos viendo la agenda de un atleta (modo entrenador), lo mostramos */}
            Agenda{atletaNombre ? ` — ${atletaNombre}` : ''}
          </Text>

          {/* Abre el calendario mensual. 
             Si estamos en modo entrenador, pasamos atletaId para mantener contexto. */}
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('CalendarioMensual', atletaId ? { atletaId } : undefined)
            }
          >
            <FontAwesome name="calendar" size={24} color="#ff4d4d" />
          </TouchableOpacity>
        </View>

        {/* ==========================
            Navegación de semanas
           ========================== */}
        <View style={styles.semanaHeader}>
          <TouchableOpacity onPress={irSemanaAnterior}>
            <Ionicons name="chevron-back" size={24} />
          </TouchableOpacity>

          <Text style={styles.subTitle}>{tituloSemana}</Text>

          <TouchableOpacity onPress={irSemanaSiguiente}>
            <Ionicons name="chevron-forward" size={24} />
          </TouchableOpacity>
        </View>

        {/* ==========================
            Días de la semana (selector)
           ========================== */}
        <View style={styles.diasFila}>
          {dias.map((item, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => setDiaSeleccionado(item.fechaCompleta)} // fija el día activo
              style={[
                styles.diaCard,
                item.esSeleccionado
                  ? styles.diaCardSeleccionado   // estilo del día seleccionado
                  : item.esHoy && styles.diaCardHoy, // estilo especial si es hoy
              ]}
            >
              <Text style={styles.diaNombre}>{item.label}</Text>

              <View style={styles.numeroWrapper}>
                <Text style={styles.diaNumero}>{item.dia}</Text>
              </View>

              {/* Indicador visual si ese día tiene al menos una rutina */}
              {item.tieneRutina && (
                <Image
                  source={require('../assets/images/warning.png')}
                  style={styles.iconoAlerta}
                />
              )}
            </TouchableOpacity>
          ))}
        </View>

        {/* ==========================
            Rutinas del día seleccionado
           ========================== */}
        <View style={{ flex: 1 }}>
          <ScrollView contentContainerStyle={styles.rutinaListaContainer}>
            {diaSeleccionado &&
              rutinasDelDia.length > 0 &&
              rutinasDelDia.map((rutinaAsignada, index) => {
                // Si el entrenador NO es dueño de la rutina → tarjeta bloqueada
                const locked = !canOpenRutina(rutinaAsignada);

                return (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.rutinaCard,
                      locked && { opacity: 0.55 }, // feedback visual para bloqueadas
                    ]}
                    onPress={() => handleOpenRutina(rutinaAsignada, diaSeleccionado)}
                    disabled={locked} // deshabilita interacción en bloqueadas
                  >
                    <Image
                      source={require('../assets/images/warning.png')}
                      style={styles.iconoRutina}
                    />

                    <View style={styles.textoWrapper}>
                      <Text style={styles.rutinaTitulo} numberOfLines={2}>
                        {rutinaAsignada.rutina.nombre}
                      </Text>
                      <Text style={styles.rutinaDescripcion}>
                        {/* Si no viene la lista de ejercicios, evita crashear con nullish coalescing */}
                        {rutinaAsignada.rutina.ejercicios?.length ?? 0} ejercicios
                      </Text>
                    </View>

                    {/* Candado para indicar que no se puede abrir (solo entrenadores no dueños) */}
                    {locked && (
                      <Ionicons
                        name="lock-closed-outline"
                        size={18}
                        style={{ marginLeft: 'auto', marginRight: 6, opacity: 0.8 }}
                      />
                    )}
                  </TouchableOpacity>
                );
              })}
          </ScrollView>
        </View>

        {/* ==========================
            Botón flotante: planificar nueva rutina
           ========================== */}
        <TouchableOpacity
          style={styles.botonFlotante}
          onPress={() =>
            navigation.navigate('Rutinas', {
              fechaPreSeleccionada: diaSeleccionado,
              atletaId, // en modo entrenador, planifica para el atleta seleccionado
            })
          }
        >
          <Text style={styles.botonIcono}>＋</Text>
        </TouchableOpacity>
      </View>
    </RoleBasedLayout>
  );
}
