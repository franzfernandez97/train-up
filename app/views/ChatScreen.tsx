import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React from 'react';
import { ActivityIndicator, FlatList, Image, Text, TouchableOpacity, View } from 'react-native';
import RoleBasedLayout from '../components/RoleBasedLayout';
import { RootStackParamList } from '../navigation/AppNavigator';
import useChatViewModel from '../viewmodels/useChat';
import { styles } from './styles/ChatScreen.style';

export default function ChatsScreen() {
    const { chats, loading } = useChatViewModel();
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

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
                <Text style={styles.title}>Contactos</Text>

                <FlatList
                    data={chats}
                    keyExtractor={(item) => item.usuario.id.toString()}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            style={styles.chatCard}
                            onPress={() => navigation.navigate('Conversacion', { usuario: item.usuario })}
                        >
                            <Image
                                source={require('../assets/images/entrenador.png')} // icono constante
                                style={styles.icon}
                            />
                            <View style={styles.chatContent}>
                                <Text style={styles.name}>{item.usuario.name}</Text>
                                <Text style={styles.subtitle}>último mensaje</Text>
                                <Text style={styles.timestamp}>
                                    {new Date(item.mensaje.fechaHora).toLocaleString('es-CO', {
                                        day: '2-digit',
                                        month: '2-digit',
                                        year: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit',
                                        hour12: false,
                                    })}
                                </Text>
                                <Text style={styles.status}>
                                    Estado: {item.mensaje.estado === 'leido' ? 'Leído' : 'No leído'}
                                </Text>
                            </View>

                        </TouchableOpacity>

                    )}
                />
            </View>
            
            <TouchableOpacity
            style={styles.fab}
            onPress={() => navigation.navigate('SeleccionarUsuarioChatScreen')}
            >
            <Text style={styles.fabIcon}>＋</Text>
            </TouchableOpacity>

            
        </RoleBasedLayout>
    );
}
