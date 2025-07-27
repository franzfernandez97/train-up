import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import { styles } from './styles/LoginScreen.styles';

import { useAuth } from '../contexts/AuthContext';
import { RootStackParamList } from '../navigation/AppNavigator';

export default function LoginScreen() {
  const { login, loading, error } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  return (
    <View style={styles.container}>
      {/* Logo circular */}
      <View style={styles.logoContainer}>
        <View style={styles.logoCircle}>
          <Image source={require('../../assets/images/logo.png')} style={styles.logo} />
        </View>
      </View>

      <Text style={styles.title}>Iniciar Sesión</Text>

      {/* Input Email */}
      <TextInput
        style={styles.input}
        placeholder="name@example.com"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />

      {/* Input Password */}
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      {/* Error */}
      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      {/* Botón Iniciar sesión */}
      <TouchableOpacity
        style={[styles.button, { backgroundColor: '#C0C0C0' }]}
        onPress={() => login(email, password)}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#000" />
        ) : (
          <Text style={styles.buttonText}>Iniciar Sesión</Text>
        )}
      </TouchableOpacity>

      {/* Botón Registro */}
      <TouchableOpacity
        style={[styles.button, { backgroundColor: '#1E4FD8' }]}
        onPress={() => navigation.navigate('SignUp')}
      >
        <Text style={[styles.buttonText, { color: '#fff' }]}>Registrarse</Text>
      </TouchableOpacity>

      {/* Forgot Password */}
      <TouchableOpacity onPress={() => console.log('Forgot Password')}>
        <Text style={styles.forgotText}>¿Olvidaste la contraseña?</Text>
      </TouchableOpacity>
    </View>
  );
}