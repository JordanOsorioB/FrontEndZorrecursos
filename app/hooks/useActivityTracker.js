import { useEffect, useRef, useState } from 'react';
import { AppState } from 'react-native';
import { useAuth } from '../AuthContext';
import { saveSessionLog } from '../services/activityService';

const INACTIVITY_THRESHOLD = 60 * 1000; // 1 minuto de inactividad

export const useActivityTracker = () => {
  const { user } = useAuth();
  const lastActivityRef = useRef(Date.now());
  const sessionStartRef = useRef(Date.now());
  const isActiveRef = useRef(true);
  const [sessions, setSessions] = useState([]);
  const [totalActiveTime, setTotalActiveTime] = useState(0);

  const updateActivityStatus = async (isActive) => {
    if (isActiveRef.current === isActive) return;
    
    isActiveRef.current = isActive;
    const now = Date.now();

    if (!isActive) {
      // Usuario se volvió inactivo
      const duration = Math.floor((now - sessionStartRef.current) / 1000);
      const newSession = {
        id: Date.now(),
        startTime: new Date(sessionStartRef.current).toLocaleTimeString(),
        endTime: new Date(now).toLocaleTimeString(),
        duration: duration,
        isActive: false
      };

      setSessions(prev => [...prev, newSession]);
      setTotalActiveTime(prev => prev + duration);

      // Guardar log real en la base de datos
      if (user?.id) {
        const logData = {
          userId: user.id,
          loginAt: new Date(sessionStartRef.current).toISOString(),
          logoutAt: new Date(now).toISOString(),
          duration: duration
        };
        try {
          await saveSessionLog(logData);
        } catch (e) {
          // Manejar error si es necesario
        }
      }
    } else {
      // Usuario volvió a estar activo
      sessionStartRef.current = now;
    }
  };

  // Función auxiliar para formatear la duración
  const formatDuration = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    return `${hours}h ${minutes}m ${remainingSeconds}s`;
  };

  useEffect(() => {
    if (!user?.id) return; // No trackear si no hay usuario

    let inactivityTimer;

    const resetInactivityTimer = () => {
      if (inactivityTimer) clearTimeout(inactivityTimer);
      
      if (!isActiveRef.current) {
        updateActivityStatus(true);
      }
      
      lastActivityRef.current = Date.now();
      
      inactivityTimer = setTimeout(() => {
        updateActivityStatus(false);
      }, INACTIVITY_THRESHOLD);
    };

    // Detectar cambios en el estado de la app
    const subscription = AppState.addEventListener('change', (nextAppState) => {
      if (nextAppState === 'active') {
        resetInactivityTimer();
      } else {
        updateActivityStatus(false);
      }
    });

    resetInactivityTimer();

    return () => {
      if (inactivityTimer) clearTimeout(inactivityTimer);
      subscription.remove();
    };
  }, [user?.id]);

  // Exponer los datos para que puedan ser usados en otros componentes si es necesario
  return {
    sessions,
    totalActiveTime,
    currentSession: isActiveRef.current ? {
      startTime: new Date(sessionStartRef.current).toLocaleTimeString(),
      duration: Math.floor((Date.now() - sessionStartRef.current) / 1000)
    } : null
  };
}; 