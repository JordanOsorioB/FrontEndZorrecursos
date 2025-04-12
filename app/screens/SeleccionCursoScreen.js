import React from "react";
import { View, Text, StyleSheet, Pressable, Image } from "react-native";

export default function SeleccionCursoScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Image
        source={require("../../assets/Aprehender.png")} // Asegúrate de colocar la imagen en assets
        style={styles.logo}
      />
      <Text style={styles.title}>¿Cómo quieres registrarte?</Text>

      {/* Botón de Registro Individual (Deshabilitado) */}
      <Pressable style={[styles.button, styles.disabledButton]} disabled>
        <Text style={styles.disabledButtonText}>
          Ingreso estudiante (Próximamente)
        </Text>
      </Pressable>

      {/* Botón de Registro en un Establecimiento */}
      <Pressable
        style={({ pressed }) => [
          styles.button,
          styles.primaryButton,
          pressed && styles.pressedButton, // Cambio de opacidad al presionar
        ]}
        onPress={() => navigation.navigate("LoginDocente")}
      >
        <Text style={styles.buttonText}>Ingreso docente</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fafafa",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 30,
    textAlign: "center",
  },
  logo: {
    width: 150, // Ajusta el tamaño según sea necesario
    height: 150,
    marginBottom: 20,
  },
  button: {
    width: "80%",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 10,
  },
  primaryButton: {
    backgroundColor: "#321c69",
  },
  pressedButton: {
    opacity: 0.7,
  },
  disabledButton: {
    backgroundColor: "#b4abc9",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  disabledButtonText: {
    color: "#666",
    fontSize: 16,
    fontWeight: "bold",
  },
});
