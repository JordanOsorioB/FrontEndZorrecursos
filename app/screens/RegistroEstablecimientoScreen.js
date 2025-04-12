import React, { useState, useEffect } from "react";
import API_BASE_URL from "../../config";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Pressable,
  Alert,
  Modal,
  FlatList,
  TouchableOpacity,
} from "react-native";

export default function RegistroEstablecimientoScreen({ navigation }) {
  const [tipoUsuario, setTipoUsuario] = useState("PROFESOR");
  const [username, setUsername] = useState("");
  const [schoolName, setSchoolName] = useState("");
  const [direccion, setDireccion] = useState("");
  const [schoolCode, setSchoolCode] = useState("");
  const [curso, setCurso] = useState("PRIMERO_BASICO");
  const [profesorId, setProfesorId] = useState("");
  const [asignatura, setAsignatura] = useState("");
  const [email, setEmail] = useState("");
  const [clave, setClave] = useState("");
  const [error, setError] = useState("");
  const [profesores, setProfesores] = useState([]);
  const [asignaturas, setAsignaturas] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalAsignaturaVisible, setModalAsignaturaVisible] = useState(false);
  const [schoolNameEncontrado, setSchoolNameEncontrado] = useState("");
  const [schoolId, setSchoolId] = useState("");

  const buscarSchoolId = async () => {
    if (!schoolCode) {
      setError("⚠️ Ingresa un código de colegio válido.");
      return;
    }

    try {
      const response = await fetch(
        `${API_BASE_URL}/schools/code/${schoolCode}`
      );

      if (!response.ok) {
        setError(`⚠️ No se encontró el colegio con código: ${schoolCode}`);
        setSchoolId(null);
        setProfesores([]);
        setAsignaturas([]);
        return;
      }

      const data = await response.json();

      if (!data.name) {
        setError("⚠️ Colegio no encontrado.");
        return;
      }

      setSchoolId(data.id);
      setSchoolNameEncontrado(data.name);
      setError("");

      // Cargar profesores de la escuela específica
      const teachersResponse = await fetch(
        `${API_BASE_URL}/teachers/school/${data.id}`
      );
      if (!teachersResponse.ok) {
        setError("⚠️ No se pudo cargar la lista de profesores.");
        return;
      }
      const teachersData = await teachersResponse.json();
      setProfesores(teachersData);

      // Cargar asignaturas de la escuela específica
      const subjectsResponse = await fetch(
        `${API_BASE_URL}/subjects/school/${data.id}`
      );
      if (!subjectsResponse.ok) {
        setError("⚠️ No se pudo cargar la lista de asignaturas.");
        return;
      }
      const subjectsData = await subjectsResponse.json();
      setAsignaturas(subjectsData);
    } catch (error) {
      console.error("❌ Error de conexión:", error);
      setError("⚠️ Error al conectar con la API.");
      setSchoolNameEncontrado("");
      setProfesores([]);
      setAsignaturas([]);
    }
  };

  const validarEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const registrarAdmin = async () => {
    if (!username || !schoolName || !direccion || !email || !clave) {
      setError("⚠️ Todos los campos son obligatorios.");
      return;
    }

    if (!validarEmail(email)) {
      setError("⚠️ Ingresa un correo válido.");
      return;
    }

    if (clave.length < 6) {
      setError("⚠️ La clave debe tener al menos 6 caracteres.");
      return;
    }

    const schoolResponse = await fetch(`${API_BASE_URL}/schools`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: schoolName,
        address: direccion,
        code: Math.random().toString(36).substr(2, 6),
      }),
    });

    const schoolData = await schoolResponse.json();
    if (!schoolResponse.ok) {
      setError(`⚠️ Error creando la escuela: ${schoolData.error}`);
      return;
    }

    const newSchoolId = schoolData.school.id;

    const adminResponse = await fetch(`${API_BASE_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: username,
        name: username,
        email: email,
        password: clave,
        role: "ADMIN",
        schoolId: newSchoolId,
      }),
    });

    const adminData = await adminResponse.json();
    if (!adminResponse.ok) {
      setError(`⚠️ Error creando usuario admin: ${adminData.error}`);
      return;
    }

    Alert.alert(
      "✅ Registro exitoso",
      "La escuela y el administrador han sido creados correctamente."
    );
    navigation.navigate("LoginDocente");
  };

  const registrarProfesor = async () => {
    if (!profesorId || !asignatura || !email || !clave) {
      setError("⚠️ Todos los campos son obligatorios.");
      return;
    }

    const generarUsername = (nombreCompleto, asignatura) => {
      if (!nombreCompleto || !asignatura)
        return "user" + Math.floor(100 + Math.random() * 900);

      const nombreDividido = nombreCompleto.split(" ");
      const inicialNombre = nombreDividido[0]?.charAt(0).toUpperCase() || "";
      const primerApellido = nombreDividido[1] || "X";
      const inicialAsignatura = asignatura.charAt(0).toUpperCase();
      const numeroAleatorio = Math.floor(1000 + Math.random() * 9000);

      return `${inicialNombre}${primerApellido}${inicialAsignatura}${numeroAleatorio}`;
    };

    const profesorSeleccionado = profesores.find((p) => p.id === profesorId);
    const asignaturaSeleccionada = asignaturas.find((a) => a.id === asignatura);

    const profesorResponse = await fetch(`${API_BASE_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: generarUsername(
          profesorSeleccionado?.name,
          asignaturaSeleccionada?.name
        ),
        email,
        password: clave,
        role: "TEACHER",
        schoolId,
      }),
    });

    const profesorData = await profesorResponse.json();
    if (!profesorResponse.ok) {
      setError(
        `⚠️ Error creando el USUARIO: ${
          profesorData.error || "Error desconocido."
        }`
      );
      return;
    }

    const courseResponse = await fetch(`${API_BASE_URL}/courses`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        teacherId: profesorId,
        schoolId: schoolId,
        grade: curso,
        subject: asignatura,
      }),
    });

    const courseData = await courseResponse.json();
    if (!courseResponse.ok) {
      setError(`⚠️ Error creando el curso: ${courseData.error}`);
      return;
    }

    Alert.alert("✅ Curso registrado", "El curso ha sido creado con éxito.");
    navigation.navigate("LoginDocente");
  };

  const handleRegistro = async () => {
    setError("");

    try {
      if (tipoUsuario === "ADMIN") {
        await registrarAdmin();
      } else if (tipoUsuario === "PROFESOR") {
        if (!schoolId) {
          setError("⚠️ No se ha encontrado un colegio válido.");
          return;
        }
        await registrarProfesor();
      }
    } catch (error) {
      setError("⚠️ Error al conectar con la API.");
    }
  };

  const schoolYears = [
    { id: "PRIMERO_BASICO", name: "1° Básico", enabled: true },
    { id: "SEGUNDO_BASICO", name: "2° Básico", enabled: false },
    { id: "TERCERO_BASICO", name: "3° Básico", enabled: false },
    { id: "CUARTO_BASICO", name: "4° Básico", enabled: false },
    { id: "QUINTO_BASICO", name: "5° Básico", enabled: false },
    { id: "SEXTO_BASICO", name: "6° Básico", enabled: false },
    { id: "SEPTIMO_BASICO", name: "7° Básico", enabled: false },
    { id: "OCTAVO_BASICO", name: "8° Básico", enabled: false },
  ];
  const [modalCursoVisible, setModalCursoVisible] = useState(false);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Registro</Text>
      {error ? <Text style={styles.error}>{error}</Text> : null}

      {/* Selector de tipo de usuario */}
      <View style={styles.switchContainer}>
        <Pressable
          style={[
            styles.switchButton,
            tipoUsuario === "PROFESOR" && styles.switchButtonActive,
          ]}
          onPress={() => setTipoUsuario("PROFESOR")}
        >
          <Text style={styles.switchText}>Registrar Profesor</Text>
        </Pressable>
        <Pressable
          style={[
            styles.switchButton,
            tipoUsuario === "ADMIN" && styles.switchButtonActive,
          ]}
          onPress={() => setTipoUsuario("ADMIN")}
        >
          <Text style={styles.switchText}>Registrar Administrador</Text>
        </Pressable>
      </View>

      {/* Campos para Admin */}
      {tipoUsuario === "ADMIN" && (
        <>
          <TextInput
            placeholder="Nombre de Usuario (Admin)"
            style={styles.input}
            value={username}
            onChangeText={setUsername}
          />
          <TextInput
            placeholder="Nombre del Colegio"
            style={styles.input}
            value={schoolName}
            onChangeText={setSchoolName}
          />
          <TextInput
            placeholder="Dirección"
            style={styles.input}
            value={direccion}
            onChangeText={setDireccion}
          />
          <TextInput
            placeholder="Correo electrónico"
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <TextInput
            placeholder="Clave"
            style={styles.input}
            value={clave}
            onChangeText={setClave}
            secureTextEntry
          />
        </>
      )}

      {/* Campos para Profesor */}
      {tipoUsuario === "PROFESOR" && (
        <>
          {/* Mostrar el colegio encontrado si existe */}
          {schoolNameEncontrado ? (
            <Text style={styles.schoolNameText}>
              🏫 Colegio: {schoolNameEncontrado}
            </Text>
          ) : null}

          <TextInput
            placeholder="Código del Colegio"
            style={styles.input}
            value={schoolCode}
            onChangeText={setSchoolCode}
          />
          <Pressable
            style={[styles.button, styles.secondaryButton]}
            onPress={buscarSchoolId}
          >
            <Text style={styles.buttonText}>Buscar Colegio</Text>
          </Pressable>
          <Pressable
            style={styles.dropdownButton}
            onPress={() => setModalAsignaturaVisible(true)}
          >
            <Text style={styles.dropdownButtonText}>
              {asignatura
                ? asignaturas.find((a) => a.id === asignatura)?.name
                : "Seleccionar Asignatura"}
            </Text>
          </Pressable>

          <Modal
            visible={modalAsignaturaVisible}
            animationType="slide"
            transparent={true}
          >
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Seleccionar Asignatura</Text>
                <FlatList
                  data={asignaturas}
                  keyExtractor={(item) => item.id.toString()}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={styles.listItem}
                      onPress={() => {
                        setAsignatura(item.id);
                        setModalAsignaturaVisible(false);
                      }}
                    >
                      <Text style={styles.listItemText}>{item.name}</Text>
                    </TouchableOpacity>
                  )}
                />
                <Pressable
                  style={styles.closeButton}
                  onPress={() => setModalAsignaturaVisible(false)}
                >
                  <Text style={styles.buttonText}>Cerrar</Text>
                </Pressable>
              </View>
            </View>
          </Modal>

          <Pressable
            style={styles.dropdownButton}
            onPress={() => setModalCursoVisible(true)}
          >
            <Text style={styles.dropdownButtonText}>
              {schoolYears.find((year) => year.id === curso)?.name ||
                "Seleccionar Curso"}
            </Text>
          </Pressable>
          <Modal
            visible={modalCursoVisible}
            animationType="slide"
            transparent={true}
          >
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Seleccionar Curso</Text>
                <FlatList
                  data={schoolYears}
                  keyExtractor={(item) => item.id}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={[
                        styles.listItem,
                        !item.enabled && styles.disabledItem,
                      ]}
                      onPress={() => {
                        if (item.enabled) {
                          setCurso(item.id);
                          setModalCursoVisible(false);
                        }
                      }}
                      disabled={!item.enabled}
                    >
                      <Text style={styles.listItemText}>{item.name}</Text>
                    </TouchableOpacity>
                  )}
                />
                <Pressable
                  style={styles.closeButton}
                  onPress={() => setModalCursoVisible(false)}
                >
                  <Text style={styles.buttonText}>Cerrar</Text>
                </Pressable>
              </View>
            </View>
          </Modal>
          <Pressable
            style={styles.dropdownButton}
            onPress={() => setModalVisible(true)}
          >
            <Text style={styles.dropdownButtonText}>
              {profesorId
                ? profesores.find((p) => p.id === profesorId)?.name
                : "Seleccionar Profesor"}
            </Text>
          </Pressable>

          <Modal
            visible={modalVisible}
            animationType="slide"
            transparent={true}
          >
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Seleccionar Profesor</Text>
                <FlatList
                  data={profesores}
                  keyExtractor={(item) => item.id.toString()}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={styles.listItem}
                      onPress={() => {
                        setProfesorId(item.id);
                        setModalVisible(false);
                      }}
                    >
                      <Text style={styles.listItemText}>{item.name}</Text>
                    </TouchableOpacity>
                  )}
                />
                <Pressable
                  style={styles.closeButton}
                  onPress={() => setModalVisible(false)}
                >
                  <Text style={styles.buttonText}>Cerrar</Text>
                </Pressable>
              </View>
            </View>
          </Modal>
          <TextInput
            placeholder="Correo electrónico"
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <TextInput
            placeholder="Clave"
            style={styles.input}
            value={clave}
            onChangeText={setClave}
            secureTextEntry
          />
        </>
      )}

      <Pressable
        style={[styles.button, styles.primaryButton]}
        onPress={handleRegistro}
      >
        <Text style={styles.buttonText}>Registrar</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  switchContainer: {
    flexDirection: "row",
    marginBottom: 15,
  },
  switchButton: {
    flex: 1,
    paddingVertical: 10,
    backgroundColor: "#ddd",
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 5,
    borderRadius: 5,
  },
  switchButtonActive: {
    backgroundColor: "#7352c4",
  },
  switchText: {
    color: "#fff",
    fontWeight: "bold",
  },
  input: {
    width: "100%",
    padding: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    backgroundColor: "#fff",
  },
  button: {
    width: "100%",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 10,
  },

  error: {
    color: "red",
    fontSize: 14,
    marginBottom: 10,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    padding: 20,
  },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 20 },
  input: {
    width: "100%",
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    backgroundColor: "#fff",
    marginBottom: 10,
  },
  primaryButton: {
    backgroundColor: "#7352c4",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: "center",
    width: "100%",
    marginVertical: 10,
  },
  buttonText: { color: "white", fontSize: 16, fontWeight: "bold" },
  dropdownButton: {
    width: "100%",
    padding: 12,
    backgroundColor: "#ddd",
    borderRadius: 5,
    alignItems: "center",
    marginBottom: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    width: "80%",
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  listItem: {
    width: "100%",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    alignItems: "center",
  },

  closeButton: {
    marginTop: 10,
    backgroundColor: "#7352c4",
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
  },

  schoolNameText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#4CAF50",
    textAlign: "center",
    marginVertical: 10,
  },
  secondaryButton: {
    backgroundColor: "#FF9800",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: "center",
    width: "100%",
    marginVertical: 10,
  },
  disabledItem: {
    opacity: 0.5,
    backgroundColor: "#ccc",
  },
});
