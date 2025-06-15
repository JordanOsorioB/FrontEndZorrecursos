import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { COLOR_PALETTE } from '../../constants/unitColors';

const EjercicioTerminosPareados = ({ ejercicio, onComplete, onBuyAttempt, coins = 0, comprando = false, buyError = '' }) => {
  const [terminos, setTerminos] = useState([]);
  const [definiciones, setDefiniciones] = useState([]);
  const [seleccionados, setSeleccionados] = useState([]);
  const [paresUsuario, setParesUsuario] = useState([]);
  const [ultimoSeleccionado, setUltimoSeleccionado] = useState(null);
  const [mostrarResultado, setMostrarResultado] = useState(false);
  const [resultado, setResultado] = useState(null);
  // --- NUEVA LÓGICA DE INTENTOS ---
  const intentosRestantes = ejercicio?.estado?.attempts ?? ejercicio?.estado?.intentos ?? 0;
  const intentosUsados = ejercicio?.estado?.correctAnswers ?? ejercicio?.estado?.respuestasCorrectas ?? 0;
  const estaBloqueado = intentosRestantes === 0;

  // Colores para los pares seleccionados
  const coloresPares = [
    '#E3F2FD', // Azul claro
    '#F3E5F5', // Púrpura claro
    '#E8F5E9', // Verde claro
    '#FFF3E0', // Naranja claro
    '#FFECB3', // Amarillo claro
    '#FFCDD2', // Rojo claro
    '#B2EBF2', // Celeste claro
    '#D1C4E9', // Lila claro
  ];

  useEffect(() => {
    const paresOriginales = ejercicio?.contenido?.terminosPareados?.pares || [];
    // Crear arrays separados para términos y definiciones
    const terminosArray = paresOriginales.map(p => ({ 
      id: p.id, 
      texto: p.termino, 
      emparejado: false,
      colorIndex: null
    }));
    const definicionesArray = paresOriginales.map(p => ({ 
      id: p.id, 
      texto: p.definicion, 
      emparejado: false,
      colorIndex: null
    }));
    // Mezclar aleatoriamente
    setTerminos([...terminosArray].sort(() => Math.random() - 0.5));
    setDefiniciones([...definicionesArray].sort(() => Math.random() - 0.5));
    setSeleccionados([]);
    setParesUsuario([]);
    setUltimoSeleccionado(null);
    setMostrarResultado(false);
    setResultado(null);
  }, [ejercicio]);

  const handleSeleccion = (item, tipo) => {
    if (mostrarResultado || estaBloqueado) return;
    // Si ya está emparejado, no permitir seleccionar
    if (item.emparejado) return;
    // Si ya está seleccionado, deselecciona
    if (seleccionados.find(s => s.id === item.id && s.tipo === tipo)) {
      setSeleccionados([]);
      setUltimoSeleccionado(null);
      return;
    }
    // Si no hay selección previa, selecciona el actual
    if (!ultimoSeleccionado) {
      setSeleccionados([{ id: item.id, tipo }]);
      setUltimoSeleccionado({ id: item.id, tipo });
      return;
    }
    // Si hay una selección previa de tipo diferente, forma un par
    if (ultimoSeleccionado.tipo !== tipo) {
      // Determinar color para el nuevo par
      const colorIndex = paresUsuario.length % coloresPares.length;
      // Guarda el par
      setParesUsuario(prev => [...prev, {
        terminoId: tipo === 'definicion' ? ultimoSeleccionado.id : item.id,
        definicionId: tipo === 'definicion' ? item.id : ultimoSeleccionado.id,
        colorIndex
      }]);
      // Marca ambos como emparejados y con color
      setTerminos(prev => prev.map(t =>
        t.id === (tipo === 'definicion' ? ultimoSeleccionado.id : item.id)
          ? { ...t, emparejado: true, colorIndex }
          : t
      ));
      setDefiniciones(prev => prev.map(d =>
        d.id === (tipo === 'definicion' ? item.id : ultimoSeleccionado.id)
          ? { ...d, emparejado: true, colorIndex }
          : d
      ));
      setSeleccionados([]);
      setUltimoSeleccionado(null);
      return;
    }
    // Si selecciona dos del mismo tipo, reemplaza la selección
    setSeleccionados([{ id: item.id, tipo }]);
    setUltimoSeleccionado({ id: item.id, tipo });
  };

  const verificarPares = () => {
    if (estaBloqueado) return;
    const nuevoIntentosRestantes = intentosRestantes - 1;
    const paresCorrectos = ejercicio?.contenido?.terminosPareados?.pares || [];
    let correctos = 0;
    let incorrectos = 0;
    paresUsuario.forEach(par => {
      const parCorrecto = paresCorrectos.find(p =>
        (p.id === par.terminoId && p.definicion === definiciones.find(d => d.id === par.definicionId)?.texto && p.termino === terminos.find(t => t.id === par.terminoId)?.texto)
      );
      if (parCorrecto) correctos++;
      else incorrectos++;
    });
    const totalPares = paresCorrectos.length;
    const porcentaje = (correctos / totalPares) * 100;
    const esCorrecto = porcentaje >= 70;
    setResultado({ correctos, incorrectos, total: totalPares, porcentaje, esCorrecto });
    setMostrarResultado(true);
    if (esCorrecto) {
      onComplete({
        completionStatus: 'CORRECT',
        attempts: nuevoIntentosRestantes,
        correctAnswers: intentosUsados + 1,
        experienceEarned: ejercicio.experienciaTotal,
        respuesta: JSON.stringify(paresUsuario),
        locked: nuevoIntentosRestantes === 0 ? true : ejercicio?.estado?.bloqueado ?? false
      });
    } else {
      onComplete({
        completionStatus: 'INCORRECT',
        attempts: nuevoIntentosRestantes,
        correctAnswers: intentosUsados + 1,
        experienceEarned: 0,
        respuesta: JSON.stringify(paresUsuario),
        locked: nuevoIntentosRestantes === 0 ? true : ejercicio?.estado?.bloqueado ?? false
      });
    }
  };

  const getEstiloItem = (item, tipo) => {
    // Si está emparejado, busca el color del par
    if (item.emparejado && item.colorIndex !== null) {
      if (mostrarResultado) {
        // Busca el par del usuario
        const parUsuario = paresUsuario.find(par =>
          (tipo === 'termino' && par.terminoId === item.id) ||
          (tipo === 'definicion' && par.definicionId === item.id)
        );
        if (parUsuario) {
          const paresCorrectos = ejercicio?.contenido?.terminosPareados?.pares || [];
          const termino = terminos.find(t => t.id === parUsuario.terminoId);
          const definicion = definiciones.find(d => d.id === parUsuario.definicionId);
          const esCorrecto = paresCorrectos.some(p =>
            p.termino === termino.texto && p.definicion === definicion.texto
          );
          return {
            ...styles.item,
            backgroundColor: esCorrecto ? '#C8E6C9' : '#FFCDD2',
            borderColor: esCorrecto ? '#388E3C' : '#D32F2F',
            borderWidth: 2
          };
        }
      }
      // Antes de calificar, solo muestra el color del par
      return {
        ...styles.item,
        backgroundColor: coloresPares[item.colorIndex],
        borderColor: coloresPares[item.colorIndex],
        borderWidth: 2
      };
    }
    // Si está seleccionado
    if (seleccionados.find(s => s.id === item.id && s.tipo === tipo)) {
      return {
        ...styles.item,
        backgroundColor: '#FFF9C4',
        borderColor: '#FFEB3B',
        borderWidth: 2
      };
    }
    return styles.item;
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.instruccion}>{ejercicio.contenido.terminosPareados.instruccion}</Text>
      <Text style={styles.intentos}>Intentos restantes: {intentosRestantes}</Text>
      {/* Botón para comprar intento si no hay intentos y no está completado */}
      {intentosRestantes === 0 && (!resultado || !resultado.esCorrecto) && (
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
      <View style={styles.contenedorPrincipal}>
        <View style={styles.contenedorPares}>
          <View style={styles.columna}>
            <Text style={[styles.tituloColumna, { color: '#FF9800', backgroundColor: '#321c69' }]}>Términos</Text>
            {terminos.map((termino) => (
              <TouchableOpacity
                key={termino.id}
                style={getEstiloItem(termino, 'termino')}
                onPress={() => handleSeleccion(termino, 'termino')}
                disabled={mostrarResultado || termino.emparejado || estaBloqueado}
              >
                <Text style={styles.textoItem}>{termino.texto}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <View style={styles.columna}>
            <Text style={[styles.tituloColumna, { color: '#FF9800', backgroundColor: '#321c69' }]}>Definiciones</Text>
            {definiciones.map((definicion) => (
              <TouchableOpacity
                key={definicion.id}
                style={getEstiloItem(definicion, 'definicion')}
                onPress={() => handleSeleccion(definicion, 'definicion')}
                disabled={mostrarResultado || definicion.emparejado || estaBloqueado}
              >
                <Text style={styles.textoItem}>{definicion.texto}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
        {!mostrarResultado ? (
          <TouchableOpacity 
            style={[styles.botonVerificar, { backgroundColor: '#321c69' }]}
            onPress={verificarPares}
            disabled={paresUsuario.length !== terminos.length || estaBloqueado}
          >
            <Text style={[styles.textoBoton, { color: '#FF9800' }]}>Enviar a calificar</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.resultadoContainer}>
            <Text style={styles.textoResultado}>
              {resultado.esCorrecto ? '¡Correcto!' : 'Incorrecto'}
            </Text>
            <Text style={styles.detalleResultado}>
              Pares correctos: {resultado.correctos}
            </Text>
            <Text style={styles.detalleResultado}>
              Pares incorrectos: {resultado.incorrectos}
            </Text>
            <Text style={styles.detalleResultado}>
              Porcentaje de acierto: {resultado.porcentaje.toFixed(1)}%
            </Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contenedorPrincipal: {
    padding: 16,
  },
  instruccion: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 30,
    marginTop: 10,
    color: '#321c69',
    textAlign: 'center',
    paddingHorizontal: 16,
  },
  contenedorPares: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  columna: {
    flex: 1,
    marginHorizontal: 8,
  },
  tituloColumna: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    padding: 8,
    borderRadius: 8,
    textAlign: 'center',
  },
  item: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#321c69',
    backgroundColor: '#fff',
  },
  textoItem: {
    fontSize: 14,
    color: '#321c69',
  },
  botonVerificar: {
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  textoBoton: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  resultadoContainer: {
    marginTop: 20,
    padding: 16,
    borderRadius: 8,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#321c69',
  },
  textoResultado: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#321c69',
  },
  detalleResultado: {
    fontSize: 16,
    marginBottom: 5,
    color: '#321c69',
  },
  intentos: {
    fontSize: 16,
    color: '#321c69',
    textAlign: 'center',
    marginVertical: 10,
    fontWeight: 'bold',
    paddingHorizontal: 16,
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

export default EjercicioTerminosPareados; 