import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Dimensions } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import ExperienciaIndicator from '../components/ExperienciaIndicator';
import { estudianteMock } from '../mocks/estudianteMock';
import { getUnitColors, COLOR_PALETTE } from '../constants/unitColors';

const { width } = Dimensions.get('window');
const CIRCLE_SIZE = 65;

export default function ListaEjercicios({ navigation, route }) {
  // Estado local para la asignatura seleccionada
  const [asignaturaActual, setAsignaturaActual] = useState(null);
  const estudiante = estudianteMock;

  const calcularProgresoAsignatura = (asignatura) => {
    let totalEjercicios = 0;
    let ejerciciosCompletados = 0;

    asignatura.unidades.forEach(unidad => {
      unidad.ejercicios.forEach(ejercicio => {
        totalEjercicios++;
        if (ejercicio.estado.completado) {
          ejerciciosCompletados++;
        }
      });
    });

    return totalEjercicios > 0 ? Math.round((ejerciciosCompletados / totalEjercicios) * 100) : 0;
  };

  const calcularProgresoUnidad = (unidad) => {
    const totalEjercicios = unidad.ejercicios.length;
    const ejerciciosCompletados = unidad.ejercicios.filter(ej => ej.estado.completado).length;
    return totalEjercicios > 0 ? Math.round((ejerciciosCompletados / totalEjercicios) * 100) : 0;
  };

  useEffect(() => {
    // Si viene una asignatura por parámetros, usamos esa
    const asignaturaId = route?.params?.asignaturaId;
    
    if (asignaturaId) {
      const asignatura = estudiante.asignaturas.find(a => a.id === asignaturaId);
      if (asignatura) {
        // Calcular el progreso real antes de establecer la asignatura
        const asignaturaConProgresoReal = {
          ...asignatura,
          progreso: calcularProgresoAsignatura(asignatura),
          unidades: asignatura.unidades.map(unidad => ({
            ...unidad,
            progreso: calcularProgresoUnidad(unidad)
          }))
        };
        setAsignaturaActual(asignaturaConProgresoReal);
        return;
      }
    }
    
    // Si no hay asignatura en los parámetros o no se encuentra, usamos la primera disponible
    const primeraAsignatura = estudiante.asignaturas[0];
    const asignaturaConProgresoReal = {
      ...primeraAsignatura,
      progreso: calcularProgresoAsignatura(primeraAsignatura),
      unidades: primeraAsignatura.unidades.map(unidad => ({
        ...unidad,
        progreso: calcularProgresoUnidad(unidad)
      }))
    };
    setAsignaturaActual(asignaturaConProgresoReal);
  }, [route?.params?.asignaturaId]);

  // Si aún no tenemos asignatura, mostramos un loading o retornamos null
  if (!asignaturaActual) return null;

  // Ordenar unidades por orden
  const unidades = asignaturaActual.unidades.sort((a, b) => a.orden - b.orden);

  const getIconoPorTipo = (tipo, bloqueado) => {
    if (bloqueado) return "lock";
    switch (tipo) {
      case 'alternativas': return "radio-button-checked";
      case 'desarrollo': return "edit-note";
      case 'terminos_pareados': return "compare-arrows";
      default: return "help";
    }
  };

  const renderEjercicio = (ejercicio, index, total, unitColor) => {
    const isLast = index === total - 1;
    const isCompleted = ejercicio.estado.completado;
    const isBlocked = ejercicio.estado.bloqueado;
    
    return (
      <View key={ejercicio.id} style={styles.ejercicioContainer}>
        <TouchableOpacity 
          style={[
            styles.ejercicioCircle,
            { borderColor: unitColor.primary },
            isCompleted && { backgroundColor: unitColor.secondary, borderColor: unitColor.primary },
            isBlocked && styles.ejercicioBloqueado
          ]}
          onPress={() => !isBlocked && navigation.navigate('ResponderEjercicio', { ejercicioId: ejercicio.id })}
          disabled={isBlocked}
        >
          <MaterialIcons 
            name={isCompleted ? "check" : getIconoPorTipo(ejercicio.tipo, isBlocked)}
            size={30} 
            color={isBlocked ? COLOR_PALETTE.text.disabled : isCompleted ? "#FFF" : unitColor.primary} 
          />
        </TouchableOpacity>
        
        <Text style={[
          styles.ejercicioTitulo,
          isBlocked && styles.textoDeshabilitado
        ]}>
          {ejercicio.titulo}
        </Text>

        {!isLast && (
          <View style={[
            styles.lineaConectora,
            { backgroundColor: unitColor.primary },
            isCompleted && { backgroundColor: unitColor.primary },
            isBlocked && styles.lineaBloqueada
          ]} />
        )}
      </View>
    );
  };

  return (
    <View style={styles.mainContainer}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View style={styles.nivelContainer}>
            <MaterialIcons name="stars" size={24} color={COLOR_PALETTE.accent} />
            <View style={styles.nivelInfo}>
              <Text style={styles.nivelTexto}>Nivel {estudiante.nivel.actual}</Text>
              <View style={styles.experienciaBar}>
                <View 
                  style={[
                    styles.experienciaProgress, 
                    { width: `${(estudiante.nivel.experiencia.actual / estudiante.nivel.experiencia.necesaria) * 100}%` }
                  ]} 
                />
              </View>
              <Text style={styles.xpTexto}>
                {estudiante.nivel.experiencia.actual}/{estudiante.nivel.experiencia.necesaria} XP
              </Text>
            </View>
          </View>
          
          <TouchableOpacity 
            style={styles.perfilContainer}
            onPress={() => navigation.navigate('PerfilSettings')}
          >
            <View style={styles.perfilInfo}>
              <Text style={styles.nombreEstudiante}>{estudiante.nombre}</Text>
              <Text style={styles.cursoEstudiante}>{estudiante.curso}</Text>
            </View>
            <MaterialIcons 
              name="account-circle" 
              size={45} 
              color={COLOR_PALETTE.text.primary} 
            />
          </TouchableOpacity>
        </View>
        
        <View style={styles.asignaturaContainer}>
          <View style={styles.asignaturaInfo}>
            <Text style={styles.asignaturaTitulo}>{asignaturaActual.nombre}</Text>
            <Text style={styles.asignaturaProgreso}>{asignaturaActual.progreso}% Completado</Text>
          </View>
          <View style={styles.progresoBar}>
            <View style={[styles.progresoFill, { width: `${asignaturaActual.progreso}%` }]} />
          </View>
        </View>
      </View>

      <ScrollView style={styles.container}>
        {unidades.map((unidad) => {
          const unitColors = getUnitColors(unidad.id);
          return (
            <View key={unidad.id} style={[
              styles.unidadContainer,
              { backgroundColor: unitColors.background }
            ]}>
              <View style={styles.unidadHeader}>
                <View style={[
                  styles.unidadIconContainer,
                  { backgroundColor: unitColors.primary }
                ]}>
                  <MaterialIcons 
                    name="school" 
                    size={32} 
                    color="#fff"
                  />
                </View>
                <Text style={styles.unidadTitulo}>UNIDAD {unidad.id}</Text>
                <Text style={styles.unidadDescripcion}>{unidad.titulo}</Text>
              </View>

              <View style={styles.ejerciciosContainer}>
                {unidad.ejercicios.map((ejercicio, idx) => 
                  renderEjercicio(ejercicio, idx, unidad.ejercicios.length, unitColors)
                )}
              </View>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: COLOR_PALETTE.background,
  },
  container: {
    flex: 1,
  },
  header: {
    backgroundColor: '#fff',
    paddingTop: 40,
    paddingHorizontal: 15,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  nivelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  nivelInfo: {
    marginLeft: 10,
  },
  nivelTexto: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#321c69',
  },
  perfilContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  perfilInfo: {
    alignItems: 'flex-end',
    marginRight: 10,
  },
  nombreEstudiante: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#321c69',
  },
  cursoEstudiante: {
    fontSize: 14,
    color: '#321c69',
  },
  asignaturaContainer: {
    marginTop: 10,
  },
  asignaturaInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  asignaturaTitulo: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#321c69',
  },
  asignaturaProgreso: {
    fontSize: 14,
    color: '#321c69',
  },
  progresoBar: {
    height: 8,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
  },
  progresoFill: {
    height: '100%',
    backgroundColor: '#FF9800',
    borderRadius: 4,
  },
  unidadContainer: {
    marginBottom: 30,
    marginHorizontal: 15,
    marginTop: 15,
    borderRadius: 15,
    padding: 15,
  },
  unidadHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  unidadIconContainer: {
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  unidadTitulo: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#321c69',
    marginBottom: 5,
  },
  unidadDescripcion: {
    fontSize: 16,
    color: '#321c69',
    textAlign: 'center',
  },
  ejerciciosContainer: {
    alignItems: 'center',
    paddingTop: 20,
  },
  ejercicioContainer: {
    alignItems: 'center',
    marginBottom: 10,
  },
  ejercicioCircle: {
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE,
    borderRadius: CIRCLE_SIZE / 2,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  ejercicioBloqueado: {
    backgroundColor: '#F5F5F5',
    borderColor: '#E0E0E0',
  },
  ejercicioTitulo: {
    fontSize: 14,
    color: '#321c69',
    marginTop: 5,
    textAlign: 'center',
    maxWidth: 120,
  },
  textoDeshabilitado: {
    color: '#E0E0E0',
  },
  lineaConectora: {
    width: 3,
    height: 40,
    marginVertical: 5,
  },
  lineaBloqueada: {
    backgroundColor: COLOR_PALETTE.text.disabled,
  },
  experienciaBar: {
    width: 100,
    height: 6,
    backgroundColor: '#E0E0E0',
    borderRadius: 3,
    marginTop: 4,
    marginBottom: 2,
  },
  experienciaProgress: {
    height: '100%',
    backgroundColor: '#FF9800',
    borderRadius: 3,
  },
  xpTexto: {
    fontSize: 12,
    color: '#321c69',
  },
}); 