import API_BASE_URL from '../../config';
import { getToken } from './authService';

export async function getStudentFullData(studentId) {
  const token = await getToken();
  const response = await fetch(`${API_BASE_URL}/api/students/${studentId}/full`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    throw new Error('Error obteniendo datos del estudiante');
  }
  return await response.json();
}

export async function getStudyMaterialsForStudent(studentId) {
  const token = await getToken();
  const response = await fetch(`${API_BASE_URL}/api/students/${studentId}/study-materials`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  if (!response.ok) throw new Error('Error obteniendo materiales de estudio');
  return await response.json();
}

export async function addExperienceAndLevel({ studentId, experienciaGanada }) {
  const token = await getToken();
  const response = await fetch(`${API_BASE_URL}/api/students/add-experience`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ studentId, experienciaGanada })
  });
  if (!response.ok) {
    throw new Error('Error sumando experiencia y nivel');
  }
  return await response.json();
}

export async function getLevels() {
  const token = await getToken();
  const response = await fetch(`${API_BASE_URL}/api/levels`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    throw new Error('Error obteniendo niveles');
  }
  return await response.json();
}

export async function updateStudentProfile(studentId, profileData) {
  const token = await getToken();
  const response = await fetch(`${API_BASE_URL}/api/students/${studentId}`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(profileData)
  });

  if (!response.ok) {
    throw new Error('Error al actualizar el perfil');
  }

  return await response.json();
}

export async function uploadProfilePicture(studentId, url) {
  const token = await getToken();
  const response = await fetch(`${API_BASE_URL}/api/students/upload-profile-picture`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ studentId, url })
  });

  if (!response.ok) {
    throw new Error('Error al actualizar la foto de perfil');
  }

  return await response.json();
}

export async function updateProfilePicture(studentId, profilePictureUrl) {
  const token = await getToken();
  const response = await fetch(`${API_BASE_URL}/api/students/${studentId}`, {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ profilePicture: profilePictureUrl })
  });
  if (!response.ok) {
    throw new Error('Error al actualizar la foto de perfil');
  }
  return await response.json();
} 

