import { RouteProp, useRoute } from "@react-navigation/native";
import React from "react";
import { ScrollView, Text, View } from "react-native";
import RoleBasedLayout from "../components/RoleBasedLayout";
import { useMetricsViewModel } from "../viewmodels/useMetrics";
import { styles } from "./styles/MetricsScreen.styles";

// Componentes modulares
import { DateRange } from "./components/metrics/DateRange";
//import { ExercisePicker } from "./components/metrics/ExercisePicker";
import { DailySeriesList } from "./components/metrics/DailySeriesList";
import { MetricsChart } from "./components/metrics/MetricsChart";
import SearchableComboBox from "./components/metrics/SearchableComboBox";
import { YFieldToggle } from "./components/metrics/YFieldToggle";

type RouteParams = { Metrics?: { exerciseId?: number } };

/**
 * Pantalla de Métricas:
 * - Usa el ViewModel para toda la lógica (fetch, agregación, filtros)
 * - Renderiza filtros y gráfico con componentes pequeños y claros
 */
export default function MetricsScreen() {
  const route = useRoute<RouteProp<RouteParams, "Metrics">>();
  const initialExerciseId = route?.params?.exerciseId;

  const {
    loading,
    exerciseOptions,
    selectedExerciseId,
    setSelectedExerciseId,
    yField,
    setYField,
    range,
    setRange,
    points,
    minDataDate,
    maxDataDate,
    dayDetails,
  } = useMetricsViewModel(initialExerciseId);

  return (
    <RoleBasedLayout>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Métricas</Text>
          {loading ? <Text style={{ fontSize: 12, color: "#6b7280" }}>Cargando…</Text> : null}
        </View>

        {/* Filtros */}
        <View style={styles.filterRow}>
          {/* <ExercisePicker
            options={exerciseOptions}
            value={selectedExerciseId}
            onChange={setSelectedExerciseId}
          /> */}
          <Text style={styles.selectorLabel}>Ejercicio</Text>
          <SearchableComboBox
            options={exerciseOptions}                // [{ id, label }]
            value={selectedExerciseId}               // number | string | undefined
            onChange={(id) => setSelectedExerciseId(Number(id))}
            placeholder="Buscar o seleccionar…"
          />

          <YFieldToggle yField={yField} onChange={setYField} />

          <View style={{ width: "100%", gap: 10 }}>
            <DateRange value={range} onChange={setRange} minDate={minDataDate} maxDate={maxDataDate} />
          </View>
        </View>

        {/* Gráfico */}
        <MetricsChart points={points} yLabel={yField === "repeticiones" ? "Repeticiones" : "Peso"} />
        
        {/* ⬇️ Nuevo bloque con mismo filtrado del chart */}
        <DailySeriesList yField={yField} days={dayDetails} />

        <View style={{ height: 24 }} />
      </ScrollView>
    </RoleBasedLayout>
  );
}
