import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: { padding: 16 },
  sectionTitle: { fontWeight: '700', fontSize: 16, marginTop: 10, marginBottom: 8 },
  subTitle: { fontWeight: '600', marginTop: 8, marginBottom: 6 },
  rowWrap: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 8 },
  chip: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 999,
    margin: 6,
    borderWidth: 1,
  },
  chipText: { fontSize: 14 },
  input: {
    borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 10, marginBottom: 12,
  },
  hint: { color: '#666', marginBottom: 8 },
  btn: {
    backgroundColor: '#111', padding: 14, borderRadius: 12, alignItems: 'center', marginTop: 8,
  },
  btnText: { color: '#fff', fontWeight: '700' },
  error: { color: 'red', marginTop: 12 },

  // ===== Overlay de carga =====
  loadingOverlay: {
    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    zIndex: 10, alignItems: 'center', justifyContent: 'center',
  },
  loadingText: { color: '#fff', marginTop: 8, fontWeight: '600' },

  // ===== Resultado inline (si lo sigues usando fuera del modal) =====
  resultBox: { marginTop: 16, borderTopWidth: 1, borderTopColor: '#eee', paddingTop: 12 },
  resultTitle: { fontWeight: '700', fontSize: 16, marginBottom: 6 },
  resultSubtitle: { fontWeight: '600', marginTop: 8 },
  resultText: { marginBottom: 6 },
  resultItem: { marginBottom: 2 },

  // ===== Modal =====
  modalBackdrop: {
    flex: 1, backgroundColor: 'rgba(0,0,0,0.6)',
    alignItems: 'center', justifyContent: 'center', padding: 16,
  },
  modalCard: {
    width: '100%', maxWidth: 720, backgroundColor: '#fff',
    borderRadius: 12, padding: 16,
  },
  modalTitle: { fontSize: 18, fontWeight: '700', marginBottom: 8 },
  modalSection: { marginTop: 8, marginBottom: 12 },
  modalSectionTitle: { fontWeight: '700', marginBottom: 6 },
  modalRow: { flexDirection: 'row', marginBottom: 4, flexWrap: 'wrap' },
  modalLabel: { width: 100, fontWeight: '600', color: '#333' },
  modalValue: { flex: 1, color: '#333' },
  modalRutinaNombre: { fontWeight: '700', marginBottom: 6 },
  modalExplicacion: { color: '#333', marginBottom: 8 },
  modalEjTitle: { fontWeight: '600', marginBottom: 4 },
  modalEjItem: { marginBottom: 2 },

  modalActions: {
    flexDirection: 'row', justifyContent: 'flex-end', gap: 8, marginTop: 8,
  },
  modalBtn: {
    paddingVertical: 10, paddingHorizontal: 16, borderRadius: 10,
  },
  modalBtnSecondary: { backgroundColor: '#eee' },
  modalBtnPrimary: { backgroundColor: '#111' },
  modalBtnTextSecondary: { color: '#111', fontWeight: '700' },
  modalBtnTextPrimary: { color: '#fff', fontWeight: '700' },
});
