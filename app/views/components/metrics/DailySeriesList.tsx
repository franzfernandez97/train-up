import React from "react";
import { Text, View } from "react-native";
import { styles } from "../../styles/MetricsScreen.styles";
import { formatDDMMYYYY } from "./dateUtils";

type Props = {
  yField: "repeticiones" | "valor";
  days: Array<{
    date: string; // YYYY-MM-DD
    avg: number;
    series: Array<{ serie: number; repeticiones: number; valor: number }>;
  }>;
};

const fmt = (n: number) => (Math.round(n * 100) / 100).toFixed(2);

export function DailySeriesList({ yField, days }: Props) {
  if (!days.length) return null;

  const avgLabel = yField === "repeticiones" ? "Promedio (Reps)" : "Promedio (Peso)";

  return (
    <View style={styles.detailsContainer}>
      {days.map((d) => (
        <View key={d.date} style={styles.dayCard}>
          <View style={styles.dayHeaderRow}>
            <Text style={styles.dayTitle}>Fecha: {formatDDMMYYYY(d.date)}</Text>
            <Text style={styles.dayAvg}>
              {avgLabel}: {fmt(d.avg)}
              {yField === "valor" ? " lb" : ""}
            </Text>
          </View>

          {d.series.map((s) => (
            <View key={s.serie} style={styles.daySeriesRow}>
              <Text style={styles.daySeriesText}>
                Serie {s.serie}. {s.repeticiones} rep - {s.valor} lb
              </Text>
            </View>
          ))}
        </View>
      ))}
    </View>
  );
}
