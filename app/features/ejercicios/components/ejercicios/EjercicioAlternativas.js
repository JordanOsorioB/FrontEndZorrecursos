import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { COLOR_PALETTE } from '../../constants/unitColors';

export default function EjercicioAlternativas({ ejercicio, onComplete }) {
  const [seleccionada, setSeleccionada] = useState(null);
  const [mostrarResultado, setMostrarResultado] = useState(false);
  const [intentos, setIntentos] = useState(0);

  const handleSeleccion = (alternativaId) => {
    if (!mostrarResultado) {
      setSeleccionada(alternativaId);
    }
  };

  const handleSubmit = () => {
    if (seleccionada === null) return;
    
    setIntentos(prev => prev + 1);
    setMostrarResultado(true);
    const alternativaSeleccionada = ejercicio.contenido.alternativas.alternativas.find(
      alt => alt.id === seleccionada
    );
    
    if (alternativaSeleccionada.esCorrecta) {
      onComplete({
        completado: true,
        intentos: intentos + 1,
        respuestasCorrectas: 1,
        experienciaGanada: ejercicio.experienciaTotal
      });
    }
  };

  const getAlternativaStyle = (alternativa) => {
    if (!mostrarResultado) {
      return alternativa.id === seleccionada ? styles.alternativaSeleccionada : styles.alternativa;
    }
    
    if (alternativa.esCorrecta) {
      return styles.alternativaCorrecta;
    }
    return alternativa.id === seleccionada ? styles.alternativaIncorrecta : styles.alternativa;
  };

  const getAlternativaTextStyle = (alternativa) => {
    if (!mostrarResultado) {
      return alternativa.id === seleccionada ? styles.alternativaTextoSeleccionado : styles.alternativaTexto;
    }
    
    if (alternativa.esCorrecta) {
      return styles.alternativaTextoCorrecta;
    }
    return alternativa.id === seleccionada ? styles.alternativaTextoIncorrecta : styles.alternativaTexto;
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.enunciado}>
        {ejercicio.contenido.alternativas.enunciado}
      </Text>
      <Text style={styles.intentos}>Intentos: {intentos}</Text>

      <View style={styles.alternativasContainer}>
        {ejercicio.contenido.alternativas.alternativas.map((alternativa) => (
          <TouchableOpacity
            key={alternativa.id}
            style={getAlternativaStyle(alternativa)}
            onPress={() => handleSeleccion(alternativa.id)}
            disabled={mostrarResultado}
          >
            <Text style={getAlternativaTextStyle(alternativa)}>
              {alternativa.texto}
            </Text>
            {mostrarResultado && alternativa.esCorrecta && (
              <MaterialIcons name="check-circle" size={24} color={COLOR_PALETTE.status.success} />
            )}
            {mostrarResultado && !alternativa.esCorrecta && alternativa.id === seleccionada && (
              <MaterialIcons name="cancel" size={24} color={COLOR_PALETTE.status.error} />
            )}
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity
        style={[
          styles.botonSubmit,
          { backgroundColor: '#321c69' },
          (!seleccionada || mostrarResultado) && styles.botonSubmitDeshabilitado
        ]}
        onPress={handleSubmit}
        disabled={!seleccionada || mostrarResultado}
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
  alternativasContainer: {
    marginBottom: 24,
  },
  alternativa: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#321c69',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  alternativaSeleccionada: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: '#321c69',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  alternativaCorrecta: {
    backgroundColor: '#E8F5E9',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: COLOR_PALETTE.status.success,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  alternativaIncorrecta: {
    backgroundColor: '#FFEBEE',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: COLOR_PALETTE.status.error,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  alternativaTexto: {
    fontSize: 16,
    color: '#321c69',
    flex: 1,
  },
  alternativaTextoSeleccionado: {
    fontSize: 16,
    color: '#321c69',
    fontWeight: 'bold',
    flex: 1,
  },
  alternativaTextoCorrecta: {
    fontSize: 16,
    color: COLOR_PALETTE.status.success,
    fontWeight: 'bold',
    flex: 1,
  },
  alternativaTextoIncorrecta: {
    fontSize: 16,
    color: COLOR_PALETTE.status.error,
    fontWeight: 'bold',
    flex: 1,
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