import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#f2f2f2',
    flex: 1,
  },

  header: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },

  list: {
    gap: 10,
  },

  startButton: {
    backgroundColor: '#1E4FD8',
    padding: 14,
    borderRadius: 6,
    marginTop: 20,
    alignItems: 'center',
  },

  startButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },

  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    gap: 10,
  },

  // Columna 1: ícono de grupo muscular
  leftIconContainer: {
    flex: 0.7,
    justifyContent: 'center',
    alignItems: 'center',
  },

  leftIcon: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
  },

  // Columna 2: contenido principal (nombre, series, etc.)
  cardContent: {
    flex: 2.5,
    justifyContent: 'center',
  },

  title: {
    fontWeight: 'bold',
    fontSize: 14,
  },

  subtitle: {
    fontSize: 12,
    color: '#666',
  },

  // Columna 3: comentario expandible
  commentContainer: {
    flex: 1.3,
    justifyContent: 'center',
    paddingHorizontal: 4,
    flexShrink: 1,
  },

  commentText: {
    fontSize: 10,
    fontStyle: 'italic',
    color: '#444',
    lineHeight: 16,
  },

  // Columna 4: ícono de información
  infoIconContainer: {
    flex: 0.5,
    justifyContent: 'center',
    alignItems: 'center',
  },

  infoIcon: {
    color: '#333',
  },
});
