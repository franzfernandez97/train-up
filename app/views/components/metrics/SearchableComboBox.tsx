// /views/components/metrics/SearchableComboBox.tsx
import { Ionicons } from "@expo/vector-icons";
import React, { useMemo, useState } from "react";
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { styles } from "../../styles/MetricsScreen.styles";

export type ComboOption = { id: number | string; label: string };

function norm(s: string) {
  return (s || "").toLowerCase().normalize("NFD").replace(/\p{Diacritic}/gu, "");
}

export default function SearchableComboBox({
  options,
  value,
  onChange,
  placeholder = "Selecciona…",
  disabled = false,
  maxHeight = 220,
}: {
  options: ComboOption[];
  value?: number | string;
  onChange: (id: number | string, option: ComboOption) => void;
  placeholder?: string;
  disabled?: boolean;
  maxHeight?: number;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  const selected = useMemo(
    () => options.find((o) => String(o.id) === String(value)),
    [options, value]
  );
  const filtered = useMemo(() => {
    const q = norm(query);
    return q ? options.filter((o) => norm(o.label).includes(q)) : options;
  }, [options, query]);

  const pick = (opt: ComboOption) => {
    onChange(opt.id, opt);
    setOpen(false);
    setQuery("");
  };

  return (
    <View style={[styles.comboRoot, open && styles.comboRootOpened, open && { marginBottom: (maxHeight ?? 220) + 16 }]}>
      <TouchableOpacity
        style={[styles.comboField, disabled && { opacity: 0.5 }]}
        disabled={disabled}
        onPress={() => setOpen((v) => !v)}
        activeOpacity={0.8}
      >
        <Text style={[styles.comboValueText, !selected && { color: "#9ca3af" }]}>
          {selected ? selected.label : placeholder}
        </Text>
        <Ionicons name={open ? "chevron-up" : "chevron-down"} size={16} color="#374151" />
      </TouchableOpacity>

      {open && !disabled && (
        <>
          <TouchableOpacity
            style={StyleSheet.absoluteFillObject}
            activeOpacity={1}
            onPress={() => setOpen(false)}
          />
          <View style={[styles.comboDropdown, { maxHeight }]}>
            <View style={styles.comboSearchRow}>
              <Ionicons name="search-outline" size={16} color="#6b7280" />
              <TextInput
                value={query}
                onChangeText={setQuery}
                placeholder="Buscar ejercicio…"
                style={styles.comboInput}
                autoFocus
                onFocus={() => setOpen(true)}
              />
              {query ? (
                <TouchableOpacity onPress={() => setQuery("")} style={{ padding: 6 }}>
                  <Ionicons name="close-circle" size={16} color="#9ca3af" />
                </TouchableOpacity>
              ) : null}
            </View>

            {/* 👇 ScrollView en vez de FlatList para evitar el warning */}
            <ScrollView keyboardShouldPersistTaps="handled">
              {filtered.length ? (
                filtered.map((item) => (
                  <TouchableOpacity
                    key={String(item.id)}
                    onPress={() => pick(item)}
                    style={styles.comboOptionRow}
                    activeOpacity={0.8}
                  >
                    <Text
                      numberOfLines={1}
                      style={[
                        styles.comboOptionText,
                        String(item.id) === String(value) && { fontWeight: "700" },
                      ]}
                    >
                      {item.label}
                    </Text>
                  </TouchableOpacity>
                ))
              ) : (
                <View style={styles.comboEmptyBox}>
                  <Text style={styles.comboEmptyText}>Sin resultados</Text>
                </View>
              )}
            </ScrollView>
          </View>
        </>
      )}
    </View>
  );
}
