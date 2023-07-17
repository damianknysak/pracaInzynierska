import "expo-dev-client";

import { AuthProvider } from "./hooks/useAuth";
import StackNavigator from "./StackNavigator";
import { NavigationContainer } from "@react-navigation/native";

import { createNativeStackNavigator } from "@react-navigation/native-stack";
const Stack = createNativeStackNavigator();
export default function App() {
  return (
    <NavigationContainer>
      <AuthProvider>
        <StackNavigator></StackNavigator>
      </AuthProvider>
    </NavigationContainer>
  );
}
