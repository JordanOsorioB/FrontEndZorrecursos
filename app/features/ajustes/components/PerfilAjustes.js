import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ActivityIndicator, Alert, TextInput } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { getToken } from '../../../services/authService';
import coinImg from '../../../../assets/coin.png';
import GaleriaImagenesPerfil from './GaleriaImagenesPerfil';
import { uploadProfilePicture, updateStudentProfile } from '../../../services/studentService';

export default function PerfilAjustes({ estudiante, onImageChange, setEstudiante }) {
  const [imageUri, setImageUri] = useState(estudiante?.profilePicture || null);
  const [showGallery, setShowGallery] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [nick, setNick] = useState(estudiante?.nick || '');
  const [editingNick, setEditingNick] = useState(false);
  const [savingNick, setSavingNick] = useState(false);

  const handleSelectFromGallery = async (item) => {
    setUploading(true);
    try {
      await uploadProfilePicture(estudiante.id, item.url);
      setImageUri(item.url);
      onImageChange && onImageChange(item.url);
      setShowGallery(false);
    } catch (error) {
      Alert.alert('Error', 'No se pudo actualizar la foto de perfil.');
    } finally {
      setUploading(false);
    }
  };

  const handleSaveNick = async () => {
    if (!nick || nick.length < 3 || nick.length > 20 || !/^[a-zA-Z0-9]+$/.test(nick)) {
      Alert.alert('Error', 'El nick debe tener entre 3 y 20 caracteres y solo letras/números.');
      return;
    }
    setSavingNick(true);
    try {
      await updateStudentProfile(estudiante.id, { nick });
      Alert.alert('Éxito', 'Nick actualizado correctamente.');
      setEditingNick(false);
      if (setEstudiante) setEstudiante(prev => ({ ...prev, nick }));
    } catch (error) {
      Alert.alert('Error', 'No se pudo actualizar el nick.');
    } finally {
      setSavingNick(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.avatarContainer}>
        {uploading ? (
          <ActivityIndicator size="large" color="#321c69" />
        ) : (
          <TouchableOpacity onPress={() => setShowGallery(true)}>
            {imageUri ? (
              <Image source={{ uri: imageUri }} style={styles.avatar} />
            ) : (
              <MaterialIcons name="account-circle" size={100} color="#321c69" />
            )}
            <View style={styles.cameraIcon}>
              <MaterialIcons name="photo-camera" size={28} color="#fff" />
            </View>
          </TouchableOpacity>
        )}
      </View>
      <GaleriaImagenesPerfil
        visible={showGallery}
        onClose={() => setShowGallery(false)}
        onSelect={handleSelectFromGallery}
        userLevel={estudiante?.level ?? 1}
      />
      <Text style={styles.nombre}>{estudiante?.nick || estudiante?.nombre || '-'}</Text>
      <Text style={styles.curso}>{estudiante?.curso || '-'}</Text>
      {estudiante?.level >= 5 && (
        <View style={styles.nickContainer}>
          {editingNick ? (
            <View style={styles.nickEditContainer}>
              <TextInput
                style={styles.nickInput}
                value={nick}
                onChangeText={setNick}
                placeholder="Ingresa tu nick"
                maxLength={20}
              />
              <TouchableOpacity onPress={handleSaveNick} disabled={savingNick} style={styles.saveButton}>
                {savingNick ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text style={styles.saveButtonText}>Guardar</Text>
                )}
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity onPress={() => setEditingNick(true)} style={styles.editNickButton}>
              <Text style={styles.editNickText}>Editar Nick</Text>
            </TouchableOpacity>
          )}
        </View>
      )}
      <View style={styles.infoRow}>
        <MaterialIcons name="stars" size={28} color="#321c69" />
        <Text style={styles.nivel}>Nivel {estudiante?.level ?? '-'}</Text>
      </View>
      <View style={styles.infoRow}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Image source={coinImg} style={{ width: 28, height: 28, marginRight: 0 }} />
          <Text style={styles.coins}>{estudiante?.coins ?? 0}</Text>
        </View>
        <View style={{ marginLeft: 24 }}>
          <Text style={styles.xp}>{estudiante?.experience ?? 0} XP</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#fff',
    borderRadius: 16,
    margin: 16,
    elevation: 2,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: '#321c69',
  },
  cameraIcon: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#321c69',
    borderRadius: 16,
    padding: 4,
    borderWidth: 2,
    borderColor: '#fff',
  },
  nombre: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#321c69',
    marginBottom: 4,
  },
  curso: {
    fontSize: 16,
    color: '#666',
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
  },
  nivel: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
    color: '#321c69',
  },
  coins: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#F1C40F',
    marginLeft: 4,
  },
  xp: {
    fontSize: 16,
    color: '#321c69',
    fontWeight: 'bold',
  },
  nickContainer: {
    marginVertical: 10,
    width: '100%',
    alignItems: 'center',
  },
  nickEditContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    justifyContent: 'center',
  },
  nickInput: {
    borderWidth: 1,
    borderColor: '#321c69',
    borderRadius: 5,
    padding: 8,
    width: '60%',
    marginRight: 10,
  },
  saveButton: {
    backgroundColor: '#321c69',
    padding: 10,
    borderRadius: 5,
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  editNickButton: {
    backgroundColor: '#321c69',
    padding: 10,
    borderRadius: 5,
  },
  editNickText: {
    color: '#fff',
    fontWeight: 'bold',
  },
}); 