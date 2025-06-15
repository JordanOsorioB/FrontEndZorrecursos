import React, { useEffect, useState } from 'react';
import { Modal, View, Text, FlatList, Image, TouchableOpacity, ActivityIndicator, Button, StyleSheet } from 'react-native';
import API_BASE_URL from '../../../../config';

export default function GaleriaImagenesPerfil({ visible, onClose, onSelect, userLevel }) {
  const [imagenes, setImagenes] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (visible) {
      setLoading(true);
      fetch(`${API_BASE_URL}/api/profile-pictures`)
        .then(res => res.json())
        .then(data => setImagenes(data))
        .catch(() => setImagenes([]))
        .finally(() => setLoading(false));
    }
  }, [visible]);

  // Filtrar imágenes según el nivel del usuario
  const imagenesFiltradas = userLevel >= 2
    ? imagenes
    : imagenes.filter(img => img.name === 'Usuario');

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <View style={styles.container}>
        <Text style={styles.title}>Elige tu nueva foto de perfil</Text>
        {userLevel < 2 && (
          <Text style={{ color: '#321c69', textAlign: 'center', marginBottom: 10 }}>
            ¡Desbloquea más imágenes subiendo al nivel 2!
          </Text>
        )}
        {loading ? (
          <ActivityIndicator size="large" color="#321c69" />
        ) : (
          <FlatList
            data={imagenesFiltradas}
            keyExtractor={item => item.id}
            numColumns={2}
            contentContainerStyle={{ paddingBottom: 20 }}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.imageContainer}
                onPress={() => onSelect(item)}
              >
                <Image
                  source={{ uri: item.url }}
                  style={styles.image}
                />
                <Text style={styles.imageName}>{item.name}</Text>
              </TouchableOpacity>
            )}
          />
        )}
        <Button title="Cancelar" onPress={onClose} />
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 20,
    marginBottom: 10,
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#321c69',
  },
  imageContainer: {
    alignItems: 'center',
    margin: 10,
    flex: 1,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 5,
    borderWidth: 2,
    borderColor: '#321c69',
  },
  imageName: {
    fontSize: 14,
    color: '#321c69',
    textAlign: 'center',
  },
}); 