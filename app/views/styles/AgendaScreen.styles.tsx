import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    position: 'relative',
    backgroundColor: '#f8f8f8',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  subTitle: {
    fontSize: 16,
    marginVertical: 10,
  },
  semanaNavegacion: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  diasContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    flex: 1,
  },
  diasFila: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flex: 1,
    marginHorizontal: 8,
    marginBottom: 12,
  },
  diaCard: {
    flex: 1,
    maxWidth: 56, // antes 48
    height: 160,
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 8,
    backgroundColor: 'white',
    position: 'relative',
  },
  diaCardHoy: {
    borderColor: '#aaa',
    borderWidth: 1,
    backgroundColor: '#f0f0f0',
  },
  diaCardSeleccionado: {
    borderColor: '#ff4d4d',
    borderWidth: 2,
    backgroundColor: '#ffecec',
    shadowColor: '#ff4d4d',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },


  diaNombre: {
    fontWeight: 'bold',
  },
  diaNumero: {
    fontSize: 18,
    marginTop: 4,
  },
  iconoAlerta: {
    width: 20,
    height: 20,
    position: 'absolute',
    bottom: 4,
  },
rutinaCard: {
  marginTop: 8,
  padding: 12,
  borderWidth: 1,
  borderColor: '#000',
  borderRadius: 8,
  backgroundColor: '#fff',
  flexDirection: 'row',
  alignItems: 'center',
  gap: 12,
},
  iconoRutina: {
    width: 32,
    height: 32,
    marginRight: 8,
  },
  rutinaTitulo: {
    fontWeight: 'bold',
    fontSize: 16,
    flexWrap: 'wrap',
  },
  rutinaDescripcion: {
    fontStyle: 'italic',
    fontSize: 13,
    flexWrap: 'wrap',
  },
  botonFlotante: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
  botonIcono: {
    color: '#fff',
    fontSize: 32,
    marginTop: -2,
  },
  numeroWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  semanaHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  textoWrapper: {
    flexShrink: 1,
    flex: 1,
  },
rutinaListaContainer: {
  paddingBottom: 100, // espacio para botón flotante
  gap: 16,
},
});
