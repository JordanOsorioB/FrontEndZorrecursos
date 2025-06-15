import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

export default function AyudaScreen({ navigation }) {
  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <MaterialIcons name="arrow-back" size={28} color="#321c69" />
        </TouchableOpacity>
        <Text style={styles.title}>Ayuda</Text>
      </View>
      <ScrollView style={styles.container}>
        <Text style={styles.sectionTitle}>Preguntas Frecuentes</Text>
        <Text style={styles.question}>¿Cómo recupero mi contraseña?</Text>
        <Text style={styles.answer}>En la pantalla de inicio de sesión, haz clic en "¿Olvidaste tu contraseña?" y sigue las instrucciones para restablecerla.</Text>
        <Text style={styles.question}>¿Cómo contacto al soporte?</Text>
        <Text style={styles.answer}>Puedes escribirnos a <Text style={styles.link} onPress={() => Linking.openURL('mailto:soporte@aprehender.com')}>soporte@aprehender.com</Text> o usar el chat de ayuda en la app.</Text>
        <Text style={styles.question}>¿Por qué no veo mis avances?</Text>
        <Text style={styles.answer}>Asegúrate de estar conectado a internet y de haber iniciado sesión correctamente. Si el problema persiste, contáctanos.</Text>
        <Text style={styles.sectionTitle}>Enlaces útiles</Text>
        <TouchableOpacity style={styles.linkRow} onPress={() => Linking.openURL('https://aprehender.com/tutoriales')}>
          <MaterialIcons name="play-circle-outline" size={22} color="#321c69" />
          <Text style={styles.link}>Ver tutoriales en video</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.linkRow} onPress={() => Linking.openURL('https://aprehender.com/faq')}>
          <MaterialIcons name="help-outline" size={22} color="#321c69" />
          <Text style={styles.link}>Preguntas frecuentes</Text>
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
  question: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#444',
    marginTop: 10,
  },
  answer: {
    fontSize: 15,
    color: '#444',
    marginBottom: 8,
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