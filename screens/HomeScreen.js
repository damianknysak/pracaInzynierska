import { View, Text, ScrollView, RefreshControl } from "react-native";
import React, { useState } from "react";
import { Image, TouchableOpacity } from "react-native";
import useAuth from "../hooks/useAuth";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { LinearGradient } from "expo-linear-gradient";
import MainMenu from "../components/Home/MainMenu";
import Header from "../components/Home/Header";
import PopularPlaces from "../components/Home/PopularPlaces";
import { useNavigation } from "@react-navigation/native";
import UserActivityView from "../components/Home/UserActivityView";
import { useEffect } from "react";

const HomeScreen = () => {
  const [headerMenu, setHeaderMenu] = useState("friends");
  const { signOut, user, getCurrentUserInfoDB } = useAuth();
  const [currentUser, setCurrentUser] = useState();
  const navigation = useNavigation();
  if (!currentUser) {
    getCurrentUserInfoDB()
      .then((tego) => {
        setCurrentUser(tego);
      })
      .catch((error) => {
        setCurrentUser({ firstName: null });
        console.log(error);
      });
  }

  return (
    <View className="h-full w-screen">
      <StatusBar
        barStyle="light-content"
        translucent
        backgroundColor="transparent"
      />
      <LinearGradient
        className="flex-1"
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        colors={["#374151", "#111827"]}
      >
        <SafeAreaView className="h-screen">
          <View>
            <ScrollView
              contentContainerStyle={{
                paddingBottom: 60,
              }}
              showsVerticalScrollIndicator={false}
            >
              <Header
                headerMenu={headerMenu}
                setHeaderMenu={setHeaderMenu}
                navigation={navigation}
                userName={currentUser?.firstName}
              />
              {headerMenu == "friends" && (
                <>
                  <MainMenu />
                  <PopularPlaces />
                  <TouchableOpacity onPress={signOut}>
                    <Text className="text-yellow-400">Sign out</Text>
                  </TouchableOpacity>
                </>
              )}
            </ScrollView>
            {headerMenu == "me" && <UserActivityView />}
          </View>
        </SafeAreaView>
      </LinearGradient>
    </View>
  );
};

export default HomeScreen;
