import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { estudianteMock } from '../mocks/estudianteMock';
import { TIPOS_EJERCICIO } from '../dtos/EjercicioDTO';
import EjercicioAlternativas from '../components/ejercicios/EjercicioAlternativas';
import EjercicioDesarrollo from '../components/ejercicios/EjercicioDesarrollo';
import EjercicioTerminosPareados from '../components/ejercicios/EjercicioTerminosPareados';
import { COLOR_PALETTE } from '../constants/unitColors';

export default function ResponderEjercicio({ navigation, route }) {
  const [ejercicio, setEjercicio] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const ejercicioId = route.params?.ejercicioId;
    if (!ejercicioId) {
      setError('No se especificó un ejercicio');
      setLoading(false);
      return;
    }

    // Simulamos la búsqueda del ejercicio en el mock
    // En producción, esto sería una llamada a la API
    const ejercicioEncontrado = buscarEjercicioEnMock(ejercicioId);
    if (ejercicioEncontrado) {
      setEjercicio(ejercicioEncontrado);
    } else {
      setError('Ejercicio no encontrado');
    }
    setLoading(false);
  }, [route.params?.ejercicioId]);

  const buscarEjercicioEnMock = (ejercicioId) => {
    // Buscamos en todas las asignaturas y unidades
    for (const asignatura of estudianteMock.asignaturas) {
      for (const unidad of asignatura.unidades) {
        const ejercicio = unidad.ejercicios.find(e => e.id === ejercicioId);
        if (ejercicio) return ejercicio;
      }
    }
    return null;
  };

  const handleRespuestaSubmit = (respuesta) => {
    // Aquí manejaremos la lógica de validación y actualización del progreso
    console.log('Respuesta enviada:', respuesta);
    // TODO: Implementar lógica de validación según tipo de ejercicio
    navigation.goBack();
  };

  if (loading) {
    return (
      <View style={styles.centeredContainer}>
        <Text>Cargando ejercicio...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centeredContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  const renderEjercicioComponent = () => {
    switch (ejercicio.tipo) {
      case TIPOS_EJERCICIO.ALTERNATIVAS:
        return (
          <EjercicioAlternativas
            ejercicio={ejercicio}
            onSubmit={handleRespuestaSubmit}
          />
        );
      case TIPOS_EJERCICIO.DESARROLLO:
        return (
          <EjercicioDesarrollo
            ejercicio={ejercicio}
            onSubmit={handleRespuestaSubmit}
          />
        );
      case TIPOS_EJERCICIO.TERMINOS_PAREADOS:
        return (
          <EjercicioTerminosPareados
            ejercicio={ejercicio}
            onComplete={handleRespuestaSubmit}
          />
        );
      default:
        return (
          <View style={styles.centeredContainer}>
            <Text>Tipo de ejercicio no soportado</Text>
          </View>
        );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <MaterialIcons 
          name="arrow-back"
          size={24}
          color="#FF9800"
          onPress={() => navigation.goBack()}
        />
        <View style={styles.headerInfo}>
          <Text style={styles.titulo}>{ejercicio.titulo}</Text>
          <Text style={styles.descripcion}>{ejercicio.descripcion}</Text>
        </View>
      </View>
      
      <View style={styles.content}>
        {renderEjercicioComponent()}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLOR_PALETTE.background,
  },
  header: {
    padding: 16,
    backgroundColor: '#321c69',
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    marginTop: 20,
  },
  headerInfo: {
    marginLeft: 16,
    flex: 1,
  },
  titulo: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FF9800',
    marginTop: 10,
  },
  descripcion: {
    fontSize: 14,
    color: '#FFB74D',
    marginTop: 4,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  centeredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  errorText: {
    color: COLOR_PALETTE.status.error,
    textAlign: 'center',
  },
}); 