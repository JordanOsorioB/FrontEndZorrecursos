export const UNIT_COLORS = {
  1: {
    primary: '#FF69B4',    // Rosa
    secondary: '#FFB6C1',
    background: '#FFF0F5',
    name: 'Rosa',
    description: 'Para conceptos básicos y fundamentos'
  },
  2: {
    primary: '#FF4444',    // Rojo
    secondary: '#FF6B6B',
    background: '#FFE5E5',
    name: 'Rojo',
    description: 'Para geometría y formas'
  },
  3: {
    primary: '#8E44AD',    // Morado
    secondary: '#9B59B6',
    background: '#F5E6FA',
    name: 'Morado',
    description: 'Para medición y comparaciones'
  },
  4: {
    primary: '#3498DB',    // Azul
    secondary: '#5DADE2',
    background: '#EBF5FB',
    name: 'Azul',
    description: 'Para tiempo y calendario'
  },
  5: {
    primary: '#2ECC71',    // Verde
    secondary: '#58D68D',
    background: '#E8F8F5',
    name: 'Verde',
    description: 'Para dinero y valores'
  },
  6: {
    primary: '#F1C40F',    // Amarillo
    secondary: '#F4D03F',
    background: '#FEF9E7',
    name: 'Amarillo',
    description: 'Para fracciones y decimales'
  },
  7: {
    primary: '#E67E22',    // Naranja
    secondary: '#F39C12',
    background: '#FDF2E9',
    name: 'Naranja',
    description: 'Para multiplicación y división'
  },
  8: {
    primary: '#16A085',    // Verde Azulado
    secondary: '#1ABC9C',
    background: '#E8F6F3',
    name: 'Turquesa',
    description: 'Para estadística básica'
  },
  9: {
    primary: '#9B59B6',    // Violeta
    secondary: '#BB8FCE',
    background: '#F4ECF7',
    name: 'Violeta',
    description: 'Para resolución de problemas'
  },
  10: {
    primary: '#2980B9',    // Azul Oscuro
    secondary: '#3498DB',
    background: '#EBF5FB',
    name: 'Azul Marino',
    description: 'Para repaso y evaluación final'
  }
};

// Función para obtener el color de una unidad
export const getUnitColors = (unitNumber) => {
  return UNIT_COLORS[unitNumber] || UNIT_COLORS[1];
};

// Función para obtener el siguiente color (útil para animaciones o transiciones)
export const getNextUnitColors = (currentUnit) => {
  const nextUnit = currentUnit + 1;
  return nextUnit <= 10 ? UNIT_COLORS[nextUnit] : UNIT_COLORS[1];
};

// Paleta completa para referencia
export const COLOR_PALETTE = {
  primary: '#321c69',      // Color principal de la app
  secondary: '#6b48ff',    // Color secundario
  accent: '#ffd700',       // Color de acento (dorado para logros)
  background: '#f5f5f5',   // Fondo general
  text: {
    primary: '#333333',    // Texto principal
    secondary: '#666666',   // Texto secundario
    disabled: '#9E9E9E'    // Texto deshabilitado
  },
  status: {
    success: '#4CAF50',    // Verde para éxito
    warning: '#FFC107',    // Amarillo para advertencia
    error: '#F44336',      // Rojo para error
    info: '#2196F3'        // Azul para información
  }
}; 