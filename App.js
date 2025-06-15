import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import Navigation from './app/navigation/Navigation';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider, useAuth } from './app/AuthContext';
import { useActivityTracker } from './app/hooks/useActivityTracker';

// Componente que usa el hook de tracking
const ActivityTracker = () => {
  const { sessions, totalActiveTime, currentSession } = useActivityTracker();
  const { user } = useAuth();

  // Mostrar en consola cada 10 segundos el tiempo activo si hay sesión activa
  useEffect(() => {
    if (!user) return;
    const interval = setInterval(() => {
      if (currentSession) {
        // Eliminado console.log
      }
    }, 10000); // cada 10 segundos

    return () => clearInterval(interval);
  }, [currentSession, totalActiveTime, user]);

  // Mostrar estado cuando termina/inicia sesión
  useEffect(() => {
    if (user) {
      // Eliminado console.log
    }
  }, [sessions, totalActiveTime, currentSession, user]);

  return null;
};

// Función auxiliar para formatear la duración
const formatDuration = (seconds) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;
  return `${hours}h ${minutes}m ${remainingSeconds}s`;
};

export default function App() {
  return (
    <AuthProvider>
      <SafeAreaProvider>
        <NavigationContainer>
          <ActivityTracker />
          <Navigation />
        </NavigationContainer>
      </SafeAreaProvider>
    </AuthProvider>
  );
}
