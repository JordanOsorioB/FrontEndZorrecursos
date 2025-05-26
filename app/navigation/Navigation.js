import { createStackNavigator } from "@react-navigation/stack";
import SeleccionCursoScreen from "../screens/SeleccionCursoScreen";
import LoginDocenteScreen from "../screens/LoginDocenteScreen";
import RegistroEstablecimientoScreen from "../screens/RegistroEstablecimientoScreen";
import BottomTabNavigator from "./BottomTabNavigator";

const Stack = createStackNavigator();

export default function Navigation() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false
      }}
    >
      <Stack.Screen
        name="SeleccionCurso"
        component={SeleccionCursoScreen}
      />
      <Stack.Screen
        name="LoginDocente"
        component={LoginDocenteScreen}
      />
      <Stack.Screen
        name="RegistroEstablecimiento"
        component={RegistroEstablecimientoScreen}
      />
      <Stack.Screen
        name="MainApp"
        component={BottomTabNavigator}
      />
    </Stack.Navigator>
  );
}
