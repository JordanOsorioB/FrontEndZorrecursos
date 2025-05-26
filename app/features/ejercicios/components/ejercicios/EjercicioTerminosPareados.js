import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { COLOR_PALETTE } from '../../constants/unitColors';

const EjercicioTerminosPareados = ({ ejercicio, onComplete }) => {
  const [terminos, setTerminos] = useState([]);
  const [definiciones, setDefiniciones] = useState([]);
  const [seleccionados, setSeleccionados] = useState([]);
  const [ultimoTipoSeleccionado, setUltimoTipoSeleccionado] = useState(null);
  const [colorActual, setColorActual] = useState(null);
  const [mostrarResultado, setMostrarResultado] = useState(false);
  const [resultado, setResultado] = useState(null);
  const [contadorPorColor, setContadorPorColor] = useState({});
  const [intentos, setIntentos] = useState(0);

  // Colores para los pares seleccionados
  const coloresPares = [
    '#E3F2FD', // Azul claro
    '#F3E5F5', // Púrpura claro
    '#E8F5E9', // Verde claro
    '#FFF3E0', // Naranja claro
  ];

  useEffect(() => {
    // Mezclar términos y definiciones al inicio
    const { pares: paresOriginales } = ejercicio.contenido.terminosPareados;
    
    // Crear arrays separados para términos y definiciones
    const terminosArray = paresOriginales.map(p => ({ 
      id: p.id, 
      texto: p.termino, 
      color: null,
      seleccionado: false,
      emparejado: false,
      parCorrecto: p.definicion
    }));
    
    const definicionesArray = paresOriginales.map(p => ({ 
      id: p.id, 
      texto: p.definicion, 
      color: null,
      seleccionado: false,
      emparejado: false,
      parCorrecto: p.termino
    }));
    
    // Mezclar aleatoriamente
    const terminosMezclados = [...terminosArray].sort(() => Math.random() - 0.5);
    const definicionesMezcladas = [...definicionesArray].sort(() => Math.random() - 0.5);
    
    setTerminos(terminosMezclados);
    setDefiniciones(definicionesMezcladas);
    setContadorPorColor({});
  }, [ejercicio]);

  const obtenerSiguienteColor = () => {
    // Encontrar el primer color que tenga menos de 2 elementos
    return coloresPares.find(color => !contadorPorColor[color] || contadorPorColor[color] < 2) || coloresPares[0];
  };

  const handleSeleccion = (item, tipo) => {
    if (mostrarResultado) return;
    
    // Si el item ya está emparejado, no hacer nada
    if (item.emparejado) return;

    // Verificar si el item ya está seleccionado
    const yaSeleccionado = seleccionados.find(s => s.id === item.id);
    if (yaSeleccionado) {
      // Si ya está seleccionado, lo quitamos
      setSeleccionados(prev => prev.filter(s => s.id !== item.id));
      setContadorPorColor(prev => ({
        ...prev,
        [yaSeleccionado.color]: (prev[yaSeleccionado.color] || 0) - 1
      }));
      
      if (tipo === 'termino') {
        setTerminos(prev => prev.map(t => 
          t.id === item.id ? { ...t, color: null, seleccionado: false } : t
        ));
      } else {
        setDefiniciones(prev => prev.map(d => 
          d.id === item.id ? { ...d, color: null, seleccionado: false } : d
        ));
      }
      
      // Si era el último seleccionado, actualizamos el último tipo
      if (seleccionados.length > 0 && seleccionados[seleccionados.length - 1].id === item.id) {
        setUltimoTipoSeleccionado(null);
        setColorActual(null);
      }
      
      return;
    }

    // Verificar si estamos seleccionando el mismo tipo que el último
    if (ultimoTipoSeleccionado === tipo) {
      // No permitir seleccionar dos términos o dos definiciones seguidos
      return;
    }

    // Determinar el color a usar
    let colorParaUsar = colorActual;
    
    // Si no hay color actual o el color actual ya tiene 2 elementos, obtener nuevo color
    if (!colorParaUsar || (contadorPorColor[colorParaUsar] || 0) >= 2) {
      colorParaUsar = obtenerSiguienteColor();
      setColorActual(colorParaUsar);
    }

    // Actualizar el contador de colores
    setContadorPorColor(prev => ({
      ...prev,
      [colorParaUsar]: (prev[colorParaUsar] || 0) + 1
    }));

    // Agregar la nueva selección
    const nuevoSeleccionado = {
      id: item.id,
      tipo,
      color: colorParaUsar
    };
    
    setSeleccionados(prev => [...prev, nuevoSeleccionado]);
    setUltimoTipoSeleccionado(tipo);

    // Actualizar el color en el array correspondiente
    if (tipo === 'termino') {
      setTerminos(prev => prev.map(t => 
        t.id === item.id ? { ...t, color: colorParaUsar, seleccionado: true } : t
      ));
    } else {
      setDefiniciones(prev => prev.map(d => 
        d.id === item.id ? { ...d, color: colorParaUsar, seleccionado: true } : d
      ));
    }
    
    // Si completamos un par (término + definición), emparejar ambos elementos
    if (seleccionados.length % 2 === 1) {
      // Emparejar el término y la definición actuales
      const parCompleto = [...seleccionados, nuevoSeleccionado];
      
      // Marcar ambos elementos como emparejados
      if (tipo === 'termino') {
        // Buscar la definición seleccionada
        const definicionSeleccionada = parCompleto.find(s => s.tipo === 'definicion');
        if (definicionSeleccionada) {
          setDefiniciones(prev => prev.map(d => 
            d.id === definicionSeleccionada.id ? { ...d, emparejado: true } : d
          ));
        }
        setTerminos(prev => prev.map(t => 
          t.id === item.id ? { ...t, emparejado: true } : t
        ));
      } else {
        // Buscar el término seleccionado
        const terminoSeleccionado = parCompleto.find(s => s.tipo === 'termino');
        if (terminoSeleccionado) {
          setTerminos(prev => prev.map(t => 
            t.id === terminoSeleccionado.id ? { ...t, emparejado: true } : t
          ));
        }
        setDefiniciones(prev => prev.map(d => 
          d.id === item.id ? { ...d, emparejado: true } : d
        ));
      }
      
      // Resetear el color actual para el siguiente par
      setColorActual(null);
    }
  };

  const verificarPares = () => {
    setIntentos(prev => prev + 1);
    const paresCorrectos = ejercicio.contenido.terminosPareados.pares;
    let correctos = 0;
    let incorrectos = 0;

    // Agrupar selecciones por color
    const seleccionesPorColor = seleccionados.reduce((acc, sel) => {
      if (!acc[sel.color]) acc[sel.color] = [];
      acc[sel.color].push(sel);
      return acc;
    }, {});

    // Verificar cada grupo de selecciones
    Object.values(seleccionesPorColor).forEach(grupo => {
      if (grupo.length === 2) {
        const [sel1, sel2] = grupo;
        const parCorrecto = paresCorrectos.find(p => 
          (p.id === sel1.id && sel1.tipo === 'termino') || 
          (p.id === sel2.id && sel2.tipo === 'termino')
        );

        if (parCorrecto && 
            ((sel1.tipo === 'termino' && sel2.id === parCorrecto.id) || 
             (sel2.tipo === 'termino' && sel1.id === parCorrecto.id))) {
          correctos++;
        } else {
          incorrectos++;
        }
      }
    });

    const totalPares = paresCorrectos.length;
    const porcentaje = (correctos / totalPares) * 100;
    const esCorrecto = porcentaje >= 70;

    const resultadoFinal = {
      correctos,
      incorrectos,
      total: totalPares,
      porcentaje,
      esCorrecto,
      intentos
    };

    setResultado(resultadoFinal);
    setMostrarResultado(true);

    if (esCorrecto) {
      onComplete({
        completado: true,
        intentos: intentos,
        respuestasCorrectas: correctos,
        experienciaGanada: ejercicio.experienciaTotal
      });
    }
  };

  const getEstiloItem = (item, tipo) => {
    if (!item.seleccionado) return styles.item;

    return {
      ...styles.item,
      backgroundColor: item.color,
      borderColor: item.color,
      borderWidth: 2
    };
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.instruccion}>{ejercicio.contenido.terminosPareados.instruccion}</Text>
      
      <Text style={styles.intentos}>Intentos: {intentos}</Text>

      <View style={styles.contenedorPrincipal}>
        <View style={styles.contenedorPares}>
          <View style={styles.columna}>
            <Text style={[styles.tituloColumna, { color: '#FF9800', backgroundColor: '#321c69' }]}>Términos</Text>
            {terminos.map((termino) => (
              <TouchableOpacity
                key={termino.id}
                style={getEstiloItem(termino, 'termino')}
                onPress={() => handleSeleccion(termino, 'termino')}
                disabled={mostrarResultado || termino.emparejado}
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
                disabled={mostrarResultado || definicion.emparejado}
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
});

export default EjercicioTerminosPareados; 