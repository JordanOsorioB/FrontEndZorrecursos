import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import API_BASE_URL from "../../config";

export default function HomeTeacherScreen() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [stats, setStats] = useState({
    totalStudents: 0,
    avgPerformance: 0,
    totalActivities: 0,
    latestAchievements: [],
  });

  useEffect(() => {
    fetch(`${API_BASE_URL}/teachers/dashboard`)
      .then((res) => res.json())
      .then((data) => {
        setStats(data);
        setLoading(false);
      })
      .catch(() => {
        setError("⚠️ No se pudo cargar las estadísticas.");
        setLoading(false);
      });
  }, []);

  if (loading) return <ActivityIndicator size="large" color="#7352c4" />;
  if (error) return <Text style={styles.error}>{error}</Text>;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📊 Estadísticas del Profesor</Text>

      <FlatList
        data={[
          { key: "Estudiantes en el curso", value: stats.totalStudents },
          { key: "Promedio de desempeño", value: `${stats.avgPerformance}%` },
          { key: "Actividades creadas", value: stats.totalActivities },
        ]}
        keyExtractor={(item) => item.key}
        renderItem={({ item }) => (
          <View style={styles.statCard}>
            <Text style={styles.statTitle}>{item.key}</Text>
            <Text style={styles.statValue}>{item.value}</Text>
          </View>
        )}
      />

      <Text style={styles.subtitle}>🏆 Últimos Logros Desbloqueados</Text>
      <FlatList
        data={stats.latestAchievements}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.achievementCard}>
            <Text style={styles.achievementText}>{item}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#7352c4",
    marginBottom: 15,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 15,
  },
  statCard: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    elevation: 3,
  },
  statTitle: {
    fontSize: 16,
    color: "#333",
  },
  statValue: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FF9800",
  },
  achievementCard: {
    backgroundColor: "#e3f2fd",
    padding: 10,
    borderRadius: 5,
    marginTop: 5,
  },
  achievementText: {
    color: "#007acc",
  },
  error: {
    color: "red",
    fontSize: 16,
  },
});
