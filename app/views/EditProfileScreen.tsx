import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import { Button, Text, TextInput, View } from 'react-native';
import RoleBasedLayout from '../components/RoleBasedLayout';
import { useAuth } from '../contexts/AuthContext';
import { RootStackParamList } from '../navigation/AppNavigator';
import { updateUser } from '../services/UserService';
import { showAlert } from '../utils/AlertService'; // ✅ importación del servicio
import { styles } from './styles/EditProfileScreen.styles';

export default function EditProfileScreen() {
  const { user } = useAuth();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const [name, setName] = useState(user?.name ?? '');
  const [email, setEmail] = useState(user?.email ?? '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = async () => {
    try {
      await updateUser(user!.id, {
        name,
        email,
        current_password: currentPassword,
        new_password: newPassword,
        new_password_confirmation: confirmPassword,
      });
      showAlert('Éxito', 'Perfil actualizado correctamente');
      navigation.navigate('Home');
    } catch (error) {
      showAlert('Error', 'No se pudo actualizar el perfil');
      console.error(error);
    }
  };

  return (
    <RoleBasedLayout>
    <View style={styles.container}>
      <Text style={styles.title}>Editar Perfil</Text>

      <Text>Email</Text>
      <TextInput style={styles.input} value={email} onChangeText={setEmail} />

      <Text>Nombre</Text>
      <TextInput style={styles.input} value={name} onChangeText={setName} />

      <Text>Contraseña actual</Text>
      <TextInput style={styles.input} secureTextEntry value={currentPassword} onChangeText={setCurrentPassword} />

      <Text>Nueva contraseña</Text>
      <TextInput style={styles.input} secureTextEntry value={newPassword} onChangeText={setNewPassword} />

      <Text>Confirmar contraseña</Text>
      <TextInput style={styles.input} secureTextEntry value={confirmPassword} onChangeText={setConfirmPassword} />

      <Button title="Actualizar" onPress={handleSubmit} />

    </View>
    </RoleBasedLayout>

  );
}
