// Tipos de ejercicios disponibles
export const TIPOS_EJERCICIO = {
  ALTERNATIVAS: 'alternativas',
  DESARROLLO: 'desarrollo',
  TERMINOS_PAREADOS: 'terminos_pareados'
};

// DTO para ejercicio tipo alternativas
export const AlternativasDTO = {
  enunciado: String,
  alternativas: [
    {
      id: String,
      texto: String,
      esCorrecta: Boolean
    }
  ]
};

// DTO para ejercicio tipo desarrollo
export const DesarrolloDTO = {
  enunciado: String,
  respuestaCorrecta: String,
  // Palabras clave que deben estar en la respuesta
  palabrasClave: [String],
  // Porcentaje mínimo de coincidencia para considerar correcta la respuesta
  porcentajeCoincidencia: Number
};

// DTO para ejercicio tipo términos pareados
export const TerminosPareadosDTO = {
  instruccion: String,
  pares: [
    {
      id: String,
      termino: String,
      definicion: String
    }
  ]
};

// DTO para el estado de un ejercicio
export const EstadoEjercicioDTO = {
  completado: Boolean,
  intentos: Number,
  ultimoIntento: String, // fecha en formato ISO
  respuestasCorrectas: Number,
  experienciaGanada: Number,
  bloqueado: Boolean
};

// DTO para un ejercicio individual
export const EjercicioDTO = {
  id: String,
  titulo: String,
  descripcion: String,
  tipo: String, // Ver TIPOS_EJERCICIO
  dificultad: String, // 'Fácil', 'Media', 'Difícil'
  experienciaTotal: Number,
  estado: EstadoEjercicioDTO,
  // Contenido específico según el tipo de ejercicio
  contenido: {
    alternativas: AlternativasDTO,
    desarrollo: DesarrolloDTO,
    terminosPareados: TerminosPareadosDTO
  }
};

// DTO para una unidad de aprendizaje
export const UnidadDTO = {
  id: Number,
  titulo: String,
  descripcion: String,
  orden: Number,
  progreso: Number, // porcentaje de completitud
  ejercicios: [EjercicioDTO]
};

// DTO para una asignatura
export const AsignaturaDTO = {
  id: String,
  nombre: String,
  progreso: Number, // porcentaje total completado
  unidades: [UnidadDTO]
};

// DTO para el nivel y experiencia del estudiante
export const NivelDTO = {
  actual: Number,
  experiencia: {
    actual: Number,
    necesaria: Number
  }
};

// DTO principal del estudiante
export const EstudianteDTO = {
  id: String,
  nombre: String,
  curso: String,
  nivel: NivelDTO,
  asignaturas: [AsignaturaDTO]
}; 