import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import BottomTabNavigator from './app/navigation/BottomTabNavigator';
import ResponderEjercicio from './app/features/ejercicios/screens/ResponderEjercicio';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen 
          name="Main" 
          component={BottomTabNavigator} 
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="ResponderEjercicio" 
          component={ResponderEjercicio}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
