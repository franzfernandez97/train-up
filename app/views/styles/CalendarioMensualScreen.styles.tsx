import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fefefe',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    textTransform: 'capitalize',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  diaSemana: {
    width: '14.28%',
    textAlign: 'center',
    fontWeight: 'bold',
    marginBottom: 6,
    color: '#333',
  },
  dia: {
    width: '14.28%',
    aspectRatio: 1, // cuadrado
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    marginBottom: 2,
    backgroundColor: '#fff',
    borderRadius: 8,
  },
  diaHoy: {
    borderColor: '#ff4d4d',
    borderWidth: 2,
    backgroundColor: '#ffeaea',
  },
  diaConRutina: {
    backgroundColor: '#d0f0d0',
    borderColor: '#4caf50',
    borderWidth: 2,
  },
  diaFueraMes: {
  opacity: 0.3,
},
});
