import { Ionicons } from '@expo/vector-icons';
import { RouteProp, useRoute } from '@react-navigation/native';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import RoleBasedLayout from '../components/RoleBasedLayout';
import { useAuth } from '../contexts/AuthContext';
import { RootStackParamList } from '../navigation/AppNavigator';
import { enviarMensaje } from '../services/MensajeService';
import useConversacion from '../viewmodels/useConversacion';
import { styles } from './styles/ConversacionScreen.style';

type ConversacionRouteProp = RouteProp<RootStackParamList, 'Conversacion'>;

export default function ConversacionScreen() {
  const route = useRoute<ConversacionRouteProp>();
  const { usuario } = route.params;
  const { mensajes, loading, refrescarMensajes } = useConversacion(usuario);
  const [nuevoMensaje, setNuevoMensaje] = useState('');
  const { user } = useAuth();
  const handleEnviarMensaje = async () => {
    if (nuevoMensaje.trim() === '') return;

    const exito = await enviarMensaje(nuevoMensaje, usuario.id);

    if (exito) {
      setNuevoMensaje('');
      refrescarMensajes(); // vuelve a cargar el chat
    } else {
      console.error('Error al enviar el mensaje');
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <RoleBasedLayout>
      <View style={styles.container}>
        <Text style={styles.header}>{usuario.name}</Text>

        <FlatList
          data={mensajes}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => {
            const esMio = item.emisor_id === user?.id;
            return (
              <View
                style={[
                  styles.messageBubble,
                  esMio ? styles.myMessage : styles.theirMessage,
                ]}
              >
                <Text style={styles.messageText}>{item.contenido}</Text>

                <View style={styles.footer}>
                  <Text style={styles.timestamp}>
                    {new Date(item.fechaHora).toLocaleString('es-CO', {
                      hour: '2-digit',
                      minute: '2-digit',
                      day: '2-digit',
                      month: '2-digit',
                    })}
                  </Text>

                  {/* ✔✔ solo si es mío */}
                  {esMio && (
                    <Ionicons
                      name="checkmark-done"
                      size={16}
                      color={item.estado === 'leido' ? '#007AFF' : '#888'}
                      style={styles.checkIcon}
                    />
                  )}
                </View>
              </View>
            );
          }}
        />
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          value={nuevoMensaje}
          onChangeText={setNuevoMensaje}
          placeholder="Escribe tu mensaje..."
          style={styles.input}
          multiline
        />
        <TouchableOpacity style={styles.sendButton} onPress={handleEnviarMensaje}>
          <Text style={styles.sendButtonText}>Enviar</Text>
        </TouchableOpacity>
      </View>
    </RoleBasedLayout>
  );
}
