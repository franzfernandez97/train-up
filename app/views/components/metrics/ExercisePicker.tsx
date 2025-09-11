import { Picker } from "@react-native-picker/picker";
import React from "react";
import { Text, View } from "react-native";
import { styles } from "../../styles/MetricsScreen.styles";

/** Selector de ejercicio sin opción "Todos" */
export function ExercisePicker({
  options,
  value,
  onChange,
}: {
  options: { id: number; label: string }[];
  value?: number;
  onChange: (id: number) => void;
}) {
  return (
    <View style={styles.selectorBox}>
      <Text style={styles.selectorLabel}>Ejercicio</Text>
      <View style={styles.pickerWrapper}>
        <Picker
          selectedValue={value}
          onValueChange={(val) => onChange(Number(val))}
          style={styles.picker}
          itemStyle={styles.pickerItem}
          mode="dropdown"
        >
          {options.map((e) => (
            <Picker.Item key={e.id} label={e.label} value={e.id} color="#111" />
          ))}
        </Picker>
      </View>
    </View>
  );
}
