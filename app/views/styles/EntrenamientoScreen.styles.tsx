import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 32,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  card: {
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  exerciseTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  videoRow: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  textCol: {
    flex: 1,
    gap: 4,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  infoText: {
    fontSize: 14,
    flexShrink: 1,
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  btnGray: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#e0e0e0',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  btnCheck: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  btnText: {
    fontSize: 14,
    fontWeight: '500',
  },
  videoBox: {
    width: '100%',
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: '#000',
    marginTop: 8, // debajo del título
  },
  // --- 👇 NUEVOS estilos para Marcas ---
  marksContainer: {
    marginTop: 12,
    padding: 10,
    borderRadius: 10,
    backgroundColor: '#f2f2f2',
  },
  marksHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  marksHeaderText: {
    fontWeight: '600',
  },
  marksRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
  },
  marksColSeries: {
    width: 60,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  marksSeriesText: {
    fontSize: 16,
    fontWeight: '600',
  },
  marksCol: {
    flex: 1,
    paddingHorizontal: 6,
  },
  marksColReps: {
    flex: 1.6,   // más ancho que las demás
    paddingHorizontal: 6,
  },
  marksInput: {
    borderWidth: 1,
    borderColor: '#222',
    borderRadius: 6,
    backgroundColor: '#fff',
    paddingVertical: 6,
    paddingHorizontal: 10,
    fontSize: 16,
  },
  //Boton finalizacion de entrenamiento
  finishButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#e53935', // rojo, puedes cambiarlo
    paddingVertical: 14,
    borderRadius: 8,
    marginTop: 20,
  },
  finishButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },

});
