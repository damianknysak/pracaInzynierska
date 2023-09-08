import {
  StyleSheet,
  Text,
  View,
  TouchableWithoutFeedback,
  ScrollView,
  RefreshControl,
} from "react-native";
import React, {useEffect, useRef} from "react";
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
  const [refreshing, setRefreshing] = React.useState(false);
  const onRefresh = () => {
    setRefreshing(true);
  };

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
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{paddingBottom: 100}}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
          >
            <YourChallenges
              toastRef={toastRef}
              refresh={refreshing}
              setRefresh={setRefreshing}
            />
            <FriendsChallenges
              refresh={refreshing}
              setRefresh={setRefreshing}
            />
          </ScrollView>
        </SafeAreaView>
      </LinearGradient>
    </GestureHandlerRootView>
  );
};

export default ChallengesScreen;
