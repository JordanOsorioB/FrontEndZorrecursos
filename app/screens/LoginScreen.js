import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  Alert,
  Image,
  ActivityIndicator
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useAuth } from "../AuthContext";
import logopng from '../../assets/logopng.png';

export default function LoginScreen({ navigation }) {
  const [usuario, setUsuario] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleLogin = async () => {
    setError("");

    if (!usuario || !password) {
      setError("⚠️ Usuario y contraseña son obligatorios.");
      return;
    }

    // Credenciales provisionales
    if (usuario === "Zorrecursos" && password === "1234") {
      Alert.alert(
        "✅ Inicio de sesión exitoso",
        "Bienvenido a Zorrecursos"
      );
      return;
    }

    setLoading(true);
    try {
      const data = await login(usuario, password);
      Alert.alert(
        "✅ Inicio de sesión exitoso",
        `Bienvenido ${data.user.username}`
      );
    } catch (error) {
      setError(error.message || "⚠️ Error iniciando sesión.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Image source={logopng} style={{ width: 100, height: 100, alignSelf: 'center', marginBottom: 40, marginTop: 24 }} />
      <Text style={styles.title}>Iniciar Sesión</Text>
      {error ? <Text style={styles.error}>{error}</Text> : null}

      <TextInput
        style={styles.input}
        placeholder="Usuario"
        value={usuario}
        onChangeText={setUsuario}
        editable={!loading}
      />

      <View style={styles.passwordContainer}>
        <TextInput
          style={styles.passwordInput}
          placeholder="Contraseña"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!showPassword}
          editable={!loading}
        />
        <Pressable
          style={styles.eyeIcon}
          onPress={() => setShowPassword(!showPassword)}
          disabled={loading}
        >
          <MaterialIcons
            name={showPassword ? "visibility" : "visibility-off"}
            size={24}
            color="gray"
          />
        </Pressable>
      </View>

      <Pressable style={[styles.button, loading && { opacity: 0.7 }]} onPress={handleLogin} disabled={loading}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Iniciar sesión</Text>}
      </Pressable>

      <Pressable
        style={styles.link}
        onPress={() => navigation.navigate('CambiarContrasena')}
        disabled={loading}
      >
        <Text style={styles.linkText}>Cambiar contraseña</Text>
      </Pressable>

      {loading && (
        <View style={styles.overlay}>
          <ActivityIndicator size="large" color="#321c69" />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingTop: 48,
    paddingBottom: 48,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    width: "80%",
    padding: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    backgroundColor: "#fff",
    color: '#000',
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "80%",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    backgroundColor: "#fff",
    paddingHorizontal: 10,
  },
  passwordInput: {
    flex: 1,
    padding: 10,
    color: '#000',
  },
  eyeIcon: {
    padding: 5,
  },
  button: {
    backgroundColor: "#321c69",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 10,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  link: {
    marginTop: 15,
  },
  linkText: {
    color: "#007bff",
    fontSize: 14,
    textDecorationLine: "underline",
  },
  error: {
    color: "red",
    fontSize: 14,
    marginBottom: 10,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255,255,255,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 100,
  },
});
