import API_BASE_URL from '../../config';

export const trackActivity = async (activityData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/activity/track`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(activityData),
    });

    if (!response.ok) {
      throw new Error('Error al registrar actividad');
    }

    return await response.json();
  } catch (error) {
    console.error('Error en trackActivity:', error);
    throw error;
  }
};

export const getUserActivityStats = async (userId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/activity/stats/${userId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Error al obtener estadísticas de actividad');
    }

    return await response.json();
  } catch (error) {
    console.error('Error en getUserActivityStats:', error);
    throw error;
  }
};

export const saveSessionLog = async (logData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/session-logs`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(logData),
    });
    const text = await response.text();
    if (!response.ok) throw new Error('Error al guardar log de sesión');
    return JSON.parse(text);
  } catch (error) {
    throw error;
  }
}; 