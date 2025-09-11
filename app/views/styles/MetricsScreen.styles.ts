// /views/styles/MetricsScreen.styles.ts
import { Platform, StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 24,
    alignItems: 'center',
  },

  // Header
  header: {
    width: '100%',
    marginBottom: 12,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: '#111',
    fontFamily: 'System',
  },

  // Fila de filtros
  filterRow: {
    width: '100%',
    gap: 12,
    marginBottom: 16,
    // importante para que el dropdown pueda “salirse”
    overflow: 'visible',
  },

  // Selector / etiquetas
  selectorBox: { width: '100%' },
  selectorLabel: {
    fontSize: 13,
    color: '#555',
    marginBottom: 6,
    fontFamily: 'System',
  },

  // Picker (si lo sigues usando en otros lados)
  pickerWrapper: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: '#fff',
  },
  picker: { width: '100%', height: 52, fontFamily: 'System', color: '#111' },
  pickerItem: { fontSize: 16, height: 52, fontFamily: 'System' },

  // Toggle (reps / peso)
  toggleRow: { flexDirection: 'row', gap: 10 },
  toggleBtn: {
    flexGrow: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  toggleBtnActive: { borderColor: '#3b82f6', backgroundColor: '#e7f0ff' },
  toggleText: { fontSize: 13, color: '#333', fontWeight: '600', fontFamily: 'System' },
  toggleTextActive: { color: '#1d4ed8' },

  // Fechas
  dateRow: { flexDirection: 'row', gap: 10, width: '100%' },
  dateCol: { flex: 1 },
  dateButton: {
    height: 44,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    paddingHorizontal: 12,
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
  dateValue: { color: '#111', fontSize: 14, fontFamily: 'System' },

  // Card del gráfico
  chartCard: {
    backgroundColor: '#fff',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#eee',
    paddingVertical: 6,
    paddingHorizontal: 6,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
    width: '100%',
  },

  // ========== SearchableComboBox ==========
  comboRoot: {
    position: 'relative',
    width: '100%',
    zIndex: 1, // stacking en RN
  },
  // cuando está abierto, reservamos espacio para que no tape lo de abajo
  comboRootOpened: {
    marginBottom: 236, // 220 de dropdown + 16 de respiro
    zIndex: 1000,
  },
  comboField: {
    height: 52,
    borderWidth: 1,
    borderColor: '#d4d4d8',
    borderRadius: 10,
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  comboValueText: { fontSize: 15, color: '#111827' },
  comboDropdown: {
    position: 'absolute',
    top: 56,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 10,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    zIndex: 2000,
    ...(Platform.OS === 'android' ? { elevation: 6 } : {}),
  },
  comboSearchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  comboInput: { flex: 1, height: 36, fontSize: 14, color: '#111827' },
  comboSep: { height: 1, backgroundColor: '#f3f4f6' },
  comboOptionRow: { paddingHorizontal: 12, paddingVertical: 10 },
  comboOptionText: { fontSize: 14, color: '#111827' },
  comboEmptyBox: { padding: 12, alignItems: 'center' },
  comboEmptyText: { fontSize: 12, color: '#6b7280' },

  // ========== DailySeriesList ==========
  detailsContainer: {
    width: '100%',
    marginTop: 12,
    gap: 10,
  },
  dayCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#eee',
    padding: 12,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    ...(Platform.OS === 'android' ? { elevation: 1 } : {}),
  },
  dayHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  dayTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111',
  },
  dayAvg: {
    fontSize: 13,
    fontWeight: '600',
    color: '#374151',
  },
  daySeriesRow: {
    marginTop: 2,
  },
  daySeriesText: {
    fontSize: 13,
    color: '#333',
  },
});

// Solo para elementos web “puros” (ej: <input type="date" />)
export const webStyles = {
  dateHtmlInput: {
    flex: 1,
    height: 34,
    border: 'none',
    outline: 'none',
    background: 'transparent',
    color: '#111827',
    fontSize: 14,
    fontFamily: 'System',
  } as any,
};
