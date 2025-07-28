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
  alignItems: 'flex-start',
  backgroundColor: '#fff',
  padding: 12,
  borderRadius: 8,
  marginBottom: 10,
  gap: 10,
},

leftIcon: {
  marginTop:10,
  width: 60,
  height: 60,
},

cardContent: {
  flex: 2,
  justifyContent: 'center',
},

commentContainer: {
  flex: 1.2,
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

infoIcon: {
  width: 24,
  justifyContent: 'center',
  marginTop: 4,
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

});
