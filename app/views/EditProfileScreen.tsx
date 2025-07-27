// /views/EditProfileScreen.tsx
import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { Alert, Button, Text, TextInput, View } from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { updateUser } from '../services/UserService';
import { styles } from './styles/EditProfileScreen.styles';

export default function EditProfileScreen() {
  const { user } = useAuth();
  const navigation = useNavigation();

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
      Alert.alert('Éxito', 'Perfil actualizado correctamente');
    } catch (error) {
      Alert.alert('Error', 'No se pudo actualizar el perfil');
      console.error(error);
    }
  };

  return (
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
      <Button title="Home" onPress={() => navigation.goBack()} color="#aaa" />
    </View>
  );
}
