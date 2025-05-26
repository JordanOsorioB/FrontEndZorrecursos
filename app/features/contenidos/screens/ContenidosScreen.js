import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

export default function ContenidosScreen({ navigation }) {
  // Datos de ejemplo - luego vendrán de la API
  const contenidos = [
    {
      id: '1',
      titulo: 'Introducción a la Programación',
      tipo: 'PDF',
      fecha: '2024-03-15',
      descargado: false
    },
    {
      id: '2',
      titulo: 'Variables y Tipos de Datos',
      tipo: 'VIDEO',
      fecha: '2024-03-16',
      descargado: true
    },
    {
      id: '3',
      titulo: 'Estructuras de Control',
      tipo: 'PDF',
      fecha: '2024-03-17',
      descargado: false
    }
  ];

  const getIconName = (tipo) => {
    switch (tipo) {
      case 'PDF':
        return 'picture-as-pdf';
      case 'VIDEO':
        return 'videocam';
      default:
        return 'description';
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content}>
        <Text style={styles.title}>Material Disponible</Text>
        
        {contenidos.map(contenido => (
          <Pressable
            key={contenido.id}
            style={styles.card}
            onPress={() => navigation.navigate('VerContenido', { contenidoId: contenido.id })}
          >
            <View style={styles.cardContent}>
              <MaterialIcons 
                name={getIconName(contenido.tipo)} 
                size={24} 
                color="#321c69" 
              />
              <View style={styles.textContainer}>
                <Text style={styles.cardTitle}>{contenido.titulo}</Text>
                <Text style={styles.cardSubtitle}>
                  {contenido.tipo} • {contenido.fecha}
                </Text>
              </View>
              <MaterialIcons 
                name={contenido.descargado ? "check-circle" : "download"} 
                size={24} 
                color={contenido.descargado ? "#4CAF50" : "#666"} 
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
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    elevation: 2,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  textContainer: {
    flex: 1,
    marginLeft: 15,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
}); 