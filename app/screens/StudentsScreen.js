import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Pressable,
  Alert,
  TextInput,
} from "react-native";
import API_BASE_URL from "../../config";

export default function StudentsScreen({ route }) {
  const [students, setStudents] = useState([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  // Verificar que route.params no sea undefined antes de acceder a courseId
  // const courseId = route?.params?.courseId || null;
  const courseId = "d54efb63-70d6-4f1e-bc96-789cf49acaf9"; // 📌 ID Fijo para pruebas

  useEffect(() => {
    if (courseId) {
      console.log("Obteniendo estudiantes para el curso:", courseId);

      fetchStudents();
    }
  }, [courseId]);

  const fetchStudents = async () => {
    if (!courseId) {
      console.error("Error: courseId es undefined");
      return;
    }

    try {
      const response = await fetch(
        `${API_BASE_URL}/students/course/${courseId}`
      );
      if (!response.ok) {
        throw new Error("Error obteniendo la lista de estudiantes");
      }
      const data = await response.json();
      setStudents(data);
    } catch (error) {
      console.error("Error cargando estudiantes:", error);
    }
  };

  const addStudent = async () => {
    if (!name || !email || !courseId) {
      Alert.alert("⚠️ Error", "Todos los campos son obligatorios.");
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/students`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, courseId }),
      });

      if (response.ok) {
        Alert.alert("✅ Estudiante creado");
        setName("");
        setEmail("");
        fetchStudents();
      } else {
        throw new Error("Error al agregar estudiante");
      }
    } catch (error) {
      console.error("Error creando estudiante:", error);
      Alert.alert("⚠️ Error", "No se pudo agregar el estudiante.");
    }
  };

  const updateStudent = async (id, newName, newEmail) => {
    if (!id || !newName || !newEmail) {
      console.error("Error: Datos inválidos para actualizar estudiante.");
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/students/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newName, email: newEmail }),
      });

      if (!response.ok) {
        throw new Error("Error al actualizar estudiante");
      }

      fetchStudents();
    } catch (error) {
      console.error("Error actualizando estudiante:", error);
      Alert.alert("⚠️ Error", "No se pudo actualizar el estudiante.");
    }
  };

  const removeStudent = async (id) => {
    if (!id) {
      console.error("Error: ID del estudiante no válido.");
      return;
    }

    Alert.alert("Eliminar estudiante", "¿Seguro que quieres eliminarlo?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Eliminar",
        style: "destructive",
        onPress: async () => {
          try {
            const response = await fetch(`${API_BASE_URL}/students/${id}`, {
              method: "DELETE",
            });

            if (!response.ok) {
              throw new Error("Error al eliminar estudiante");
            }

            fetchStudents();
          } catch (error) {
            console.error("Error eliminando estudiante:", error);
            Alert.alert("⚠️ Error", "No se pudo eliminar el estudiante.");
          }
        },
      },
    ]);
  };

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 18, fontWeight: "bold" }}>
        Lista de Estudiantes
      </Text>

      {students.length === 0 && (
        <Text style={{ textAlign: "center", marginVertical: 10 }}>
          No hay estudiantes registrados.
        </Text>
      )}

      <FlatList
        data={students}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              padding: 10,
              borderBottomWidth: 1,
              borderBottomColor: "#ddd",
            }}
          >
            <Text>{item.name}</Text>
            <View style={{ flexDirection: "row" }}>
              <Pressable onPress={() => removeStudent(item.id)}>
                <Text style={{ color: "red", marginRight: 10 }}>
                  ❌ Eliminar
                </Text>
              </Pressable>
              <Pressable
                onPress={() =>
                  updateStudent(item.id, "Nuevo Nombre", "nuevo@email.com")
                }
              >
                <Text style={{ color: "blue" }}>✏️ Editar</Text>
              </Pressable>
            </View>
          </View>
        )}
      />

      <Text style={{ fontSize: 16, marginTop: 20 }}>Agregar Estudiante</Text>
      <TextInput
        placeholder="Nombre"
        value={name}
        onChangeText={setName}
        style={{ borderWidth: 1, padding: 5, marginBottom: 10 }}
      />
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        style={{ borderWidth: 1, padding: 5, marginBottom: 10 }}
      />
      <Pressable
        onPress={addStudent}
        style={{ backgroundColor: "green", padding: 10, alignItems: "center" }}
      >
        <Text style={{ color: "white" }}>➕ Agregar</Text>
      </Pressable>
    </View>
  );
}
