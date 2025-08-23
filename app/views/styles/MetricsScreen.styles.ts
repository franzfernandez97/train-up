import { StyleSheet } from 'react-native';

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
  },

  // Fila de filtros
  filterRow: {
    width: '100%',
    gap: 12,
    marginBottom: 16,
  },

  // Selector (Picker)
  selectorBox: {
    width: '100%',
  },
  selectorLabel: {
    fontSize: 13,
    color: '#555',
    marginBottom: 6,
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: '#fff',
  },
  picker: {
    width: '100%',
    height: 52, // alto mayor
  },
  pickerItem: {
    fontSize: 16, // iOS
    height: 52,
  },

  // Toggle
  toggleRow: {
    flexDirection: 'row',
    gap: 10,
  },
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
  toggleBtnActive: {
    borderColor: '#3b82f6',
    backgroundColor: '#e7f0ff',
  },
  toggleText: {
    fontSize: 13,
    color: '#333',
    fontWeight: '600',
  },
  toggleTextActive: {
    color: '#1d4ed8',
  },

  // Fechas
  dateRow: {
    flexDirection: 'row',
    gap: 10,
    width: '100%',
  },
  dateCol: {
    flex: 1,
  },
  dateButton: {
    height: 44,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    paddingHorizontal: 12,
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
  dateValue: {
    color: '#111',
    fontSize: 14,
  },

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
});
