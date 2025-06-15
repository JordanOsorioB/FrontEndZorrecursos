import AsyncStorage from '@react-native-async-storage/async-storage';
import API_BASE_URL from '../../config';

// Login: recibe username y password, retorna user y token si es exitoso
export async function login(username, password) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Error al iniciar sesión');
    }
    // Guardar token y user en AsyncStorage
    await AsyncStorage.setItem('accessToken', data.token);
    await AsyncStorage.setItem('user', JSON.stringify(data.user));
    return data;
  } catch (error) {
    throw error;
  }
}

// Logout: borra el token y el usuario
export async function logout() {
  await AsyncStorage.removeItem('accessToken');
  await AsyncStorage.removeItem('user');
}

// Obtener el token actual
export async function getToken() {
  return await AsyncStorage.getItem('accessToken');
}

// Obtener el usuario actual
export async function getCurrentUser() {
  const user = await AsyncStorage.getItem('user');
  return user ? JSON.parse(user) : null;
}

export async function cambiarContrasena(username, actual, nueva) {
  // 1. Login para obtener token
  const loginRes = await login(username, actual);
  const { user, token } = loginRes;
  if (!user?.id || !token) throw new Error('No se pudo autenticar');
  // 2. Cambiar contraseña usando el token
  const response = await fetch(`${API_BASE_URL}/api/users/change-password-with-credentials`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      username,
      password: actual,
      newPassword: nueva
    })
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || 'Error cambiando contraseña');
  }
  return true;
} 