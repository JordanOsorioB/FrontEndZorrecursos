import { createStackNavigator } from "@react-navigation/stack";
import BottomTabNavigator from "./BottomTabNavigator";
import CambiarContrasenaScreen from '../screens/CambiarContrasenaScreen';
import LoginScreen from '../screens/LoginScreen';
import ResponderEjercicio from '../features/ejercicios/screens/ResponderEjercicio';
import { useAuth } from '../AuthContext';

const Stack = createStackNavigator();

export default function Navigation() {
  const { token, loading } = useAuth();

  if (loading) return null;

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false
      }}
    >
      {!token ? (
        <Stack.Screen
          name="Login"
          component={LoginScreen}
        />
      ) : (
        <>
          <Stack.Screen
            name="MainApp"
            component={BottomTabNavigator}
          />
          <Stack.Screen
            name="ResponderEjercicio"
            component={ResponderEjercicio}
          />
        </>
      )}
      <Stack.Screen
        name="CambiarContrasena"
        component={CambiarContrasenaScreen}
      />
    </Stack.Navigator>
  );
}
