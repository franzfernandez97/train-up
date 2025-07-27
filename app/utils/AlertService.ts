// /utils/AlertService.ts
import { Alert, Platform } from 'react-native';

/**
 * Muestra una alerta informativa.
 * En web usa window.alert, en móvil usa Alert.alert de React Native.
 */
export const showAlert = (title: string, message?: string, onOk?: () => void) => {
  if (Platform.OS === 'web') {
    window.alert(`${title}${message ? '\n\n' + message : ''}`);
    if (onOk) onOk();
  } else {
    Alert.alert(
      title,
      message,
      [{ text: 'OK', onPress: () => onOk?.() }],
      { cancelable: false }
    );
  }
};

/**
 * Muestra una alerta de confirmación con dos botones: Cancelar y Aceptar
 * `onConfirm` se ejecuta si el usuario acepta.
 */
export const showConfirm = (
  title: string,
  message: string,
  onConfirm: () => void,
  onCancel?: () => void
) => {
  if (Platform.OS === 'web') {
    const confirmed = window.confirm(`${title}\n\n${message}`);
    if (confirmed) {
      onConfirm();
    } else {
      onCancel?.();
    }
  } else {
    Alert.alert(
      title,
      message,
      [
        { text: 'Cancelar', onPress: () => onCancel?.(), style: 'cancel' },
        { text: 'Aceptar', onPress: onConfirm, style: 'default' },
      ],
      { cancelable: true }
    );
  }
};
