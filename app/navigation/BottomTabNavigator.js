import React from 'react';
import { StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { MaterialIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

// Importar las pantallas
import ListaEjercicios from '../features/ejercicios/screens/ListaEjercicios';
import ContenidosScreen from '../features/contenidos/screens/ContenidosScreen';
import SettingsScreen from '../features/ajustes/screens/SettingsScreen';
import PerfilScreen from '../features/ajustes/screens/PerfilScreen';
import RecompensasScreen from '../features/ajustes/screens/RecompensasScreen';
import PrivacidadScreen from '../features/ajustes/screens/PrivacidadScreen';
import AyudaScreen from '../features/ajustes/screens/AyudaScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Stack de navegación para la sección de ajustes
function AjustesStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="SettingsMain" component={SettingsScreen} />
      <Stack.Screen name="Perfil" component={PerfilScreen} />
      <Stack.Screen name="Recompensas" component={RecompensasScreen} />
      <Stack.Screen name="Privacidad" component={PrivacidadScreen} />
      <Stack.Screen name="Ayuda" component={AyudaScreen} />
    </Stack.Navigator>
  );
}

export default function BottomTabNavigator() {
  return (
    <SafeAreaView style={{ flex: 1 }} edges={['bottom']}>
      <Tab.Navigator
        screenOptions={{
          tabBarStyle: styles.tabBar,
          tabBarActiveTintColor: '#321c69',
          tabBarInactiveTintColor: '#666',
          headerShown: false,
        }}
      >
        <Tab.Screen
          name="Ejercicios"
          component={ListaEjercicios}
          options={{
            tabBarIcon: ({ color, size }) => (
              <MaterialIcons name="assignment" size={size} color={color} />
            ),
            tabBarLabelStyle: styles.tabText,
          }}
        />
        <Tab.Screen
          name="Contenidos"
          component={ContenidosScreen}
          options={{
            tabBarIcon: ({ color, size }) => (
              <MaterialIcons name="book" size={size} color={color} />
            ),
            tabBarLabelStyle: styles.tabText,
          }}
        />
        <Tab.Screen
          name="Ajustes"
          component={AjustesStack}
          options={{
            tabBarIcon: ({ color, size }) => (
              <MaterialIcons name="settings" size={size} color={color} />
            ),
            tabBarLabelStyle: styles.tabText,
          }}
        />
      </Tab.Navigator>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    height: 60,
    paddingBottom: 5,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  tabText: {
    fontSize: 12,
    marginTop: 4,
  },
}); 