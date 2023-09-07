import {StyleSheet, Text, View, TouchableWithoutFeedback} from "react-native";
import React, {useRef} from "react";
import {GestureHandlerRootView} from "react-native-gesture-handler";
import Toast from "../components/Shared/CustomToast";
import {useState} from "react";
import {LinearGradient} from "expo-linear-gradient";
import {SafeAreaView} from "react-native-safe-area-context";
import Header from "../components/Challenges/Header";
import YourChallenges from "../components/Challenges/YourChallenges";
import FriendsChallenges from "../components/Challenges/FriendsChallenges";
const ChallengesScreen = () => {
  const toastRef = useRef();

  return (
    <GestureHandlerRootView className="flex-1">
      <LinearGradient
        className="flex-1"
        start={{x: 0, y: 0}}
        end={{x: 1, y: 1}}
        colors={["#374151", "#111827"]}
      >
        <SafeAreaView className="p-4">
          <Toast ref={toastRef} />
          <Header />
          <YourChallenges />
          <FriendsChallenges />
        </SafeAreaView>
      </LinearGradient>
    </GestureHandlerRootView>
  );
};

export default ChallengesScreen;
