import React from "react";
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from "@react-navigation/drawer";
import { Alert, Text } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import HomeTeacherScreen from "../screens/HomeTeacherScreen";
import StudentsScreen from "../screens/StudentsScreen";
import ActivitiesScreen from "../screens/ActivitiesScreen";
import SettingsScreen from "../screens/SettingsScreen";

const Drawer = createDrawerNavigator();

// 🔹 Función para personalizar el contenido del Drawer
function CustomDrawerContent(props) {
  const navigation = useNavigation();

  const handleLogout = async () => {
    Alert.alert("Cerrar Sesión", "¿Seguro que quieres cerrar sesión?", [
      {
        text: "Cancelar",
        style: "cancel",
      },
      {
        text: "Cerrar sesión",
        onPress: async () => {
          await AsyncStorage.removeItem("token");
          await AsyncStorage.removeItem("userRole");
          navigation.replace("LoginDocente");
        },
        style: "destructive",
      },
    ]);
  };

  return (
    <DrawerContentScrollView {...props}>
      {/* 🔹 Renderiza las opciones del menú normalmente */}
      <DrawerItemList {...props} />

      {/* 🔹 Agregamos el botón de cerrar sesión en el Drawer */}
      <DrawerItem
        label="Cerrar Sesión"
        onPress={handleLogout}
        labelStyle={{ color: "purple", fontWeight: "bold" }}
      />
    </DrawerContentScrollView>
  );
}

export default function DrawerNavigator() {
  return (
    <Drawer.Navigator
      initialRouteName="Inicio"
      drawerContent={(props) => <CustomDrawerContent {...props} />} // 🔹 Personalizamos el Drawer
      screenOptions={{
        drawerStyle: { backgroundColor: "#f5f5f5", width: 250 },
        headerStyle: { backgroundColor: "#7352c4" },
        headerTintColor: "#fff",
      }}
    >
      <Drawer.Screen name="Inicio" component={HomeTeacherScreen} />
      <Drawer.Screen name="Estudiantes" component={StudentsScreen} />
      <Drawer.Screen name="Actividades" component={ActivitiesScreen} />
      <Drawer.Screen name="Configuración" component={SettingsScreen} />
    </Drawer.Navigator>
  );
}
