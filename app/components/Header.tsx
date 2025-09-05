import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useNavigation, useNavigationState } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React from 'react';
import { Platform, Text as RNText, TouchableOpacity, View } from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { RootStackParamList } from '../navigation/AppNavigator';
import { showConfirm } from '../utils/AlertService';
import { styles } from './styles/Header.styles';

export default function Header() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { logout, user } = useAuth();
  const canGoBack = useNavigationState(state => state?.routes?.length > 1);

  const handleNavigateToProfile = () => navigation.navigate('EditProfile');

  const handleLogout = () => {
    showConfirm('Cerrar sesión', '¿Estás seguro de que deseas cerrar sesión?', async () => {
      try { await logout(); } catch (e) { console.error('Error al cerrar sesión:', e); }
    });
  };

  // hitSlop cómodo para iconos pequeños
  const hit = { top: 8, bottom: 8, left: 8, right: 8 };

  return (
    <View style={styles.header}>
      <View style={styles.leftIcons}>
        {Platform.OS === 'web' && canGoBack && (
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.icon} hitSlop={hit}
            accessibilityRole="button" accessibilityLabel="Volver">
            <Ionicons name="arrow-back" size={24} color="#000" />
          </TouchableOpacity>
        )}
        <TouchableOpacity onPress={handleNavigateToProfile} hitSlop={hit}
          accessibilityRole="button" accessibilityLabel="Perfil">
          <Ionicons name="person-circle-outline" size={32} color="#000" />
        </TouchableOpacity>
      </View>

      <View style={styles.rightIcons}>
        {user?.role === 'atleta' && (
          <TouchableOpacity
            style={styles.icon}
            onPress={() => navigation.navigate('AI')}
            hitSlop={hit}
            accessibilityRole="button"
            accessibilityLabel="Abrir asistente de IA"
          >
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <RNText style={{ marginRight: 4, fontSize: 14, color: '#000', fontWeight: '500' }}>
                AI
              </RNText>
              <Ionicons name="sparkles-outline" size={20} color="#000" />
            </View>
          </TouchableOpacity>
        )}

        <TouchableOpacity style={styles.icon} onPress={() => navigation.navigate('Chats')}
          hitSlop={hit} accessibilityRole="button" accessibilityLabel="Chats">
          <MaterialIcons name="chat-bubble-outline" size={24} color="#000" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.icon} hitSlop={hit}
          accessibilityRole="button" accessibilityLabel="Notificaciones">
          <Ionicons name="notifications-outline" size={24} color="#000" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.icon} onPress={handleLogout} hitSlop={hit}
          accessibilityRole="button" accessibilityLabel="Cerrar sesión">
          <Ionicons name="log-out-outline" size={24} color="#d9534f" />
        </TouchableOpacity>
      </View>
    </View>
  );
}
