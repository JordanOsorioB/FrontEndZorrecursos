import React from 'react';
import { View, Text, StyleSheet, ScrollView, Linking, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

export default function PrivacidadScreen({ navigation }) {
  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <MaterialIcons name="arrow-back" size={28} color="#321c69" />
        </TouchableOpacity>
        <Text style={styles.title}>Privacidad</Text>
      </View>
      <ScrollView style={styles.container}>
        <Text style={styles.sectionTitle}>¿Cómo protegemos tu información?</Text>
        <Text style={styles.text}>
          En Aprehender, tu privacidad es nuestra prioridad. Todos tus datos personales y de progreso académico se almacenan de forma segura y nunca se comparten con terceros sin tu consentimiento.
        </Text>
        <Text style={styles.sectionTitle}>¿Para qué usamos tu información?</Text>
        <Text style={styles.text}>
          Utilizamos tus datos únicamente para mejorar tu experiencia educativa, personalizar tus contenidos y permitir el seguimiento de tu avance por parte de tus profesores y tutores.
        </Text>
        <Text style={styles.sectionTitle}>Tus derechos</Text>
        <Text style={styles.text}>
          - Puedes solicitar acceso, rectificación o eliminación de tus datos en cualquier momento.
          {'\n'}- Puedes descargar tu información o pedir que la eliminemos de nuestros servidores.
          {'\n'}- Si tienes dudas, contáctanos a soporte@aprehender.com.
        </Text>
        <Text style={styles.sectionTitle}>Política de Privacidad</Text>
        <TouchableOpacity onPress={() => Linking.openURL('https://aprehender.com/politica-privacidad')} style={styles.linkRow}>
          <MaterialIcons name="policy" size={22} color="#321c69" />
          <Text style={styles.link}>Ver política completa</Text>
        </TouchableOpacity>
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
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#321c69',
    marginTop: 18,
    marginBottom: 6,
  },
  text: {
    fontSize: 15,
    color: '#444',
    marginBottom: 10,
    lineHeight: 22,
  },
  linkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  link: {
    color: '#321c69',
    fontWeight: 'bold',
    marginLeft: 8,
    fontSize: 15,
    textDecorationLine: 'underline',
  },
}); 