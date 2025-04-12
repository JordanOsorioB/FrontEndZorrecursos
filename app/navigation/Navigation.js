import { createStackNavigator } from "@react-navigation/stack";
import SeleccionCursoScreen from "../screens/SeleccionCursoScreen";
import LoginDocenteScreen from "../screens/LoginDocenteScreen";
import RegistroEstablecimientoScreen from "../screens/RegistroEstablecimientoScreen";
import DrawerNavigator from "./DrawerNavigator"; // ✅ Importamos el DrawerNavigator correctamente

const Stack = createStackNavigator();

export default function Navigation() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="SeleccionCurso"
        component={SeleccionCursoScreen}
        options={{ title: "Bienvenido" }}
      />
      <Stack.Screen
        name="LoginDocente"
        component={LoginDocenteScreen}
        options={{ title: "Iniciar Sesión" }}
      />
      <Stack.Screen
        name="RegistroEstablecimiento"
        component={RegistroEstablecimientoScreen}
        options={{ title: "Registro de Curso" }}
      />
      <Stack.Screen
        name="DrawerNavigator" 
        component={DrawerNavigator}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}
