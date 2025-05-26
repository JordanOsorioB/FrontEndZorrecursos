export const estudianteMock = {
  id: "EST001",
  nombre: "Juan Pérez",
  curso: "1° Básico A",
  nivel: {
    actual: 3,
    experiencia: {
      actual: 450,
      necesaria: 1000
    }
  },
  asignaturas: [
    {
      id: "MAT001",
      nombre: "Matemáticas",
      progreso: 45,
      unidades: [
        {
          id: 1,
          titulo: "Números y Operaciones",
          descripcion: "Aprende a contar y realizar operaciones básicas",
          orden: 1,
          progreso: 60,
          ejercicios: [
            {
              id: "EJ001",
              titulo: "Contando del 1 al 10",
              descripcion: "Aprende a contar los primeros números",
              tipo: "alternativas",
              dificultad: "Fácil",
              experienciaTotal: 100,
              estado: {
                completado: true,
                intentos: 2,
                ultimoIntento: "2024-03-15",
                respuestasCorrectas: 1,
                experienciaGanada: 100,
                bloqueado: false
              },
              contenido: {
                alternativas: {
                  enunciado: "¿Cuál es el número que viene después del 7?",
                  alternativas: [
                    { id: "a", texto: "8", esCorrecta: true },
                    { id: "b", texto: "6", esCorrecta: false },
                    { id: "c", texto: "9", esCorrecta: false },
                    { id: "d", texto: "7", esCorrecta: false }
                  ]
                }
              }
            },
            {
              id: "EJ002",
              titulo: "Suma hasta 5",
              descripcion: "Primeros pasos en la suma",
              tipo: "desarrollo",
              dificultad: "Fácil",
              experienciaTotal: 100,
              estado: {
                completado: true,
                intentos: 1,
                ultimoIntento: "2024-03-15",
                respuestasCorrectas: 1,
                experienciaGanada: 100,
                bloqueado: false
              },
              contenido: {
                desarrollo: {
                  enunciado: "Si tienes 3 manzanas y te dan 2 más, ¿cuántas manzanas tienes en total? Explica cómo llegaste a tu respuesta.",
                  respuestaCorrecta: "5 manzanas",
                  palabrasClave: ["5", "cinco", "manzanas", "suma", "más"],
                  porcentajeCoincidencia: 70
                }
              }
            },
            {
              id: "EJ003",
              titulo: "Resta hasta 5",
              descripcion: "Introducción a la resta",
              tipo: "terminos_pareados",
              dificultad: "Media",
              experienciaTotal: 150,
              estado: {
                completado: true,
                intentos: 0,
                bloqueado: false
              },
              contenido: {
                terminosPareados: {
                  instruccion: "Relaciona cada resta con su resultado correcto",
                  pares: [
                    { id: "1", termino: "5 - 2", definicion: "3" },
                    { id: "2", termino: "4 - 1", definicion: "3" },
                    { id: "3", termino: "3 - 2", definicion: "1" },
                    { id: "4", termino: "5 - 3", definicion: "2" }
                  ]
                }
              }
            },
            {
              id: "EJ004",
              titulo: "Suma hasta 10",
              descripcion: "Sumas más avanzadas",
              tipo: "alternativas",
              dificultad: "Media",
              experienciaTotal: 150,
              estado: {
                completado: true,
                intentos: 0,
                bloqueado: false
              },
              contenido: {
                alternativas: {
                  enunciado: "¿Cuánto es 7 + 3?",
                  alternativas: [
                    { id: "a", texto: "9", esCorrecta: false },
                    { id: "b", texto: "10", esCorrecta: true },
                    { id: "c", texto: "11", esCorrecta: false },
                    { id: "d", texto: "8", esCorrecta: false }
                  ]
                }
              }
            },
            {
              id: "EJ005",
              titulo: "Resta hasta 10",
              descripcion: "Restas más avanzadas",
              tipo: "desarrollo",
              dificultad: "Difícil",
              experienciaTotal: 200,
              estado: {
                completado: true,
                intentos: 1,
                bloqueado: false
              },
              contenido: {
                desarrollo: {
                  enunciado: "Si tienes 10 caramelos y te comes 4, ¿cuántos te quedan? Explica cómo lo calculaste.",
                  respuestaCorrecta: "6 caramelos",
                  palabrasClave: ["6", "seis", "caramelos", "resta", "quedan"],
                  porcentajeCoincidencia: 70
                }
              }
            }
          ]
        },
        {
          id: 2,
          titulo: "Geometría Básica",
          descripcion: "Reconocimiento de formas y figuras",
          orden: 2,
          progreso: 40,
          ejercicios: [
            {
              id: "EJ006",
              titulo: "Círculos y Cuadrados",
              descripcion: "Identifica formas básicas",
              tipo: "terminos_pareados",
              dificultad: "Fácil",
              experienciaTotal: 100,
              estado: {
                completado: false,
                intentos: 1,
                ultimoIntento: "2024-03-16",
                respuestasCorrectas: 1,
                experienciaGanada: 100,
                bloqueado: false
              },
              contenido: {
                terminosPareados: {
                  instruccion: "Relaciona cada forma con su descripción",
                  pares: [
                    { id: "1", termino: "Círculo", definicion: "Forma redonda" },
                    { id: "2", termino: "Cuadrado", definicion: "4 lados iguales" },
                    { id: "3", termino: "Triángulo", definicion: "3 lados" },
                    { id: "4", termino: "Rectángulo", definicion: "4 lados, 2 pares iguales" }
                  ]
                }
              }
            },
            {
              id: "EJ007",
              titulo: "Triángulos y Rectángulos",
              descripcion: "Más formas geométricas",
              tipo: "alternativas",
              dificultad: "Fácil",
              experienciaTotal: 100,
              estado: {
                completado: false,
                intentos: 0,
                bloqueado: false
              },
              contenido: {
                alternativas: {
                  enunciado: "¿Qué forma tiene 3 lados?",
                  alternativas: [
                    { id: "a", texto: "Círculo", esCorrecta: false },
                    { id: "b", texto: "Cuadrado", esCorrecta: false },
                    { id: "c", texto: "Triángulo", esCorrecta: true },
                    { id: "d", texto: "Rectángulo", esCorrecta: false }
                  ]
                }
              }
            },
            {
              id: "EJ008",
              titulo: "Colores y Formas",
              descripcion: "Combina colores y formas",
              tipo: "desarrollo",
              dificultad: "Media",
              experienciaTotal: 150,
              estado: {
                completado: false,
                intentos: 0,
                bloqueado: false
              },
              contenido: {
                desarrollo: {
                  enunciado: "Describe cómo se vería un cuadrado rojo y un círculo azul. ¿En qué se diferencian?",
                  respuestaCorrecta: "El cuadrado rojo tiene 4 lados iguales y es de color rojo, mientras que el círculo azul es redondo y de color azul",
                  palabrasClave: ["cuadrado", "rojo", "4 lados", "círculo", "azul", "redondo"],
                  porcentajeCoincidencia: 60
                }
              }
            },
            {
              id: "EJ009",
              titulo: "Patrones de Formas",
              descripcion: "Encuentra secuencias de formas",
              tipo: "terminos_pareados",
              dificultad: "Media",
              experienciaTotal: 150,
              estado: {
                completado: false,
                intentos: 0,
                bloqueado: false
              },
              contenido: {
                terminosPareados: {
                  instruccion: "Relaciona cada patrón con su secuencia correcta",
                  pares: [
                    { id: "1", termino: "Círculo-Cuadrado-Círculo", definicion: "○□○" },
                    { id: "2", termino: "Triángulo-Círculo-Triángulo", definicion: "△○△" },
                    { id: "3", termino: "Cuadrado-Triángulo-Cuadrado", definicion: "□△□" },
                    { id: "4", termino: "Círculo-Triángulo-Círculo", definicion: "○△○" }
                  ]
                }
              }
            },
            {
              id: "EJ010",
              titulo: "Formas en 3D",
              descripcion: "Introducción a cubos y esferas",
              tipo: "alternativas",
              dificultad: "Difícil",
              experienciaTotal: 200,
              estado: {
                completado: false,
                intentos: 0,
                bloqueado: false
              },
              contenido: {
                alternativas: {
                  enunciado: "¿Qué forma 3D tiene todas sus caras cuadradas?",
                  alternativas: [
                    { id: "a", texto: "Esfera", esCorrecta: false },
                    { id: "b", texto: "Cubo", esCorrecta: true },
                    { id: "c", texto: "Cilindro", esCorrecta: false },
                    { id: "d", texto: "Cono", esCorrecta: false }
                  ]
                }
              }
            }
          ]
        },
        {
          id: 3,
          titulo: "Medición",
          descripcion: "Aprende a medir",
          orden: 3,
          progreso: 20,
          ejercicios: [
            {
              id: "EJ011",
              titulo: "Largo y Corto",
              descripcion: "Compara longitudes",
              tipo: "desarrollo",
              dificultad: "Fácil",
              experienciaTotal: 100,
              estado: {
                completado: false,
                intentos: 1,
                ultimoIntento: "2024-03-17",
                respuestasCorrectas: 1,
                experienciaGanada: 100,
                bloqueado: false
              },
              contenido: {
                desarrollo: {
                  enunciado: "¿Qué objeto es más largo: un lápiz o una regla? Explica por qué.",
                  respuestaCorrecta: "La regla es más larga que el lápiz porque mide 30 centímetros mientras que el lápiz mide aproximadamente 15 centímetros",
                  palabrasClave: ["regla", "más larga", "30", "centímetros", "lápiz", "15"],
                  porcentajeCoincidencia: 60
                }
              }
            },
            {
              id: "EJ012",
              titulo: "Grande y Pequeño",
              descripcion: "Compara tamaños",
              tipo: "terminos_pareados",
              dificultad: "Fácil",
              experienciaTotal: 100,
              estado: {
                completado: false,
                intentos: 0,
                bloqueado: false
              },
              contenido: {
                terminosPareados: {
                  instruccion: "Relaciona cada objeto con su tamaño",
                  pares: [
                    { id: "1", termino: "Elefante", definicion: "Grande" },
                    { id: "2", termino: "Ratón", definicion: "Pequeño" },
                    { id: "3", termino: "Casa", definicion: "Grande" },
                    { id: "4", termino: "Lápiz", definicion: "Pequeño" }
                  ]
                }
              }
            },
            {
              id: "EJ013",
              titulo: "Pesado y Liviano",
              descripcion: "Compara pesos",
              tipo: "alternativas",
              dificultad: "Media",
              experienciaTotal: 150,
              estado: {
                completado: false,
                intentos: 0,
                bloqueado: false
              },
              contenido: {
                alternativas: {
                  enunciado: "¿Qué objeto es más pesado?",
                  alternativas: [
                    { id: "a", texto: "Una pluma", esCorrecta: false },
                    { id: "b", texto: "Un libro", esCorrecta: true },
                    { id: "c", texto: "Una hoja de papel", esCorrecta: false },
                    { id: "d", texto: "Un algodón", esCorrecta: false }
                  ]
                }
              }
            },
            {
              id: "EJ014",
              titulo: "Medir con Regla",
              descripcion: "Usa la regla para medir",
              tipo: "desarrollo",
              dificultad: "Media",
              experienciaTotal: 150,
              estado: {
                completado: false,
                intentos: 0,
                bloqueado: false
              },
              contenido: {
                desarrollo: {
                  enunciado: "Si mides un libro con la regla y tiene 20 centímetros de largo, ¿cuántos centímetros más largo es que un cuaderno de 15 centímetros?",
                  respuestaCorrecta: "El libro es 5 centímetros más largo que el cuaderno",
                  palabrasClave: ["5", "cinco", "centímetros", "más largo"],
                  porcentajeCoincidencia: 70
                }
              }
            },
            {
              id: "EJ015",
              titulo: "Unidades de Medida",
              descripcion: "Centímetros y metros",
              tipo: "terminos_pareados",
              dificultad: "Difícil",
              experienciaTotal: 200,
              estado: {
                completado: false,
                intentos: 0,
                bloqueado: false
              },
              contenido: {
                terminosPareados: {
                  instruccion: "Relaciona cada medida con su unidad apropiada",
                  pares: [
                    { id: "1", termino: "Altura de una persona", definicion: "Metros" },
                    { id: "2", termino: "Largo de un lápiz", definicion: "Centímetros" },
                    { id: "3", termino: "Distancia entre ciudades", definicion: "Kilómetros" },
                    { id: "4", termino: "Ancho de un dedo", definicion: "Centímetros" }
                  ]
                }
              }
            }
          ]
        },
        {
          id: 4,
          titulo: "Tiempo y Calendario",
          descripcion: "Aprende sobre el tiempo",
          orden: 4,
          progreso: 0,
          ejercicios: [
            {
              id: "EJ016",
              titulo: "Días de la Semana",
              descripcion: "Aprende los días",
              tipo: "alternativas",
              dificultad: "Fácil",
              experienciaTotal: 100,
              estado: {
                completado: false,
                intentos: 0,
                bloqueado: false
              },
              contenido: {
                alternativas: {
                  enunciado: "¿Qué día viene después del miércoles?",
                  alternativas: [
                    { id: "a", texto: "Martes", esCorrecta: false },
                    { id: "b", texto: "Jueves", esCorrecta: true },
                    { id: "c", texto: "Viernes", esCorrecta: false },
                    { id: "d", texto: "Lunes", esCorrecta: false }
                  ]
                }
              }
            },
            {
              id: "EJ017",
              titulo: "Mañana y Tarde",
              descripcion: "Momentos del día",
              tipo: "terminos_pareados",
              dificultad: "Fácil",
              experienciaTotal: 100,
              estado: {
                completado: false,
                intentos: 0,
                bloqueado: false
              },
              contenido: {
                terminosPareados: {
                  instruccion: "Relaciona cada actividad con su momento del día",
                  pares: [
                    { id: "1", termino: "Desayuno", definicion: "Mañana" },
                    { id: "2", termino: "Almuerzo", definicion: "Mediodía" },
                    { id: "3", termino: "Cena", definicion: "Noche" },
                    { id: "4", termino: "Merienda", definicion: "Tarde" }
                  ]
                }
              }
            },
            {
              id: "EJ018",
              titulo: "El Reloj: Horas",
              descripcion: "Lee las horas en punto",
              tipo: "desarrollo",
              dificultad: "Media",
              experienciaTotal: 150,
              estado: {
                completado: false,
                intentos: 0,
                bloqueado: false
              },
              contenido: {
                desarrollo: {
                  enunciado: "Si el reloj marca las 3 en punto, ¿qué hora será en 2 horas?",
                  respuestaCorrecta: "Las 5 en punto",
                  palabrasClave: ["5", "cinco", "en punto", "2 horas más"],
                  porcentajeCoincidencia: 70
                }
              }
            },
            {
              id: "EJ019",
              titulo: "Meses del Año",
              descripcion: "Aprende los meses",
              tipo: "alternativas",
              dificultad: "Media",
              experienciaTotal: 150,
              estado: {
                completado: false,
                intentos: 0,
                bloqueado: false
              },
              contenido: {
                alternativas: {
                  enunciado: "¿Qué mes viene después de junio?",
                  alternativas: [
                    { id: "a", texto: "Mayo", esCorrecta: false },
                    { id: "b", texto: "Julio", esCorrecta: true },
                    { id: "c", texto: "Agosto", esCorrecta: false },
                    { id: "d", texto: "Septiembre", esCorrecta: false }
                  ]
                }
              }
            },
            {
              id: "EJ020",
              titulo: "El Reloj: Medias Horas",
              descripcion: "Lee las medias horas",
              tipo: "terminos_pareados",
              dificultad: "Difícil",
              experienciaTotal: 200,
              estado: {
                completado: false,
                intentos: 0,
                bloqueado: false
              },
              contenido: {
                terminosPareados: {
                  instruccion: "Relaciona cada hora con su representación en el reloj",
                  pares: [
                    { id: "1", termino: "3:30", definicion: "Tres y media" },
                    { id: "2", termino: "12:30", definicion: "Doce y media" },
                    { id: "3", termino: "6:30", definicion: "Seis y media" },
                    { id: "4", termino: "9:30", definicion: "Nueve y media" }
                  ]
                }
              }
            }
          ]
        },
        {
          id: 5,
          titulo: "Dinero",
          descripcion: "Aprende sobre el dinero",
          orden: 5,
          progreso: 0,
          ejercicios: [
            {
              id: "EJ021",
              titulo: "Monedas Básicas",
              descripcion: "Identifica las monedas",
              tipo: "terminos_pareados",
              dificultad: "Fácil",
              experienciaTotal: 100,
              estado: {
                completado: false,
                intentos: 0,
                bloqueado: false
              },
              contenido: {
                terminosPareados: {
                  instruccion: "Relaciona cada moneda con su valor",
                  pares: [
                    { id: "1", termino: "Moneda de 1 peso", definicion: "$1" },
                    { id: "2", termino: "Moneda de 5 pesos", definicion: "$5" },
                    { id: "3", termino: "Moneda de 10 pesos", definicion: "$10" },
                    { id: "4", termino: "Moneda de 50 pesos", definicion: "$50" }
                  ]
                }
              }
            },
            {
              id: "EJ022",
              titulo: "Billetes Básicos",
              descripcion: "Identifica los billetes",
              tipo: "alternativas",
              dificultad: "Fácil",
              experienciaTotal: 100,
              estado: {
                completado: false,
                intentos: 0,
                bloqueado: false
              },
              contenido: {
                alternativas: {
                  enunciado: "¿Qué billete tiene el valor más alto?",
                  alternativas: [
                    { id: "a", texto: "Billete de $1.000", esCorrecta: true },
                    { id: "b", texto: "Billete de $500", esCorrecta: false },
                    { id: "c", texto: "Billete de $100", esCorrecta: false },
                    { id: "d", texto: "Billete de $50", esCorrecta: false }
                  ]
                }
              }
            },
            {
              id: "EJ023",
              titulo: "Contar Monedas",
              descripcion: "Suma valores de monedas",
              tipo: "desarrollo",
              dificultad: "Media",
              experienciaTotal: 150,
              estado: {
                completado: false,
                intentos: 0,
                bloqueado: false
              },
              contenido: {
                desarrollo: {
                  enunciado: "Si tienes 2 monedas de $5 y 1 moneda de $10, ¿cuánto dinero tienes en total?",
                  respuestaCorrecta: "$20 en total",
                  palabrasClave: ["20", "veinte", "pesos", "total"],
                  porcentajeCoincidencia: 70
                }
              }
            },
            {
              id: "EJ024",
              titulo: "Compras Simples",
              descripcion: "Calcula precios básicos",
              tipo: "terminos_pareados",
              dificultad: "Media",
              experienciaTotal: 150,
              estado: {
                completado: false,
                intentos: 0,
                bloqueado: false
              },
              contenido: {
                terminosPareados: {
                  instruccion: "Relaciona cada producto con su precio",
                  pares: [
                    { id: "1", termino: "Pan", definicion: "$1.000" },
                    { id: "2", termino: "Leche", definicion: "$2.000" },
                    { id: "3", termino: "Huevos", definicion: "$3.000" },
                    { id: "4", termino: "Arroz", definicion: "$4.000" }
                  ]
                }
              }
            },
            {
              id: "EJ025",
              titulo: "Vuelto",
              descripcion: "Calcula el cambio",
              tipo: "alternativas",
              dificultad: "Difícil",
              experienciaTotal: 200,
              estado: {
                completado: false,
                intentos: 0,
                bloqueado: false
              },
              contenido: {
                alternativas: {
                  enunciado: "Si compras algo que cuesta $3.000 y pagas con $5.000, ¿cuánto vuelto recibes?",
                  alternativas: [
                    { id: "a", texto: "$1.000", esCorrecta: false },
                    { id: "b", texto: "$2.000", esCorrecta: true },
                    { id: "c", texto: "$3.000", esCorrecta: false },
                    { id: "d", texto: "$4.000", esCorrecta: false }
                  ]
                }
              }
            }
          ]
        }
      ]
    },
    {
      id: "LENG001",
      nombre: "Lenguaje",
      progreso: 30,
      unidades: [
        // Aquí podríamos agregar las unidades de lenguaje si lo necesitas
      ]
    }
  ]
}; 