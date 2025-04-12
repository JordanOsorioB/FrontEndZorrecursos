import { NavigationContainer } from "@react-navigation/native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Navigation from "./app/navigation/Navigation";

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer>
        <Navigation />
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}
