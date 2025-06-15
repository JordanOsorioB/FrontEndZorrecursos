import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, Image, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import coinImg from '../../../../assets/coin.png';
import zorritoLogo from '../../../../assets/logopng.png';
import { getLevels } from '../../../services/studentService';

const unlockTypeLabels = {
  NONE: 'Sin recompensa',
  PROFILE_PICTURE: 'Desbloquea foto de perfil',
  COIN: 'Monedas',
  CHANGE_NICK: 'Personaliza tu nombre',
};

export default function RecompensasScreen({ navigation }) {
  const [levels, setLevels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchLevels() {
      setLoading(true);
      setError(null);
      try {
        const data = await getLevels();
        setLevels(data);
      } catch (err) {
        setError('Error cargando niveles');
      } finally {
        setLoading(false);
      }
    }
    fetchLevels();
  }, []);

  if (loading) {
    return <View style={styles.center}><ActivityIndicator size="large" color="#321c69" /></View>;
  }
  if (error) {
    return <View style={styles.center}><Text style={{ color: 'red' }}>{error}</Text></View>;
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <MaterialIcons name="arrow-back" size={28} color="#321c69" />
        </TouchableOpacity>
        <Text style={styles.title}>Recompensas</Text>
      </View>
      <ScrollView style={styles.container}>
        <View style={styles.logoContainer}>
          <Image source={zorritoLogo} style={styles.logo} resizeMode="contain" />
        </View>
        <Text style={styles.subtitle}>Recompensas y Desbloqueos por Nivel</Text>
        {levels.map(lvl => (
          <View key={lvl.id} style={styles.levelBlock}>
            <View style={styles.levelHeader}>
              <MaterialIcons name="stars" size={28} color="#321c69" />
              <Text style={styles.levelNum}>Nivel {lvl.level}</Text>
            </View>
            <Text style={styles.description}>{lvl.description}</Text>
            <Text style={styles.xpRange}>XP: {lvl.minXP} - {lvl.maxXP}</Text>
            <View style={styles.rewardRow}>
              {lvl.rewardAmount > 0 && (
                <View style={styles.rewardItem}>
                  <Image source={coinImg} style={{ width: 24, height: 24, marginRight: 4 }} />
                  <Text style={styles.rewardText}>x{lvl.rewardAmount}</Text>
                </View>
              )}
              {lvl.unlockType && lvl.unlockType !== 'NONE' && (
                <View style={styles.rewardItem}>
                  <MaterialIcons name="lock-open" size={22} color="#321c69" style={{ marginRight: 4 }} />
                  <Text style={styles.rewardText}>{unlockTypeLabels[lvl.unlockType] || lvl.unlockType}</Text>
                </View>
              )}
              {(!lvl.rewardAmount && (!lvl.unlockType || lvl.unlockType === 'NONE')) && (
                <Text style={styles.rewardText}>Sin recompensa especial</Text>
              )}
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 40,
    paddingBottom: 16,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
    elevation: 2,
  },
  backButton: {
    marginRight: 12,
    padding: 4,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#321c69',
  },
  subtitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#321c69',
    marginBottom: 20,
    textAlign: 'center',
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  levelBlock: {
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    padding: 16,
    marginBottom: 18,
    elevation: 1,
  },
  levelHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  levelNum: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#321c69',
    marginLeft: 8,
  },
  description: {
    fontSize: 16,
    color: '#444',
    marginBottom: 4,
  },
  xpRange: {
    fontSize: 14,
    color: '#888',
    marginBottom: 8,
  },
  rewardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  rewardItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  rewardText: {
    fontSize: 15,
    color: '#321c69',
    fontWeight: 'bold',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 10,
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 5,
  },
}); 