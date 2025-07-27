import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { RootStackParamList } from '../navigation/AppNavigator';
import { styles } from './styles/Header.styles';

export default function Header() {
  
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { logout } = useAuth();


  const handleNavigateToProfile = () => {
    console.log("Handle  Navigate");
    navigation.navigate('EditProfile');
  };

const handleLogout = async () => {
  console.log("Handle LogOut");
  console.log("Logout desde Header:", logout);

  try {
    await logout();
    console.log("Sesión cerrada correctamente");
  } catch (e) {
    console.error("Error al cerrar sesión:", e);
  }
};


  return (
    <View style={styles.header}>
      {/* Icono para volver o editar perfil */}
      <TouchableOpacity onPress={handleNavigateToProfile}>
        <Ionicons name="person-circle-outline" size={32} color="#000" />
      </TouchableOpacity>

      {/* Chat, Notificación, Logout */}
      <View style={styles.rightIcons}>
        <TouchableOpacity style={styles.icon}>
          <MaterialIcons name="chat-bubble-outline" size={24} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.icon}>
          <Ionicons name="notifications-outline" size={24} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.icon}
          onPress={() => {
            console.log("Icono Logout presionado");
            handleLogout();
          }}
        >
          <Ionicons name="log-out-outline" size={24} color="#d9534f" />
        </TouchableOpacity>
      </View>
    </View>
  );
}
