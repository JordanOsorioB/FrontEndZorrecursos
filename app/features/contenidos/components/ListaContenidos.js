import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import TopBar from '../../../shared/components/TopBar';
import BottomTabBar from '../../../shared/components/BottomTabBar';

export default function ListaContenidos({ navigation }) {
  // Datos de ejemplo - luego vendrán de la API
  const contenidos = [
    {
      id: '1',
      titulo: 'Introducción a la Programación',
      tipo: 'PDF',
      materia: 'Programación Básica',
      descripcion: 'Conceptos fundamentales de programación',
      icono: 'description'
    },
    {
      id: '2',
      titulo: 'Variables y Tipos de Datos',
      tipo: 'Video',
      materia: 'Programación Básica',
      descripcion: 'Tutorial sobre variables en programación',
      icono: 'play-circle-filled'
    },
    {
      id: '3',
      titulo: 'Ejercicios Resueltos',
      tipo: 'Documento',
      materia: 'Programación Básica',
      descripcion: 'Ejemplos y soluciones paso a paso',
      icono: 'assignment'
    }
  ];

  const getTipoIcon = (tipo) => {
    switch (tipo.toLowerCase()) {
      case 'pdf':
        return 'picture-as-pdf';
      case 'video':
        return 'play-circle-filled';
      default:
        return 'description';
    }
  };

  return (
    <View style={styles.container}>
      <TopBar username="Estudiante" role="Alumno" />

      <ScrollView style={styles.content}>
        <Text style={styles.title}>Contenidos de Estudio</Text>
        
        {contenidos.map(contenido => (
          <Pressable
            key={contenido.id}
            style={styles.card}
            onPress={() => {
              // Aquí irá la navegación al detalle del contenido
              console.log('Ver contenido:', contenido.titulo);
            }}
          >
            <View style={styles.iconContainer}>
              <MaterialIcons 
                name={getTipoIcon(contenido.tipo)} 
                size={24} 
                color="#7352c4" 
              />
            </View>

            <View style={styles.contentCard}>
              <Text style={styles.titulo}>{contenido.titulo}</Text>
              <Text style={styles.materia}>{contenido.materia}</Text>
              <Text style={styles.descripcion}>{contenido.descripcion}</Text>
              <View style={styles.tipoContainer}>
                <MaterialIcons name="local-library" size={16} color="#666" />
                <Text style={styles.tipo}>{contenido.tipo}</Text>
              </View>
            </View>
          </Pressable>
        ))}
      </ScrollView>

      <BottomTabBar 
        navigation={navigation} 
        activeTab="content"
      />
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
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    elevation: 2,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f0ebfa',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  contentCard: {
    flex: 1,
  },
  titulo: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  materia: {
    fontSize: 14,
    color: '#7352c4',
    marginBottom: 4,
  },
  descripcion: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  tipoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tipo: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
  },
}); 