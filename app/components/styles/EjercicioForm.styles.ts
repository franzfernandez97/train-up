import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    padding: 16,
    gap: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
  },
  field: {
    gap: 6,
    marginBottom: 8,
  },
  label: {
    fontSize: 13,
    color: '#333',
    fontWeight: '600',
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 44,
    borderWidth: 1,
    borderColor: '#e6e6e6',
  },
  textarea: {
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingTop: 10,
    minHeight: 110,
    borderWidth: 1,
    borderColor: '#e6e6e6',
    lineHeight: 20,
  },
  inputError: {
    borderColor: '#ff9b9b',
    backgroundColor: '#fff7f7',
  },
  errorText: {
    color: '#c62828',
    fontSize: 12,
  },

  // 🫧 burbujas (mismos estilos que en EjercicioGestionScreen)
  chipsRow: {
    paddingVertical: 2,
  },
  chipBubble: {
    marginRight: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: '#f2f2f2',
    borderWidth: 1,
    borderColor: '#e5e5e5',
  },
  chipBubbleActive: {
    backgroundColor: '#E8F1FF',
    borderColor: '#A7C7FF',
  },
  chipBubbleText: {
    fontSize: 13,
    color: '#333',
    fontWeight: '600',
  },
  chipBubbleTextActive: {
    color: '#0A5FFF',
  },

  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
    marginTop: 4,
  },
  cancelBtn: {
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: '#f1f1f1',
  },
  cancelText: {
    fontWeight: '600',
    color: '#333',
  },
  submitBtn: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: '#007AFF',
  },
  submitText: {
    fontWeight: '700',
    color: '#fff',
  },
});
