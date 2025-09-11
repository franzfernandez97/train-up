import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { Platform, Text, TouchableOpacity, View } from "react-native";
import type { Range } from "../../../viewmodels/useMetrics";
import { styles } from "../../styles/MetricsScreen.styles";
import {
    formatDDMMYYYY,
    formatYMDUTC,
    ymdToUTCDate,
} from "./dateUtils";

const RNDateTimePicker =
  Platform.OS === "web" ? null : require("@react-native-community/datetimepicker").default;

function PrettyDateInput({
  label,
  value,
  onChange,
  minDate,
  maxDate,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  minDate?: Date;
  maxDate?: Date;
}) {
  const [show, setShow] = useState(false);

  // WEB: input type="date" funciona con string "YYYY-MM-DD" (sin tz)
  if (Platform.OS === "web") {
    return (
      <View style={{ flex: 1, gap: 6 }}>
        <Text style={styles.selectorLabel}>{label}</Text>
        <View
          style={{
            height: 44, borderWidth: 1, borderColor: "#d4d4d8", borderRadius: 12,
            paddingHorizontal: 12, backgroundColor: "#fff", flexDirection: "row",
            alignItems: "center", gap: 8,
          }}
        >
          <Ionicons name="calendar-outline" size={18} color="#6b7280" />
          {/* @ts-ignore */}
          <input
            type="date"
            value={value || ""}
            onChange={(e: any) => onChange(e.target.value)}
            min={minDate ? formatYMDUTC(minDate) : undefined}
            max={maxDate ? formatYMDUTC(maxDate) : undefined}
            style={{
              flex: 1, height: 34, border: "none", outline: "none",
              background: "transparent", color: "#111827", fontSize: 14,
              fontFamily: "System",
            }}
          />
          {value ? (
            <TouchableOpacity onPress={() => onChange("")} style={{ padding: 4 }}>
              <Ionicons name="close-circle" size={16} color="#9ca3af" />
            </TouchableOpacity>
          ) : null}
        </View>
        <Text style={{ fontSize: 11, color: "#6b7280" }}>
          {value ? formatDDMMYYYY(value) : "dd/mm/aaaa"}
        </Text>
      </View>
    );
  }

  // NATIVO: RNDateTimePicker requiere Date; usamos UTC para evitar desfases
  const initial = value ? ymdToUTCDate(value)! : (minDate ?? new Date());

  return (
    <View style={{ flex: 1, gap: 6 }}>
      <Text style={styles.selectorLabel}>{label}</Text>
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => setShow(true)}
        style={{
          height: 44, borderWidth: 1, borderColor: "#d4d4d8", borderRadius: 12,
          paddingHorizontal: 12, backgroundColor: "#fff", flexDirection: "row",
          alignItems: "center", gap: 8,
        }}
      >
        <Ionicons name="calendar-outline" size={18} color="#6b7280" />
        <Text style={{ flex: 1, color: value ? "#111827" : "#9ca3af", fontSize: 14 }}>
          {value ? formatDDMMYYYY(value) : "dd/mm/aaaa"}
        </Text>
        {value ? (
          <TouchableOpacity onPress={() => onChange("")} style={{ paddingHorizontal: 4 }}>
            <Ionicons name="close-circle" size={16} color="#9ca3af" />
          </TouchableOpacity>
        ) : null}
      </TouchableOpacity>

      {show && RNDateTimePicker ? (
        <RNDateTimePicker
          mode="date"
          display={Platform.OS === "android" ? "calendar" : "inline"}
          value={initial}
          onChange={(event: any, selected?: Date) => {
            if (Platform.OS === "android") setShow(false);
            if (event.type === "set" && selected) onChange(formatYMDUTC(selected));
          }}
          minimumDate={minDate}
          maximumDate={maxDate}
        />
      ) : null}
    </View>
  );
}

export function DateRange({
  value,
  onChange,
  minDate,
  maxDate,
}: {
  value: Range;
  onChange: (r: Range) => void;
  minDate?: Date;
  maxDate?: Date;
}) {
  const setFrom = (v: string) => onChange({ from: v, to: value.to });
  const setTo   = (v: string) => onChange({ from: value.from, to: v });

  return (
    <View style={{ gap: 10 }}>
      <View style={styles.dateRow}>
        <PrettyDateInput label="Desde" value={value.from} onChange={setFrom} minDate={minDate} maxDate={maxDate} />
        <PrettyDateInput label="Hasta" value={value.to}   onChange={setTo}   minDate={minDate} maxDate={maxDate} />
      </View>
    </View>
  );
}
