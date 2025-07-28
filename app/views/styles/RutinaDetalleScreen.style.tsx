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
card: {
  flexDirection: 'row',
  alignItems: 'center',
  backgroundColor: '#fff',
  padding: 12,
  borderRadius: 8,
  marginBottom: 10,
  gap: 10,
},

leftIcon: {
  marginRight: 8,
},

cardContent: {
  flex: 1,
},

infoIcon: {
  marginLeft: 8,
  color: '#333',
},

title: {
  fontWeight: 'bold',
  fontSize: 14,
},

subtitle: {
  fontSize: 12,
  color: '#666',
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
});