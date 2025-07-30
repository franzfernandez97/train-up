import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useNavigation, useNavigationState } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React from 'react';
import { Platform, TouchableOpacity, View } from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { RootStackParamList } from '../navigation/AppNavigator';
import { showConfirm } from '../utils/AlertService';
import { styles } from './styles/Header.styles';


export default function Header() {

  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { logout } = useAuth();
  const canGoBack = useNavigationState(state => state?.routes?.length > 1);

  const handleNavigateToProfile = () => {
    navigation.navigate('EditProfile');
  };

  const handleLogout = () => {
    showConfirm(
      'Cerrar sesión',
      '¿Estás seguro de que deseas cerrar sesión?',
      async () => {
        try {
          await logout();
        } catch (e) {
          console.error('Error al cerrar sesión:', e);
        }
      }
    );
  };


  return (
    <View style={styles.header}>

      <View style={styles.leftIcons}>
        {/* Icono "Volver" solo en web y si hay historial */}
        {Platform.OS === 'web' && canGoBack && (
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.icon}>
            <Ionicons name="arrow-back" size={24} color="#000" />
          </TouchableOpacity>
        )}

        {/* Icono para volver o editar perfil */}
        <TouchableOpacity onPress={handleNavigateToProfile}>
          <Ionicons name="person-circle-outline" size={32} color="#000" />
        </TouchableOpacity>
      </View>
      {/* Chat, Notificación, Logout */}
      <View style={styles.rightIcons}>
        <TouchableOpacity 
          style={styles.icon}
          onPress={()=> navigation.navigate('Chats')}
          >
          <MaterialIcons name="chat-bubble-outline" size={24} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.icon}>
          <Ionicons name="notifications-outline" size={24} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.icon}
          onPress={() => {
            handleLogout();
          }}
        >
          <Ionicons name="log-out-outline" size={24} color="#d9534f" />
        </TouchableOpacity>
      </View>
    </View>
  );
}
