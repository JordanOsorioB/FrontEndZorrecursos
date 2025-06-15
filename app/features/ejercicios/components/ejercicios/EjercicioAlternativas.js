import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { COLOR_PALETTE } from '../../constants/unitColors';

export default function EjercicioAlternativas({ ejercicio, onComplete, onBuyAttempt, coins = 0, comprando = false, buyError = '' }) {
  const intentosRestantes = ejercicio?.estado?.attempts ?? ejercicio?.estado?.intentos ?? 0;
  const status = ejercicio?.estado?.completionStatus || 'NOT_ANSWERED';
  const fueCorrecto = status === 'CORRECT';
  const fueIncorrecto = status === 'INCORRECT';
  const [seleccionada, setSeleccionada] = useState(null);
  const mostrarResultadoInicial = (fueCorrecto || intentosRestantes === 0) ? true : false;
  const [mostrarResultado, setMostrarResultado] = useState(mostrarResultadoInicial);
  const intentosUsados = ejercicio?.estado?.correctAnswers ?? ejercicio?.estado?.respuestasCorrectas ?? 0;
  const estaBloqueado = intentosRestantes === 0;

  // Si ya fue intentado, selecciona la alternativa que eligió el usuario SOLO si fue correcta o no quedan intentos
  React.useEffect(() => {
    if (fueCorrecto && ejercicio?.contenido?.alternativas?.alternativas) {
      const altCorrecta = ejercicio.contenido.alternativas.alternativas.find(
        a => a.esCorrecta
      );
      if (altCorrecta) setSeleccionada(altCorrecta.id);
      setMostrarResultado(true);
    } else if (intentosRestantes === 0 && ejercicio?.estado?.respuesta) {
      // Si no quedan intentos, marcar la última seleccionada
      const alt = ejercicio.contenido.alternativas.alternativas.find(
        a => a.texto === ejercicio.estado.respuesta
      );
      if (alt) setSeleccionada(alt.id);
      setMostrarResultado(true);
    } else {
      setSeleccionada(null);
      setMostrarResultado(false);
    }
  }, [ejercicio, fueCorrecto, intentosRestantes]);

  const handleSeleccion = (alternativaId) => {
    if (!mostrarResultado && !estaBloqueado) {
      setSeleccionada(alternativaId);
    }
  };

  const handleSubmit = () => {
    if (seleccionada === null || estaBloqueado) return;
    const nuevoIntentosRestantes = intentosRestantes - 1;
    setMostrarResultado(true);
    const alternativaSeleccionada = ejercicio.contenido.alternativas.alternativas.find(
      alt => alt.id === seleccionada
    );
    if (alternativaSeleccionada.esCorrecta) {
      onComplete({
        completionStatus: 'CORRECT',
        attempts: nuevoIntentosRestantes,
        correctAnswers: intentosUsados + 1,
        experienceEarned: ejercicio.experienciaTotal,
        respuesta: alternativaSeleccionada.texto
      });
    } else {
      onComplete({
        completionStatus: 'INCORRECT',
        attempts: nuevoIntentosRestantes,
        correctAnswers: intentosUsados + 1,
        experienceEarned: 0,
        respuesta: alternativaSeleccionada.texto
      });
      // Si quedan intentos, permitir volver a intentar
      if (nuevoIntentosRestantes > 0) {
        setTimeout(() => {
          setMostrarResultado(false);
          setSeleccionada(null);
        }, 1200); // 1.2 segundos para feedback visual
      }
    }
  };

  const getAlternativaStyle = (alternativa) => {
    if (mostrarResultado) {
      if (alternativa.esCorrecta) {
        return styles.alternativaCorrecta;
      }
      if (alternativa.id === seleccionada && !alternativa.esCorrecta) {
        return styles.alternativaIncorrecta;
      }
    }
    return alternativa.id === seleccionada ? styles.alternativaSeleccionada : styles.alternativa;
  };

  const getAlternativaTextStyle = (alternativa) => {
    if (mostrarResultado) {
      if (alternativa.esCorrecta) {
        return styles.alternativaTextoCorrecta;
      }
      if (alternativa.id === seleccionada && !alternativa.esCorrecta) {
        return styles.alternativaTextoIncorrecta;
      }
    }
    return alternativa.id === seleccionada ? styles.alternativaTextoSeleccionado : styles.alternativaTexto;
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.enunciado}>
        {ejercicio.contenido.alternativas.enunciado}
      </Text>
      <Text style={styles.intentos}>Intentos restantes: {intentosRestantes}</Text>
      {/* Botón para comprar intento si no hay intentos y no está completado */}
      {intentosRestantes === 0 && status !== 'CORRECT' && (
        <View style={{ alignItems: 'center', marginBottom: 16 }}>
          <TouchableOpacity
            style={[
              styles.botonComprar,
              comprando && styles.botonComprarDeshabilitado
            ]}
            onPress={onBuyAttempt}
            disabled={comprando}
          >
            <MaterialIcons name="monetization-on" size={22} color="#FFD700" style={{marginRight:6}} />
            <Text style={{ color: '#321c69', fontWeight: 'bold', fontSize: 15 }}>
              {comprando ? 'Comprando...' : 'Comprar intento (1 coin)'}
            </Text>
          </TouchableOpacity>
          <Text style={{ fontSize: 14, color: '#321c69', marginTop: 4 }}>Coins disponibles: {coins}</Text>
          {buyError ? <Text style={{ color: 'red', marginTop: 4 }}>{buyError}</Text> : null}
        </View>
      )}
      <View style={styles.alternativasContainer}>
        {ejercicio.contenido.alternativas.alternativas.map((alternativa) => (
          <TouchableOpacity
            key={alternativa.id}
            style={getAlternativaStyle(alternativa)}
            onPress={() => handleSeleccion(alternativa.id)}
            disabled={mostrarResultado || estaBloqueado}
          >
            <Text style={getAlternativaTextStyle(alternativa)}>
              {alternativa.texto}
            </Text>
            {mostrarResultado && alternativa.esCorrecta && (
              <MaterialIcons name="check-circle" size={24} color={COLOR_PALETTE.status.success} />
            )}
            {mostrarResultado && alternativa.id === seleccionada && !alternativa.esCorrecta && (
              <MaterialIcons name="cancel" size={24} color={COLOR_PALETTE.status.error} />
            )}
          </TouchableOpacity>
        ))}
      </View>
      <TouchableOpacity
        style={[
          styles.botonSubmit,
          { backgroundColor: '#321c69' },
          (!seleccionada || mostrarResultado || estaBloqueado) && styles.botonSubmitDeshabilitado
        ]}
        onPress={handleSubmit}
        disabled={!seleccionada || mostrarResultado || estaBloqueado}
      >
        <Text style={[styles.botonSubmitTexto, { color: '#FF9800' }]}> 
          {(mostrarResultado && (intentosRestantes === 0 || fueCorrecto)) ? 'Completado' : 'Enviar a calificar'}
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
  botonComprar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF8E1',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 18,
    borderWidth: 1,
    borderColor: '#FFD700',
    marginBottom: 2,
  },
  botonComprarDeshabilitado: {
    opacity: 0.5,
  },
}); 