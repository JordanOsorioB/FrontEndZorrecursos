import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage"; // ✅ Para guardar el token
import API_BASE_URL from "../../config";
import { MaterialIcons } from "@expo/vector-icons"; // ✅ Para el ícono del ojo

export default function LoginDocenteScreen({ navigation }) {
  const [usuario, setUsuario] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false); // 👁️ Estado para mostrar/ocultar contraseña

  const handleLogin = async () => {
    setError("");

    if (!usuario || !password) {
      setError("⚠️ Usuario y contraseña son obligatorios.");
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: usuario, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "⚠️ Error iniciando sesión.");
        return;
      }

      if (!data.accessToken || !data.refreshToken) {
        setError("⚠️ No se recibió un token válido.");
        return;
      }

      // ✅ Guardamos los tokens correctamente en AsyncStorage
      await AsyncStorage.setItem("accessToken", data.accessToken);
      await AsyncStorage.setItem("refreshToken", data.refreshToken);
      await AsyncStorage.setItem("userRole", data.user.role);

      Alert.alert(
        "✅ Inicio de sesión exitoso",
        `Bienvenido ${data.user.username}`
      );

      // 🔹 Redirigir según el rol
      if (data.user.role === "TEACHER") {
        navigation.replace("DrawerNavigator");
      } else if (data.user.role === "ADMIN") {
        navigation.replace("DrawerNavigator");
      } else {
        setError("⚠️ No tienes permisos para acceder.");
      }
    } catch (error) {
      console.error("❌ Error en login:", error);
      setError("⚠️ Error al conectar con la API.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Iniciar Sesión</Text>
      {error ? <Text style={styles.error}>{error}</Text> : null}

      <TextInput
        style={styles.input}
        placeholder="Usuario"
        value={usuario}
        onChangeText={setUsuario}
      />

      <View style={styles.passwordContainer}>
        <TextInput
          style={styles.passwordInput}
          placeholder="Contraseña"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!showPassword} // 👁️ Controla si se oculta la contraseña o no
        />
        <Pressable
          style={styles.eyeIcon}
          onPress={() => setShowPassword(!showPassword)}
        >
          <MaterialIcons
            name={showPassword ? "visibility" : "visibility-off"}
            size={24}
            color="gray"
          />
        </Pressable>
      </View>

      <Pressable style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Iniciar sesión</Text>
      </Pressable>

      <Pressable
        style={styles.link}
        onPress={() => navigation.navigate("RegistroEstablecimiento")}
      >
        <Text style={styles.linkText}>Registrarme</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
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
});
