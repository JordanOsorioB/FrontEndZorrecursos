import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, Keyboard } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { COLOR_PALETTE } from '../../constants/unitColors';

export default function EjercicioDesarrollo({ ejercicio, onComplete }) {
  const [respuesta, setRespuesta] = useState('');
  const [mostrarResultado, setMostrarResultado] = useState(false);
  const [esCorrecta, setEsCorrecta] = useState(false);
  const [intentos, setIntentos] = useState(0);

  const validarRespuesta = (texto) => {
    const respuestaLimpia = texto.toLowerCase().trim();
    const palabrasRespuesta = respuestaLimpia.split(/\s+/);
    
    const palabrasEncontradas = ejercicio.contenido.desarrollo.palabrasClave.filter(
      palabra => palabrasRespuesta.includes(palabra.toLowerCase())
    );

    const porcentajeCoincidencia = (palabrasEncontradas.length / ejercicio.contenido.desarrollo.palabrasClave.length) * 100;
    return porcentajeCoincidencia >= ejercicio.contenido.desarrollo.porcentajeCoincidencia;
  };

  const handleSubmit = () => {
    if (respuesta.trim() === '') return;
    
    Keyboard.dismiss();
    setIntentos(prev => prev + 1);
    const correcta = validarRespuesta(respuesta);
    setEsCorrecta(correcta);
    setMostrarResultado(true);
    
    if (correcta) {
      onComplete({
        completado: true,
        intentos: intentos + 1,
        respuestasCorrectas: 1,
        experienciaGanada: ejercicio.experienciaTotal
      });
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.enunciado}>
        {ejercicio.contenido.desarrollo.enunciado}
      </Text>
      <Text style={styles.intentos}>Intentos: {intentos}</Text>

      <View style={styles.inputContainer}>
        <TextInput
          style={[
            styles.input,
            mostrarResultado && (esCorrecta ? styles.inputCorrecto : styles.inputIncorrecto)
          ]}
          multiline
          numberOfLines={4}
          placeholder="Escribe tu respuesta aquí..."
          value={respuesta}
          onChangeText={setRespuesta}
          editable={!mostrarResultado}
          placeholderTextColor="#321c69"
        />
      </View>

      {mostrarResultado && (
        <View style={styles.resultadoContainer}>
          <MaterialIcons
            name={esCorrecta ? "check-circle" : "cancel"}
            size={24}
            color={esCorrecta ? COLOR_PALETTE.status.success : COLOR_PALETTE.status.error}
          />
          <Text style={[
            styles.resultadoTexto,
            { color: esCorrecta ? COLOR_PALETTE.status.success : COLOR_PALETTE.status.error }
          ]}>
            {esCorrecta ? '¡Correcto!' : 'Casi... La respuesta correcta era:'}
          </Text>
          {!esCorrecta && (
            <Text style={styles.respuestaCorrecta}>
              {ejercicio.contenido.desarrollo.respuestaCorrecta}
            </Text>
          )}
        </View>
      )}

      <TouchableOpacity
        style={[
          styles.botonSubmit,
          { backgroundColor: '#321c69' },
          (respuesta.trim() === '' || mostrarResultado) && styles.botonSubmitDeshabilitado
        ]}
        onPress={handleSubmit}
        disabled={respuesta.trim() === '' || mostrarResultado}
      >
        <Text style={[styles.botonSubmitTexto, { color: '#FF9800' }]}>
          {mostrarResultado ? 'Completado' : 'Enviar a calificar'}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  enunciado: {
    fontSize: 18,
    color: '#321c69',
    marginBottom: 24,
    lineHeight: 24,
  },
  inputContainer: {
    marginBottom: 24,
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#321c69',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    minHeight: 120,
    textAlignVertical: 'top',
    color: '#321c69',
  },
  inputCorrecto: {
    borderColor: COLOR_PALETTE.status.success,
    backgroundColor: '#E8F5E9',
  },
  inputIncorrecto: {
    borderColor: COLOR_PALETTE.status.error,
    backgroundColor: '#FFEBEE',
  },
  resultadoContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: 24,
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#321c69',
  },
  resultadoTexto: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 8,
  },
  respuestaCorrecta: {
    marginTop: 8,
    fontSize: 16,
    color: '#321c69',
    fontStyle: 'italic',
  },
  botonSubmit: {
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  botonSubmitDeshabilitado: {
    backgroundColor: '#E0E0E0',
  },
  botonSubmitTexto: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  intentos: {
    fontSize: 16,
    color: '#321c69',
    textAlign: 'center',
    marginVertical: 10,
    fontWeight: 'bold'
  },
}); 