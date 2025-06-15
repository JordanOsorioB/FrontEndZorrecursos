import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, Image, Modal, Pressable } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { TIPOS_EJERCICIO } from '../dtos/EjercicioDTO';
import EjercicioAlternativas from '../components/ejercicios/EjercicioAlternativas';
import EjercicioDesarrollo from '../components/ejercicios/EjercicioDesarrollo';
import EjercicioTerminosPareados from '../components/ejercicios/EjercicioTerminosPareados';
import { COLOR_PALETTE } from '../constants/unitColors';
import { actualizarEstadoEjercicio, buyAttemptWithCoin } from '../../../services/exerciseStateService';
import { addExperienceAndLevel, getStudentFullData } from '../../../services/studentService';
import { useAuth } from '../../../AuthContext';
import zorritoLogo from '../../../../assets/logopng.png';

export default function ResponderEjercicio({ navigation, route }) {
  const [ejercicio, setEjercicio] = useState(route.params?.ejercicio || null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [levelUpInfo, setLevelUpInfo] = useState(null);
  const { user, setUser } = useAuth();
  const [showBuyAttemptModal, setShowBuyAttemptModal] = useState(false);
  const [buyError, setBuyError] = useState('');
  const [comprando, setComprando] = useState(false);
  const [showConfirmBuyModal, setShowConfirmBuyModal] = useState(false);
  const [showNoCoinsModal, setShowNoCoinsModal] = useState(false);

  useEffect(() => {
    if (!ejercicio) {
      setError('Ejercicio no encontrado');
    }
    // Refrescar datos del usuario al entrar
    async function refreshUser() {
      if (user?.student?.id && setUser) {
        try {
          const freshUser = await getStudentFullData(user.student.id);
          setUser({ ...user, student: { ...user.student, ...freshUser } });
        } catch (e) {
          // No bloquear la pantalla si falla, pero podrías mostrar un warning
        }
      }
    }
    refreshUser();
  }, [ejercicio]);

  // Lógica para mostrar el modal si no hay intentos
  useEffect(() => {
    if (ejercicio && ejercicio.estado?.attempts === 0) {
      setShowBuyAttemptModal(true);
    } else {
      setShowBuyAttemptModal(false);
    }
  }, [ejercicio]);

  const handleRespuestaSubmit = async (respuesta) => {
    try {
      const stateId = ejercicio.estado?.id;
      if (!stateId) {
        throw new Error('No se encontró el id del estado del ejercicio');
      }
      await actualizarEstadoEjercicio(stateId, {
        completionStatus: respuesta.completionStatus,
        attempts: respuesta.attempts ?? respuesta.intentos,
        correctAnswers: respuesta.correctAnswers ?? respuesta.respuestasCorrectas,
        experienceEarned: respuesta.experienceEarned ?? respuesta.experienciaGanada,
        respuesta: respuesta?.respuesta || (typeof respuesta === 'string' ? respuesta : undefined),
        lastAttempt: new Date().toISOString(),
        studentId: ejercicio.estado?.studentId || ejercicio.studentId
      });
      // Lógica de experiencia y nivel solo si es correcta
      if (respuesta.completionStatus === 'CORRECT') {
        const res = await addExperienceAndLevel({
          studentId: ejercicio.estado?.studentId || ejercicio.studentId,
          experienciaGanada: ejercicio.experienciaTotal
        });
        // Actualizar el usuario global si corresponde
        if (setUser && res.student) {
          setUser({ ...user, student: { ...user.student, ...res.student } });
        }
        if (res.levelUp) {
          setLevelUpInfo(res.premio);
          setTimeout(() => {
            setLevelUpInfo(null);
            navigation.goBack();
          }, 2500);
        } else {
          setTimeout(() => {
            navigation.goBack();
          }, 1500);
        }
      } else {
        setTimeout(() => {
          navigation.goBack();
        }, 1500);
      }
    } catch (error) {
      console.error('Error actualizando estado del ejercicio:', error);
    }
  };

  const handleBuyAttempt = async () => {
    setBuyError('');
    setComprando(true);
    try {
      const studentId = ejercicio.estado?.studentId || ejercicio.studentId;
      const exerciseStateId = ejercicio.estado?.id;
      const res = await buyAttemptWithCoin(studentId, exerciseStateId);
      // Actualizar intentos y coins en la UI local
      setEjercicio(prev => ({
        ...prev,
        estado: {
          ...prev.estado,
          attempts: res.attempts
        },
        student: {
          ...prev.student,
          coins: res.coins
        }
      }));
      // Actualizar coins globales del usuario
      if (setUser && user?.student) {
        setUser({ ...user, student: { ...user.student, coins: res.coins } });
      }
      setShowBuyAttemptModal(false);
    } catch (e) {
      setBuyError(e.message);
    } finally {
      setComprando(false);
    }
  };

  const handleTryBuyAttempt = () => {
    if ((user?.student?.coins ?? 0) < 1) {
      setShowNoCoinsModal(true);
    } else {
      setShowConfirmBuyModal(true);
    }
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
            onComplete={handleRespuestaSubmit}
            coins={user?.student?.coins ?? 0}
            onBuyAttempt={handleTryBuyAttempt}
            comprando={comprando}
            buyError={buyError}
          />
        );
      case TIPOS_EJERCICIO.DESARROLLO:
        return (
          <EjercicioDesarrollo
            ejercicio={ejercicio}
            onComplete={handleRespuestaSubmit}
          />
        );
      case TIPOS_EJERCICIO.TERMINOS_PAREADOS:
        return (
          <EjercicioTerminosPareados
            ejercicio={ejercicio}
            onComplete={handleRespuestaSubmit}
            coins={user?.student?.coins ?? 0}
            onBuyAttempt={handleTryBuyAttempt}
            comprando={comprando}
            buyError={buyError}
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
        <Image source={zorritoLogo} style={styles.logoZorro} resizeMode="contain" />
      </View>
      
      <View style={styles.content}>
        {levelUpInfo && (
          <View style={{backgroundColor:'#fff',borderRadius:10,padding:20,alignItems:'center',marginBottom:20}}>
            <Text style={{fontSize:22,fontWeight:'bold',color:'#321c69'}}>¡Subiste a nivel {levelUpInfo.nivel}!</Text>
            {levelUpInfo.description && <Text style={{marginTop:10}}>{levelUpInfo.description}</Text>}
            {levelUpInfo.rewardAmount && <Text style={{marginTop:10}}>¡Ganaste {levelUpInfo.rewardAmount} moneda(s)!</Text>}
          </View>
        )}
        {!levelUpInfo && renderEjercicioComponent()}
      </View>
      <Modal
        visible={showBuyAttemptModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowBuyAttemptModal(false)}
      >
        <View style={{ flex:1, backgroundColor:'rgba(0,0,0,0.3)', justifyContent:'center', alignItems:'center' }}>
          <View style={{ backgroundColor:'#fff', borderRadius:16, padding:28, width:320, alignItems:'center', elevation:6 }}>
            <MaterialIcons name="monetization-on" size={38} color="#FFD700" style={{marginBottom:10}} />
            <Text style={{ fontSize:20, fontWeight:'bold', color:'#321c69', marginBottom:10 }}>¡Sin intentos!</Text>
            <Text style={{ fontSize:16, textAlign:'center', marginBottom:10 }}>
              ¿Quieres gastar <Text style={{color:'#FFD700', fontWeight:'bold'}}>1 coin</Text> para obtener un intento extra?
            </Text>
            <Text style={{ fontSize:15, color:'#321c69', marginBottom:10 }}>Coins disponibles: {user?.student?.coins ?? 0}</Text>
            {buyError ? <Text style={{ color:'red', marginBottom:8 }}>{buyError}</Text> : null}
            <View style={{ flexDirection:'row', marginTop:10 }}>
              <Pressable
                style={{ backgroundColor:'#321c69', paddingVertical:10, paddingHorizontal:22, borderRadius:8, marginRight:10, opacity: comprando ? 0.7 : 1 }}
                onPress={handleTryBuyAttempt}
                disabled={comprando || (user?.student?.coins ?? 0) < 1}
              >
                <Text style={{ color:'#fff', fontWeight:'bold', fontSize:16 }}>
                  {comprando ? 'Comprando...' : 'Comprar intento (1 coin)'}
                </Text>
              </Pressable>
              <Pressable
                style={{ backgroundColor:'#eee', paddingVertical:10, paddingHorizontal:22, borderRadius:8 }}
                onPress={() => setShowBuyAttemptModal(false)}
                disabled={comprando}
              >
                <Text style={{ color:'#321c69', fontWeight:'bold', fontSize:16 }}>Cancelar</Text>
              </Pressable>
            </View>
            {/* Si no tiene coins, deshabilitar el botón y mostrar mensaje */}
            {(user?.student?.coins ?? 0) < 1 && (
              <Text style={{ color:'red', marginTop:10, fontWeight:'bold' }}>No tienes coins suficientes para comprar un intento.</Text>
            )}
          </View>
        </View>
      </Modal>
      <Modal
        visible={showConfirmBuyModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowConfirmBuyModal(false)}
      >
        <View style={{ flex:1, backgroundColor:'rgba(0,0,0,0.3)', justifyContent:'center', alignItems:'center' }}>
          <View style={{ backgroundColor:'#fff', borderRadius:16, padding:28, width:320, alignItems:'center', elevation:6 }}>
            <MaterialIcons name="monetization-on" size={38} color="#FFD700" style={{marginBottom:10}} />
            <Text style={{ fontSize:20, fontWeight:'bold', color:'#321c69', marginBottom:10 }}>¿Comprar intento extra?</Text>
            <Text style={{ fontSize:16, textAlign:'center', marginBottom:10 }}>
              ¿Estás seguro de gastar <Text style={{color:'#FFD700', fontWeight:'bold'}}>1 coin</Text> para obtener un intento extra?
            </Text>
            <View style={{ flexDirection:'row', marginTop:10 }}>
              <Pressable
                style={{ backgroundColor:'#321c69', paddingVertical:10, paddingHorizontal:22, borderRadius:8, marginRight:10, opacity: comprando ? 0.7 : 1 }}
                onPress={async () => {
                  setShowConfirmBuyModal(false);
                  await handleBuyAttempt();
                }}
                disabled={comprando}
              >
                <Text style={{ color:'#fff', fontWeight:'bold', fontSize:16 }}>
                  {comprando ? 'Comprando...' : 'Sí, comprar'}
                </Text>
              </Pressable>
              <Pressable
                style={{ backgroundColor:'#eee', paddingVertical:10, paddingHorizontal:22, borderRadius:8 }}
                onPress={() => setShowConfirmBuyModal(false)}
                disabled={comprando}
              >
                <Text style={{ color:'#321c69', fontWeight:'bold', fontSize:16 }}>Cancelar</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
      <Modal
        visible={showNoCoinsModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowNoCoinsModal(false)}
      >
        <View style={{ flex:1, backgroundColor:'rgba(0,0,0,0.3)', justifyContent:'center', alignItems:'center' }}>
          <View style={{ backgroundColor:'#fff', borderRadius:16, padding:28, width:320, alignItems:'center', elevation:6 }}>
            <MaterialIcons name="sentiment-dissatisfied" size={38} color="#D32F2F" style={{marginBottom:10}} />
            <Text style={{ fontSize:20, fontWeight:'bold', color:'#D32F2F', marginBottom:10 }}>¡Sin coins suficientes!</Text>
            <Text style={{ fontSize:16, textAlign:'center', marginBottom:10 }}>
              No tienes coins suficientes para comprar un intento extra.
            </Text>
            <Pressable
              style={{ backgroundColor:'#321c69', paddingVertical:10, paddingHorizontal:22, borderRadius:8, marginTop:10 }}
              onPress={() => setShowNoCoinsModal(false)}
            >
              <Text style={{ color:'#fff', fontWeight:'bold', fontSize:16 }}>Cerrar</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
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
  logoZorro: {
    width: 48,
    height: 48,
    marginLeft: 8,
  },
}); 