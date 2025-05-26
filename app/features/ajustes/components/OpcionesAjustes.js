import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import TopBar from '../../../shared/components/TopBar';
import BottomTabBar from '../../../shared/components/BottomTabBar';

export default function OpcionesAjustes({ navigation }) {
  const opciones = [
    {
      id: 'perfil',
      titulo: 'Mi Perfil',
      descripcion: 'Editar información personal',
      icono: 'person',
    },
    {
      id: 'notificaciones',
      titulo: 'Notificaciones',
      descripcion: 'Configurar alertas y recordatorios',
      icono: 'notifications',
    },
    {
      id: 'apariencia',
      titulo: 'Apariencia',
      descripcion: 'Personalizar tema y colores',
      icono: 'palette',
    },
    {
      id: 'privacidad',
      titulo: 'Privacidad',
      descripcion: 'Gestionar datos y permisos',
      icono: 'security',
    },
    {
      id: 'ayuda',
      titulo: 'Ayuda',
      descripcion: 'Preguntas frecuentes y soporte',
      icono: 'help',
    },
    {
      id: 'cerrarSesion',
      titulo: 'Cerrar Sesión',
      descripcion: 'Salir de la aplicación',
      icono: 'logout',
      destacado: true,
    },
  ];

  return (
    <View style={styles.container}>
      <TopBar username="Estudiante" role="Alumno" />

      <ScrollView style={styles.content}>
        <Text style={styles.title}>Ajustes</Text>

        {opciones.map(opcion => (
          <Pressable
            key={opcion.id}
            style={[
              styles.opcionCard,
              opcion.destacado && styles.opcionDestacada
            ]}
            onPress={() => {
              // Aquí irá la navegación a cada opción
              console.log('Seleccionada opción:', opcion.titulo);
            }}
          >
            <View style={[
              styles.iconContainer,
              opcion.destacado && styles.iconoDestacado
            ]}>
              <MaterialIcons 
                name={opcion.icono} 
                size={24} 
                color={opcion.destacado ? '#e53935' : '#7352c4'} 
              />
            </View>

            <View style={styles.contentCard}>
              <Text style={[
                styles.titulo,
                opcion.destacado && styles.textoDestacado
              ]}>
                {opcion.titulo}
              </Text>
              <Text style={styles.descripcion}>{opcion.descripcion}</Text>
            </View>

            <MaterialIcons 
              name="chevron-right" 
              size={24} 
              color={opcion.destacado ? '#e53935' : '#666'} 
            />
          </Pressable>
        ))}
      </ScrollView>

      <BottomTabBar 
        navigation={navigation} 
        activeTab="settings"
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
  opcionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    elevation: 2,
  },
  opcionDestacada: {
    backgroundColor: '#ffebee',
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
  iconoDestacado: {
    backgroundColor: '#ffcdd2',
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
  textoDestacado: {
    color: '#e53935',
  },
  descripcion: {
    fontSize: 14,
    color: '#666',
  },
}); 