import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { styles } from "../../styles/MetricsScreen.styles";

/** Toggle entre Repeticiones / Peso (valor) */
export function YFieldToggle({
  yField,
  onChange,
}: {
  yField: "repeticiones" | "valor";
  onChange: (v: "repeticiones" | "valor") => void;
}) {
  return (
    <View style={styles.toggleRow}>
      <TouchableOpacity
        style={[styles.toggleBtn, yField === "repeticiones" && styles.toggleBtnActive]}
        onPress={() => onChange("repeticiones")}
        activeOpacity={0.8}
      >
        <Text style={[styles.toggleText, yField === "repeticiones" && styles.toggleTextActive]}>
          Repeticiones
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.toggleBtn, yField === "valor" && styles.toggleBtnActive]}
        onPress={() => onChange("valor")}
        activeOpacity={0.8}
      >
        <Text style={[styles.toggleText, yField === "valor" && styles.toggleTextActive]}>
          Peso
        </Text>
      </TouchableOpacity>
    </View>
  );
}
