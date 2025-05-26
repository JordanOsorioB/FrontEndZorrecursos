import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

export default function SettingsScreen({ navigation }) {
  const opciones = [
    {
      id: '1',
      titulo: 'Perfil',
      icono: 'person',
      accion: () => navigation.navigate('Perfil')
    },
    {
      id: '2',
      titulo: 'Notificaciones',
      icono: 'notifications',
      accion: () => navigation.navigate('Notificaciones')
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
}); 