import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Dimensions, ActivityIndicator, Button, SafeAreaView, StatusBar, Platform, Modal, Pressable, Animated } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import ExperienciaIndicator from '../components/ExperienciaIndicator';
import { getUnitColors, COLOR_PALETTE } from '../constants/unitColors';
import { getStudentFullData, getLevels } from '../../../services/studentService';
import { useAuth } from '../../../AuthContext';
import { useFocusEffect } from '@react-navigation/native';
import coinImg from '../../../../assets/coin.png';

const { width } = Dimensions.get('window');
const CIRCLE_SIZE = 65;
const COMPLETADO_COLOR = '#A5D6A7'; // Verde claro
const COMPLETADO_ICON_COLOR = '#388E3C'; // Verde fuerte

export default function ListaEjercicios({ navigation, route }) {
  const { user } = useAuth();
  const [asignaturaActual, setAsignaturaActual] = useState(null);
  const [selectedSubjectId, setSelectedSubjectId] = useState(null);
  const [estudiante, setEstudiante] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [levels, setLevels] = useState([]);
  const [nivelActual, setNivelActual] = useState(null);
  const [showAsignaturasModal, setShowAsignaturasModal] = useState(false);
  const [pressedIndex, setPressedIndex] = useState(null);

  const calcularProgresoAsignatura = (asignatura) => {
    let totalEjercicios = 0;
    let ejerciciosContestados = 0;
    asignatura.unidades.forEach(unidad => {
      unidad.ejercicios.forEach(ejercicio => {
        totalEjercicios++;
        if (ejercicio.estado.completionStatus !== 'NOT_ANSWERED') {
          ejerciciosContestados++;
        }
      });
    });
    return totalEjercicios > 0 ? Math.round((ejerciciosContestados / totalEjercicios) * 100) : 0;
  };

  const calcularProgresoUnidad = (unidad) => {
    const totalEjercicios = unidad.ejercicios.length;
    const ejerciciosCompletados = unidad.ejercicios.filter(ej => ej.estado.completionStatus === 'CORRECT').length;
    return totalEjercicios > 0 ? Math.round((ejerciciosCompletados / totalEjercicios) * 100) : 0;
  };

  useEffect(() => {
    async function fetchLevels() {
      try {
        const lvls = await getLevels();
        setLevels(lvls);
      } catch (e) {
        console.error('Error cargando niveles:', e);
      }
    }
    fetchLevels();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      if (user?.student?.id) {
        setLoading(true);
        getStudentFullData(user.student.id)
          .then(data => {
            // Adaptar la respuesta real a la estructura esperada por la UI
            const estudianteAdaptado = {
              id: data.id,
              nombre: data.nombre,
              nick: data.nick || null,
              curso: data.curso || '',
              level: data.level,
              experience: data.experience,
              coins: data.coins || 0,
              profilePicture: data.profilePicture || null,
              asignaturas: (data.subjectProgress || []).map(sp => ({
                id: sp.subject?.id,
                nombre: sp.subject?.name,
                progreso: sp.progress || 0,
                unidades: (sp.subject?.units || []).map(u => ({
                  id: u.id,
                  titulo: u.title,
                  descripcion: u.description,
                  order: u.order,
                  progreso: 0, // Puedes calcularlo si tienes los datos
                  ejercicios: (u.ejercicios || []).map(ej => {
                    let contenido = {};
                    if (ej.type === 'alternativas') {
                      contenido = { alternativas: ej.content };
                    } else if (ej.type === 'desarrollo') {
                      contenido = { desarrollo: ej.content };
                    } else if (ej.type === 'terminos_pareados') {
                      contenido = { terminosPareados: ej.content.terminosPareados || ej.content };
                    }
                    return {
                      id: ej.id,
                      titulo: ej.title,
                      descripcion: ej.description,
                      tipo: ej.type,
                      dificultad: ej.difficulty,
                      experienciaTotal: ej.totalExperience,
                      estado: {
                        id: ej.states?.[0]?.id,
                        completionStatus: ej.states?.[0]?.completionStatus || 'NOT_ANSWERED',
                        intentos: ej.states?.[0]?.attempts || 0,
                        ultimoIntento: ej.states?.[0]?.lastAttempt || null,
                        respuestasCorrectas: ej.states?.[0]?.correctAnswers || 0,
                        experienciaGanada: ej.states?.[0]?.experienceEarned || 0,
                        bloqueado: ej.states?.[0]?.locked || false
                      },
                      contenido
                    };
                  })
                }))
              }))
            };
            setEstudiante(estudianteAdaptado);
            setLoading(false);
          })
          .catch(error => {
            setError(error.message);
            setLoading(false);
          });
      }
    }, [user])
  );

  useEffect(() => {
    if (estudiante && levels.length > 0) {
      const nivel = levels.find(lvl => estudiante.level === lvl.level);
      setNivelActual(nivel);
      if (!nivel) {
      }
    }
  }, [estudiante, levels]);

  // Nuevo: actualizar asignaturaActual cuando cambie estudiante
  useEffect(() => {
    if (!estudiante || !estudiante.asignaturas || estudiante.asignaturas.length === 0) {
      setAsignaturaActual(null);
      return;
    }
    // Si hay una asignatura seleccionada, usar esa; si no, la primera
    const asignaturaId = selectedSubjectId || route?.params?.asignaturaId;
    let asignatura = estudiante.asignaturas[0];
    if (asignaturaId) {
      const encontrada = estudiante.asignaturas.find(a => a.id === asignaturaId);
      if (encontrada) asignatura = encontrada;
    }
    // Calcular progreso real
    const asignaturaConProgresoReal = {
      ...asignatura,
      progreso: calcularProgresoAsignatura(asignatura),
      unidades: asignatura.unidades.map(unidad => ({
        ...unidad,
        progreso: calcularProgresoUnidad(unidad)
      }))
    };
    setAsignaturaActual(asignaturaConProgresoReal);
  }, [estudiante, route?.params?.asignaturaId, selectedSubjectId]);

  // Derivar unidades de asignaturaActual
  const unidades = asignaturaActual?.unidades?.sort((a, b) => a.order - b.order) || [];

  const renderHeader = () => {
    if (!estudiante || !nivelActual) {
      return (
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.header}>
            <Text style={{textAlign:'center',padding:20}}>Cargando datos del estudiante...</Text>
          </View>
        </SafeAreaView>
      );
    }
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <View style={styles.nivelBlock}>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 0 }}>
                <MaterialIcons name="stars" size={18} color="#321c69" style={{ marginRight: 2 }} />
                <Text style={[styles.nivelTexto, { fontWeight: 'bold', fontSize: 18 }]}>{`Nivel ${estudiante?.level ?? '-'}`}</Text>
              </View>
              <View style={{ alignItems: 'center', width: 100 }}>
                <View style={[styles.experienciaBar, { marginVertical: 0, width: 100 }]}>
                  <View
                    style={[
                      styles.experienciaProgress,
                      nivelActual ? { width: `${((estudiante.experience - nivelActual.minXP) / (nivelActual.maxXP - nivelActual.minXP + 1) * 100)}%` } : { width: '0%' }
                    ]}
                  />
                </View>
                <Text style={[styles.xpTexto, { textAlign: 'center', fontSize: 15, marginTop: 0, width: 100, alignSelf: 'center' }]}>
                  {nivelActual ? `${estudiante.experience} / ${nivelActual.maxXP}` : `${estudiante.experience} XP`}
                </Text>
              </View>
            </View>
            <View style={styles.coinBlock}>
              <Image source={coinImg} style={{ width: 22, height: 22, marginRight: 2, marginLeft: 0 }} />
              <Text style={{ fontSize: 17, fontWeight: 'bold', color: '#F1C40F', marginLeft: 0 }}>{estudiante?.coins ?? 0}</Text>
            </View>
            <View style={styles.userBlock}>
              <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center' }} onPress={() => navigation.navigate('Ajustes', { screen: 'Perfil' })}>
                <Text style={{ fontSize: 16, fontWeight: 'bold', marginRight: 8 }}>{estudiante?.nick || estudiante?.nombre || '-'}</Text>
                <View style={[styles.perfilInfo, {
                  backgroundColor: '#fff',
                  borderRadius: 22.5,
                  overflow: 'hidden',
                  borderWidth: 2,
                  borderColor: '#321c69',
                  width: 45,
                  height: 45,
                  justifyContent: 'center',
                  alignItems: 'center'
                }]}> 
                  {estudiante?.profilePicture ? (
                    <Image
                      source={{ uri: estudiante.profilePicture }}
                      style={{ width: 45, height: 45, borderRadius: 22.5 }}
                      resizeMode="cover"
                    />
                  ) : (
                    <MaterialIcons 
                      name="account-circle" 
                      size={45} 
                      color="#321c69" 
                    />
                  )}
                </View>
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.asignaturaContainer}>
            <TouchableOpacity onPress={() => setShowAsignaturasModal(true)} activeOpacity={0.85}>
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                <Text style={[styles.asignaturaTitulo, { color: '#321c69', marginBottom: 0 }]}>{asignaturaActual?.nombre ?? '-'}</Text>
                <Text style={[styles.asignaturaProgreso, { textAlign: 'right' }]}>{asignaturaActual?.progreso ?? 0}% Completado</Text>
              </View>
            </TouchableOpacity>
            <View style={styles.progresoBar}>
              <View style={[styles.progresoFill, { width: `${asignaturaActual?.progreso ?? 0}%` }]} />
            </View>
          </View>
          {/* Modal de selección de asignatura */}
          <Modal
            visible={showAsignaturasModal}
            transparent
            animationType="fade"
            onRequestClose={() => setShowAsignaturasModal(false)}
          >
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Selecciona una asignatura</Text>
                {estudiante?.asignaturas?.map((asig, idx) => (
                  <Pressable
                    key={asig.id}
                    style={({ pressed }) => [
                      styles.subjectButton,
                      pressed || pressedIndex === idx ? styles.subjectButtonPressed : null
                    ]}
                    onPressIn={() => setPressedIndex(idx)}
                    onPressOut={() => setPressedIndex(null)}
                    onPress={() => {
                      setShowAsignaturasModal(false);
                      setSelectedSubjectId(asig.id);
                    }}
                  >
                    <Text style={[
                      styles.subjectButtonText,
                      (pressedIndex === idx || selectedSubjectId === asig.id) && styles.subjectButtonPressedText
                    ]}>
                      {asig.nombre}
                    </Text>
                  </Pressable>
                ))}
                <Pressable style={styles.closeModalButton} onPress={() => setShowAsignaturasModal(false)}>
                  <Text style={styles.closeModalText}>Cancelar</Text>
                </Pressable>
              </View>
            </View>
          </Modal>
        </View>
      </SafeAreaView>
    );
  };

  if (loading) {
    return (
      <View style={styles.mainContainer}>
        <ActivityIndicator size="large" color="#321c69" />
        <Text style={{textAlign:'center',marginTop:20, fontSize:18, color:'#321c69'}}>¡Estamos preparando tus ejercicios y progreso! 🚀</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.mainContainer}>
        <Text style={{ color: 'red', textAlign: 'center', marginTop: 40 }}>
          Error al cargar los datos del estudiante. Intenta nuevamente.
        </Text>
        <Button title="Reintentar" onPress={() => {
          setLoading(true);
          setError(null);
          // Forzar recarga de datos
          if (user?.student?.id) {
            getStudentFullData(user.student.id)
              .then(data => {
                // ...repetir lógica de adaptación aquí si es necesario...
                setEstudiante(data);
                setLoading(false);
              })
              .catch(error => {
                setError(error.message);
                setLoading(false);
              });
          }
        }} color="#321c69" />
      </View>
    );
  }

  if (!asignaturaActual) {
    return (
      <View style={styles.mainContainer}>
        {renderHeader()}
        <Text style={{ textAlign: 'center', marginTop: 40 }}>
          Sin asignaturas asignadas.
        </Text>
      </View>
    );
  }

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
    const status = ejercicio.estado.completionStatus;
    const isCompleted = status === 'CORRECT';
    const isFailed = status === 'INCORRECT';
    const isBlocked = ejercicio.estado.bloqueado === true;
    return (
      <View key={ejercicio.id} style={styles.ejercicioContainer}>
        <TouchableOpacity 
          style={[
            styles.ejercicioCircle,
            { borderColor: unitColor.primary },
            (isCompleted || isFailed) && { backgroundColor: unitColor.primary, borderColor: unitColor.primary },
            isBlocked && styles.ejercicioBloqueado
          ]}
          onPress={() => !isBlocked && navigation.navigate('ResponderEjercicio', { ejercicio: { ...ejercicio, studentId: estudiante.id } })}
          disabled={isBlocked}
        >
          <MaterialIcons 
            name={isCompleted ? "check" : isFailed ? "cancel" : getIconoPorTipo(ejercicio.tipo, isBlocked)}
            size={30} 
            color={isCompleted || isFailed ? '#fff' : (isBlocked ? COLOR_PALETTE.text.disabled : unitColor.primary)} 
          />
        </TouchableOpacity>
        <TouchableOpacity
          disabled={isBlocked}
          onPress={() => !isBlocked && navigation.navigate('ResponderEjercicio', { ejercicio: { ...ejercicio, studentId: estudiante.id } })}
        >
          <Text style={[
            styles.ejercicioTitulo,
            isBlocked && styles.textoDeshabilitado
          ]}>
            {ejercicio.titulo}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.mainContainer}>
      {renderHeader()}
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
                <View style={{ flexDirection: 'column', flex: 1 }}>
                  <Text style={[styles.unidadTitulo, { marginBottom: 8 }]}>UNIDAD {unidad.order}</Text>
                  <Text style={[styles.unidadDescripcion, { marginBottom: 12 }]}>{unidad.titulo}</Text>
                </View>
              </View>
              <View style={[styles.ejerciciosContainer, { marginTop: 12 }]}>
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
    backgroundColor: '#fff',
  },
  safeArea: {
    backgroundColor: '#fff',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  header: {
    width: '100%',
    backgroundColor: '#fff',
    padding: 10,
    alignSelf: 'stretch',
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    minHeight: 45,
  },
  nivelBlock: {
    flex: 1,
    minWidth: 0,
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  coinBlock: {
    flex: 1,
    alignItems: 'center',
    minWidth: 0,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  userBlock: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    minWidth: 0,
  },
  nivelInfo: {
    marginLeft: 10,
  },
  nivelTexto: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  experienciaBar: {
    height: 10,
    backgroundColor: '#e0e0e0',
    borderRadius: 5,
    marginTop: 5,
  },
  experienciaProgress: {
    height: '100%',
    backgroundColor: '#321c69',
    borderRadius: 5,
  },
  xpTexto: {
    fontSize: 13,
    color: '#666',
  },
  perfilInfo: {
    marginRight: 10,
  },
  nombreEstudiante: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  cursoEstudiante: {
    fontSize: 14,
    color: '#666',
  },
  asignaturaContainer: {
    marginTop: 10,
    padding: 10,
  },
  asignaturaInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  asignaturaTitulo: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#321c69',
    marginBottom: 0,
  },
  asignaturaProgreso: {
    fontSize: 12,
    color: '#666',
  },
  progresoBar: {
    height: 10,
    backgroundColor: '#e0e0e0',
    borderRadius: 5,
    marginTop: 5,
  },
  progresoFill: {
    height: '100%',
    backgroundColor: '#321c69',
    borderRadius: 5,
  },
  container: {
    flex: 1,
  },
  unidadContainer: {
    padding: 10,
  },
  unidadHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  unidadIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  unidadTitulo: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  unidadDescripcion: {
    fontSize: 14,
    color: '#666',
  },
  ejercicioContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  ejercicioCircle: {
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE,
    borderWidth: 2,
    borderColor: '#000',
    borderRadius: CIRCLE_SIZE / 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ejercicioTitulo: {
    fontSize: 16,
    marginLeft: 10,
  },
  textoDeshabilitado: {
    color: '#666',
  },
  ejercicioBloqueado: {
    borderColor: '#e0e0e0',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    width: '80%',
    alignItems: 'center',
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#321c69',
    marginBottom: 18,
  },
  subjectButton: {
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingVertical: 14,
    paddingHorizontal: 24,
    marginBottom: 14,
    width: '100%',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#321c69',
    shadowColor: '#321c69',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
    transform: [{ scale: 1 }],
  },
  subjectButtonPressed: {
    backgroundColor: '#321c69',
    borderColor: '#321c69',
    shadowOpacity: 0.18,
    transform: [{ scale: 0.97 }],
  },
  subjectButtonText: {
    fontSize: 17,
    color: '#321c69',
    fontWeight: 'bold',
  },
  subjectButtonPressedText: {
    color: '#fff',
  },
  closeModalButton: {
    marginTop: 10,
    padding: 10,
    borderRadius: 8,
    backgroundColor: '#321c69',
  },
  closeModalText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
  },
});