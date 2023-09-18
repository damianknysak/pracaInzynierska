import "expo-dev-client";

import {AuthProvider} from "./hooks/useAuth";
import StackNavigator from "./StackNavigator";
import {NavigationContainer} from "@react-navigation/native";

export default function App() {
  return (
    <NavigationContainer>
      <AuthProvider>
        <StackNavigator></StackNavigator>
      </AuthProvider>
    </NavigationContainer>
  );
}
