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
    marginBottom: 30,
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
});
