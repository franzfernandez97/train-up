import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'flex-start',
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingTop: 12,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
  },
  buttonContainer: {
    width: '100%',
  },
  rutinaBox: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderWidth: 1,
    borderColor: '#333',
    borderRadius: 8,
    backgroundColor: '#fffbe6',
    marginBottom: 12,
  },
  rutinaNombre: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  rutinaId: {
    fontStyle: 'italic',
    fontSize: 12,
  },
  // === estilos extras para HomeEntrenador ===
  saludo: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  etiqueta: {
    fontSize: 16,
    fontStyle: 'italic',
    marginBottom: 12,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#2c3e50',
    borderRadius: 6,
    padding: 12,
    marginBottom: 14,
    backgroundColor: '#fff',
  },
  avatarWrap: {
    width: 54,
    height: 54,
    borderRadius: 27,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#2c3e50',
  },
  nombre: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  estadoPendiente: {
    fontSize: 13,
    marginTop: 2,
    fontStyle: 'italic',
    color: '#7f8c8d',
  },
  estadoAsignada: {
    fontSize: 13,
    marginTop: 2,
    fontStyle: 'italic',
    color: '#2ecc71',
  },
});
