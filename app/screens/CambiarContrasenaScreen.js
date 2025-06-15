import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { cambiarContrasena } from '../services/authService';
import { MaterialIcons } from '@expo/vector-icons';

export default function CambiarContrasenaScreen({ navigation }) {
  const [nick, setNick] = useState('');
  const [actual, setActual] = useState('');
  const [nueva, setNueva] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCambiar = async () => {
    setMensaje('');
    setError('');
    if (!nick || !actual || !nueva) {
      setError('Completa todos los campos.');
      return;
    }
    setLoading(true);
    try {
      await cambiarContrasena(nick, actual, nueva);
      setMensaje('¡Contraseña cambiada correctamente!');
      setNick(''); setActual(''); setNueva('');
    } catch (e) {
      setError(e.message || 'Ocurrió un error al cambiar la contraseña.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Pressable style={styles.backButton} onPress={() => navigation.goBack()}>
          <MaterialIcons name="arrow-back" size={26} color="#321c69" />
        </Pressable>
        <Text style={styles.title}>Cambiar contraseña</Text>
        <TextInput
          style={styles.input}
          placeholder="Usuario"
          value={nick}
          onChangeText={setNick}
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholder="Contraseña actual"
          value={actual}
          onChangeText={setActual}
          secureTextEntry
        />
        <TextInput
          style={styles.input}
          placeholder="Nueva contraseña"
          value={nueva}
          onChangeText={setNueva}
          secureTextEntry
        />
        {error ? <Text style={styles.error}>{error}</Text> : null}
        {mensaje ? <Text style={styles.success}>{mensaje}</Text> : null}
        <Pressable style={[styles.button, loading && { opacity: 0.7 }]} onPress={handleCambiar} disabled={loading}>
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Cambiar</Text>}
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 28,
    width: '100%',
    maxWidth: 400,
    elevation: 4,
    shadowColor: '#321c69',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#321c69',
  },
  input: {
    width: '100%',
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    backgroundColor: '#fafaff',
    fontSize: 16,
  },
  button: {
    backgroundColor: '#321c69',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
    marginTop: 10,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  backButton: {
    position: 'absolute',
    top: 16,
    left: 16,
    backgroundColor: '#f3f0fa',
    borderRadius: 20,
    padding: 6,
    elevation: 2,
    zIndex: 10,
  },
  error: {
    color: 'red',
    fontSize: 15,
    marginBottom: 10,
    textAlign: 'center',
  },
  success: {
    color: 'green',
    fontSize: 15,
    marginBottom: 10,
    textAlign: 'center',
  },
}); 