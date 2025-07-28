import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#f4f4f4',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  videoContainer: {
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 20,
    backgroundColor: '#000',
  },
  videoPlaceholder: {
    padding: 16,
    textAlign: 'center',
    color: 'white',
  },
  instructionsBlock: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 20,
  },
  subHeader: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 8,
  },
  instructionLine: {
    fontSize: 14,
    color: '#333',
    marginBottom: 4,
  },
  goalBlock: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 16,
  },
  goalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  goalIcon: {
    marginRight: 8,
    color: '#333',
  },
  goalText: {
    fontSize: 14,
    color: '#333',
  },
});
