import React, { useState, useCallback } from 'react';
import { View, StyleSheet, ScrollView, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useAuth } from '../../../AuthContext';
import PerfilAjustes from '../components/PerfilAjustes';
import { getStudentFullData, updateProfilePicture } from '../../../services/studentService';
import { useFocusEffect } from '@react-navigation/native';

export default function PerfilScreen({ navigation }) {
  const { user, setUser } = useAuth();
  const [estudiante, setEstudiante] = useState(user?.student);
  const [loading, setLoading] = useState(false);

  useFocusEffect(
    useCallback(() => {
      const refreshStudent = async () => {
        if (!user?.student?.id) return;
        setLoading(true);
        try {
          const data = await getStudentFullData(user.student.id);
          const estudianteAdaptado = {
            id: data.id,
            nombre: data.nombre,
            nick: data.nick || null,
            curso: data.curso || '',
            level: data.level,
            experience: data.experience,
            coins: data.coins || 0,
            profilePicture: data.profilePicture || null,
          };
          setEstudiante(estudianteAdaptado);
          setUser && setUser({ ...user, student: estudianteAdaptado });
        } catch (error) {
          console.error('Error refrescando datos del estudiante:', error);
        } finally {
          setLoading(false);
        }
      };
      refreshStudent();
    }, [user?.student?.id])
  );

  const handleImageChange = async (newImageUri) => {
    if (!user?.student?.id) return;
    setEstudiante(prev => ({ ...prev, profilePicture: newImageUri }));
    setUser && setUser(prev => ({ ...prev, student: { ...prev.student, profilePicture: newImageUri } }));
  };

  if (loading || !estudiante) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#321c69" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.replace('SettingsMain')} style={styles.backButton}>
          <MaterialIcons name="arrow-back" size={28} color="#321c69" />
        </TouchableOpacity>
        <Text style={styles.title}>Mi Perfil</Text>
      </View>
      <ScrollView style={styles.content}>
        <PerfilAjustes 
          estudiante={estudiante}
          onImageChange={handleImageChange}
          setEstudiante={setEstudiante}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 40,
    paddingBottom: 16,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
    elevation: 2,
  },
  backButton: {
    marginRight: 12,
    padding: 4,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#321c69',
  },
  content: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
}); 