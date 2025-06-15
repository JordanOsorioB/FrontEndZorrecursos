import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Linking, ActivityIndicator, TouchableOpacity, Image, Dimensions, SafeAreaView, StatusBar, Platform } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { getCurrentUser, getToken } from '../../../services/authService';
import API_BASE_URL from '../../../../config';
import { useAuth } from '../../../AuthContext';
import { getStudentFullData, getLevels } from '../../../services/studentService';
import { useFocusEffect } from '@react-navigation/native';
import coinImg from '../../../../assets/coin.png';

export default function ContenidosScreen({ navigation }) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [materiales, setMateriales] = useState([]);
  const [error, setError] = useState(null);
  const [estudiante, setEstudiante] = useState(null);
  const [asignaturaActual, setAsignaturaActual] = useState(null);
  const [levels, setLevels] = useState([]);
  const [nivelActual, setNivelActual] = useState(null);

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
      async function fetchData() {
        setLoading(true);
        setError(null);
        try {
          if (!user?.student?.id) throw new Error('No se encontró el usuario logueado');
          const estudianteData = await getStudentFullData(user.student.id);
          const estudianteAdaptado = {
            id: estudianteData.id,
            nombre: estudianteData.nombre,
            nick: estudianteData.nick || null,
            curso: estudianteData.curso || '',
            level: estudianteData.level,
            experience: estudianteData.experience,
            asignaturas: (estudianteData.subjectProgress || []).map(sp => ({
              id: sp.subject?.id,
              nombre: sp.subject?.name,
              progreso: sp.progress || 0,
            })),
            coins: estudianteData.coins || 0,
            profilePicture: estudianteData.profilePicture || null
          };
          setEstudiante(estudianteAdaptado);
          const asignatura = estudianteAdaptado.asignaturas[0];
          setAsignaturaActual(asignatura);
          // Obtener materiales
          const token = await getToken();
          const url = `${API_BASE_URL}/api/students/${user.student.id}/study-materials`;
          const response = await fetch(url, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          });
          if (!response.ok) {
            const text = await response.text();
            throw new Error(`Error: ${response.status} - ${text}`);
          }
          const data = await response.json();
          setMateriales(data);
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      }
      fetchData();
    }, [user])
  );

  useEffect(() => {
    if (estudiante && levels.length > 0) {
      const nivel = levels.find(lvl => estudiante.level === lvl.level);
      setNivelActual(nivel);
      if (!nivel) {
        console.warn('No se encontró un nivel correspondiente para el estudiante:', estudiante.level, levels);
      }
    }
  }, [estudiante, levels]);

  const getIconName = (tipo) => {
    switch (tipo) {
      case 'PDF':
        return 'picture-as-pdf';
      case 'VIDEO':
        return 'videocam';
      case 'LINK':
        return 'link';
      case 'IMAGE':
        return 'image';
      default:
        return 'description';
    }
  };

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
                <Text style={styles.nivelTexto}>{`Nivel ${estudiante?.level ?? '-'}`}</Text>
              </View>
              <View style={{ alignItems: 'center', width: 100 }}>
                <View style={styles.experienciaBar}>
                  <View
                    style={[
                      styles.experienciaProgress,
                      nivelActual ? { width: `${((estudiante.experience - nivelActual.minXP) / (nivelActual.maxXP - nivelActual.minXP + 1) * 100)}%` } : { width: '0%' }
                    ]}
                  />
                </View>
                <Text style={styles.xpTexto}>
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
        </View>
      </SafeAreaView>
    );
  };

  if (loading) {
    return <View style={styles.container}>{renderHeader()}<ActivityIndicator size="large" color="#321c69" style={{marginTop: 40}} /></View>;
  }
  if (error) {
    return <View style={styles.container}>{renderHeader()}<Text style={{ color: 'red', textAlign: 'center', marginTop: 40 }}>{error}</Text></View>;
  }
  if (!materiales.length) {
    return <View style={styles.container}>{renderHeader()}<Text style={{textAlign: 'center', marginTop: 40}}>No hay materiales disponibles.</Text></View>;
  }

  return (
    <View style={styles.container}>
      {renderHeader()}
      <ScrollView style={styles.content}>
        <Text style={styles.title}>Material Disponible</Text>
        {materiales.map(asig => (
          <View key={asig.subjectId} style={styles.subjectBlock}>
            <Text style={styles.subjectTitle}>{asig.subjectName}</Text>
            {asig.studyMaterials.length === 0 && (
              <Text style={styles.noMaterial}>No hay materiales para esta asignatura.</Text>
            )}
            {asig.studyMaterials.map(mat => (
              <Pressable
                key={mat.id}
                style={styles.card}
                onPress={() => Linking.openURL(mat.url)}
              >
                <View style={styles.cardContent}>
                  <MaterialIcons 
                    name={getIconName(mat.type)} 
                    size={24} 
                    color="#321c69" 
                  />
                  <View style={styles.textContainer}>
                    <Text style={styles.cardTitle}>{mat.title}</Text>
                    <Text style={styles.cardSubtitle}>{mat.type} {mat.description ? `• ${mat.description}` : ''}</Text>
                  </View>
                  <MaterialIcons 
                    name="open-in-new" 
                    size={22} 
                    color="#666" 
                  />
                </View>
              </Pressable>
            ))}
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
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
  nivelTexto: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  experienciaBar: {
    height: 10,
    backgroundColor: '#e0e0e0',
    borderRadius: 5,
    marginTop: 5,
    width: 100,
  },
  experienciaProgress: {
    height: '100%',
    backgroundColor: '#321c69',
    borderRadius: 5,
  },
  xpTexto: {
    fontSize: 15,
    color: '#666',
    textAlign: 'center',
    width: 100,
    alignSelf: 'center',
    marginTop: 0,
  },
  perfilInfo: {
    marginRight: 10,
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
  subjectBlock: {
    marginBottom: 24,
  },
  subjectTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#321c69',
    marginBottom: 10,
  },
  noMaterial: {
    color: '#888',
    fontStyle: 'italic',
    marginBottom: 10,
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