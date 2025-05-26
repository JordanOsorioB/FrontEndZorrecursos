import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

export default function ExperienciaIndicator({ nivel, experiencia, siguienteNivel }) {
  const progreso = (experiencia / siguienteNivel) * 100;

  return (
    <View style={styles.container}>
      <View style={styles.nivelContainer}>
        <View style={styles.nivelBadge}>
          <MaterialIcons name="military-tech" size={24} color="#FFD700" />
          <Text style={styles.nivelText}>Nivel {nivel}</Text>
        </View>
      </View>

      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View 
            style={[
              styles.progressFill,
              { width: `${progreso}%` }
            ]} 
          />
        </View>
        <Text style={styles.experienciaText}>
          {experiencia} / {siguienteNivel} XP
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    padding: 15,
    margin: 15,
    borderRadius: 10,
    elevation: 2,
  },
  nivelContainer: {
    alignItems: 'center',
    marginBottom: 10,
  },
  nivelBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0ebfa',
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 20,
  },
  nivelText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#7352c4',
    marginLeft: 5,
  },
  progressContainer: {
    alignItems: 'center',
  },
  progressBar: {
    width: '100%',
    height: 10,
    backgroundColor: '#f0ebfa',
    borderRadius: 5,
    overflow: 'hidden',
    marginBottom: 5,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#7352c4',
  },
  experienciaText: {
    fontSize: 14,
    color: '#666',
  },
}); 