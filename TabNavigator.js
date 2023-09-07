import {View, Text} from "react-native";
import React from "react";
import {createBottomTabNavigator} from "@react-navigation/bottom-tabs";
import {
  Cog8ToothIcon,
  FireIcon,
  HomeIcon,
  MapPinIcon,
  UserIcon,
} from "react-native-heroicons/outline";
import HomeScreen from "./screens/HomeScreen";
import MapsScreen from "./screens/MapsScreen";
import ChallengesScreen from "./screens/ChallengesScreen";
import ProfileScreen from "./screens/ProfileScreen";

const TabNavigator = () => {
  const Tab = createBottomTabNavigator();
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={({route}) => ({
        tabBarHideOnKeyboard: true,
        tabBarStyle: {
          backgroundColor: "black",
        },
        headerStyle: {backgroundColor: "#42f44b"},
        headerTintColor: "#fff",
        headerTitleStyle: {fontWeight: "bold"},
        tabBarActiveTintColor: "tomato",
        tabBarInactiveTintColor: "gray",
        tabBarLabel: ({color}) => {
          let label;
          if (route.name == "Home") {
            label = "Home";
          } else if (route.name == "Maps") {
            label = "Mapy";
          } else if (route.name == "Settings") {
            label = "Wyzwania";
          } else if (route.name == "Profile") {
            label = "Profil";
          }

          return <Text style={{fontSize: 12, color: color}}>{label}</Text>;
        },

        tabBarIcon: ({color}) => {
          if (route.name == "Home") {
            return <HomeIcon size={22} color={color} />;
          }
          if (route.name == "Maps") {
            return <MapPinIcon size={22} color={color} />;
          }
          if (route.name == "Settings") {
            return <FireIcon size={22} color={color} />;
          }
          if (route.name == "Profile") {
            return <UserIcon size={22} color={color} />;
          }
        },
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          headerShown: false,
          navigationBarColor: "transparent",
          navigationBarHidden: true,
        }}
      />
      <Tab.Screen
        name="Maps"
        component={MapsScreen}
        options={{
          headerShown: false,
          navigationBarColor: "transparent",
          navigationBarHidden: true,
        }}
      />
      <Tab.Screen
        name="Settings"
        component={ChallengesScreen}
        options={{
          headerShown: false,
          navigationBarColor: "transparent",
          navigationBarHidden: true,
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          headerShown: false,
          navigationBarColor: "transparent",
          navigationBarHidden: true,
        }}
      />
    </Tab.Navigator>
  );
};

export default TabNavigator;
