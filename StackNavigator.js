import { View, Text } from "react-native";
import React from "react";
import useAuth from "./hooks/useAuth";
import HomeScreen from "./screens/HomeScreen";
import LoginScreen from "./screens/LoginScreen";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import RegisterScreen from "./screens/RegisterScreen";
import NotificationScreen from "./screens/NotificationScreen";
import AddFriendScreen from "./screens/AddFriendScreen";
import MapsScreen from "./screens/MapsScreen";
import SettingsScreen from "./screens/SettingsScreen";
import ProfileScreen from "./screens/ProfileScreen";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { HomeIcon } from "react-native-heroicons/solid";
import {
  Cog8ToothIcon,
  MapPinIcon,
  UserIcon,
} from "react-native-heroicons/outline";
import TabNavigator from "./TabNavigator";
import CameraScreen from "./screens/CameraScreen";
import GalleryScreen from "./screens/GalleryScreen";
import { NotificationProvider } from "./hooks/useNotification";
import { HomeActivityProvider } from "./hooks/useHomeActivity";
import CustomDialogScreen from "./screens/CustomDialogScreen";

const Stack = createNativeStackNavigator();

const StackNavigator = () => {
  const { user } = useAuth();

  return (
    <>
      {user ? (
        <HomeActivityProvider>
          <NotificationProvider>
            <Stack.Navigator>
              <Stack.Screen
                name="TabNavigator"
                component={TabNavigator}
                options={{
                  headerShown: false,
                }}
              />
              <Stack.Screen
                name="Notification"
                component={NotificationScreen}
                options={{
                  presentation: "containedTransparentModal",
                  headerShown: false,
                }}
              />
              <Stack.Screen
                name="CustomDialog"
                component={CustomDialogScreen}
                options={{
                  presentation: "containedTransparentModal",
                  headerShown: false,
                }}
              />
              <Stack.Screen
                name="AddFriend"
                component={AddFriendScreen}
                options={{
                  presentation: "containedTransparentModal",
                  headerShown: false,
                }}
              />
              <Stack.Screen
                name="Camera"
                component={CameraScreen}
                options={{
                  headerShown: false,
                  navigationBarColor: "transparent",
                  navigationBarHidden: true,
                }}
              />
              <Stack.Screen
                name="Gallery"
                component={GalleryScreen}
                options={{
                  headerShown: false,
                  navigationBarColor: "transparent",
                  navigationBarHidden: true,
                }}
              />
            </Stack.Navigator>
          </NotificationProvider>
        </HomeActivityProvider>
      ) : (
        <>
          <Stack.Navigator initialRouteName="Login">
            <Stack.Screen
              name="Login"
              component={LoginScreen}
              options={{
                headerShown: false,
                navigationBarColor: "transparent",
                navigationBarHidden: true,
              }}
            />
            <Stack.Screen
              name="Register"
              component={RegisterScreen}
              options={{
                headerShown: false,
                navigationBarColor: "transparent",
                navigationBarHidden: true,
              }}
            />
          </Stack.Navigator>
        </>
      )}
    </>
  );
};

export default StackNavigator;
