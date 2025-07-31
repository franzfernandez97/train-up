import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f4f4f4'
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center'
  },
  card: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  image: {
    width: 60,
    height: 60
  },
  playIcon: {
    position: 'absolute',
    top: 8,
    left: 8
  },
  nombre: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
    marginLeft: 12
  },
  subInfo: {
    marginTop: 6
  },
  insertarMarcas: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12
  },
  insertarTexto: {
    marginLeft: 6
  },
  botonCompletar: {
    backgroundColor: '#d0f0d0',
    padding: 8,
    borderRadius: 6,
    alignSelf: 'flex-end',
    marginTop: 10
  },
  textoCompletar: {
    color: 'green',
    fontWeight: 'bold'
  }
});
