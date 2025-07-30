import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React from 'react';
import {
    ActivityIndicator,
    FlatList,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import RoleBasedLayout from '../components/RoleBasedLayout';
import { RootStackParamList } from '../navigation/AppNavigator';
import useSeleccionarUsuarioChat from '../viewmodels/useSeleccionaUsuarioChat';
import { styles } from './styles/SeleccionarUsuarioChat.style';

export default function SeleccionarUsuarioChatScreen() {
    const { relaciones, loading,  busqueda, setBusqueda } = useSeleccionarUsuarioChat();
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
                <Text style={styles.header}>Selecciona un Usuario</Text>

                {/* 🔍 Campo de búsqueda */}
                <TextInput
                    value={busqueda}
                    onChangeText={setBusqueda}
                    placeholder="Buscar por nombre o email"
                    style={styles.searchInput}
                />

                <FlatList
                    data={relaciones}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            style={styles.card}
                            onPress={() => navigation.navigate('Conversacion', { usuario: item })}
                        >
                            <Text style={styles.name}>{item.name}</Text>
                            <Text style={styles.email}>{item.email}</Text>
                        </TouchableOpacity>
                    )}
                />
            </View>
        </RoleBasedLayout>

    );
}
