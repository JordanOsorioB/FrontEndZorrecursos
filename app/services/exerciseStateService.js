import API_BASE_URL from '../../config';
import { getToken } from './authService';

export async function actualizarEstadoEjercicio(stateId, data) {
  const token = await getToken();
  const response = await fetch(`${API_BASE_URL}/api/exercise-statuses/${stateId}`, {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error('Error actualizando estado del ejercicio');
  }
  return await response.json();
}

export async function buyAttemptWithCoin(studentId, exerciseStateId) {
  const token = await getToken();
  const response = await fetch(`${API_BASE_URL}/api/exercise-statuses/buy-attempt`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ studentId, exerciseStateId })
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || 'Error al comprar intento');
  }
  return data;
} 