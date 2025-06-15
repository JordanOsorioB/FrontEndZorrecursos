import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useAuth } from '../../../AuthContext';

export default function SettingsScreen({ navigation }) {
  const { logout } = useAuth();
  const opciones = [
    {
      id: '1',
      titulo: 'Perfil',
      icono: 'person',
      accion: () => navigation.navigate('Perfil')
    },
    {
      id: '2',
      titulo: 'Recompensas',
      icono: 'emoji-events',
      accion: () => navigation.navigate('Recompensas')
    },
    {
      id: '3',
      titulo: 'Privacidad',
      icono: 'security',
      accion: () => navigation.navigate('Privacidad')
    },
    {
      id: '4',
      titulo: 'Ayuda',
      icono: 'help',
      accion: () => navigation.navigate('Ayuda')
    }
  ];

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content}>
        <Text style={styles.title}>Configuración</Text>
        
        {opciones.map(opcion => (
          <Pressable
            key={opcion.id}
            style={styles.optionCard}
            onPress={opcion.accion}
          >
            <View style={styles.optionContent}>
              <MaterialIcons 
                name={opcion.icono} 
                size={24} 
                color="#321c69" 
              />
              <Text style={styles.optionTitle}>{opcion.titulo}</Text>
              <MaterialIcons 
                name="chevron-right" 
                size={24} 
                color="#666" 
              />
            </View>
          </Pressable>
        ))}
        {/* Botón de cerrar sesión */}
        <Pressable style={styles.logoutButton} onPress={logout}>
          <View style={styles.optionContent}>
            <MaterialIcons name="logout" size={24} color="#c0392b" />
            <Text style={styles.logoutText}>Cerrar sesión</Text>
          </View>
        </Pressable>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#321c69',
    marginBottom: 20,
  },
  optionCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    elevation: 2,
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionTitle: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    marginLeft: 15,
  },
  logoutButton: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginTop: 30,
    elevation: 2,
  },
  logoutText: {
    flex: 1,
    fontSize: 16,
    color: '#c0392b',
    marginLeft: 15,
    fontWeight: 'bold',
  },
}); 