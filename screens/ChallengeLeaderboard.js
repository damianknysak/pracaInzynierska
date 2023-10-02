import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Image,
} from "react-native";
import React, {useEffect, useState} from "react";
import {useNavigation, useRoute} from "@react-navigation/native";
import {LinearGradient} from "expo-linear-gradient";
import {
  ClockIcon,
  TrophyIcon,
  UserIcon,
  UserPlusIcon,
  XMarkIcon,
} from "react-native-heroicons/outline";
import {getChallengesLeaderboard} from "../utils/challengeUtils";
import LeaderboardCard from "../components/Leaderboard/LeaderboardCard";

const ChallengeLeaderboard = () => {
  const route = useRoute();
  const {challengeId} = route.params;
  const navigation = useNavigation();
  const [leaderboardArray, setLeaderboardArray] = useState();
  const [pending, setPending] = useState();

  const getLeaderboardAsync = async () => {
    setPending(true);
    const challenges = await getChallengesLeaderboard(challengeId);
    challenges && challenges.sort((a, b) => a.time - b.time);
    challenges && setLeaderboardArray(challenges);
    setPending(false);
  };

  useEffect(() => {
    getLeaderboardAsync();
  }, []);

  useEffect(() => {
    if (leaderboardArray) {
      leaderboardArray.forEach((element) => {
        console.log(element);
      });
    }
  }, [leaderboardArray]);

  return (
    <>
      {challengeId && (
        <View className="h-full w-screen items-center justify-center">
          <View className="relative w-5/6 mt-5 rounded-3xl h-5/6">
            <LinearGradient
              className="flex-1 rounded-3xl"
              start={{x: 0, y: 0}}
              end={{x: 1, y: 1}}
              colors={["#E5E7EB", "#9CA3AF", "#4B5563"]}
            >
              <View className="mt-4 flex-row items-center justify-center space-x-2">
                <Text className="font-bold text-center text-lg">
                  Leaderboard
                </Text>
                <TrophyIcon size={30} color="black" />
              </View>

              <TouchableOpacity
                className="absolute bg-black/50 p-1 items-center justify-center rounded-full right-3 top-3"
                onPress={() => {
                  navigation.goBack();
                }}
              >
                <XMarkIcon size={30} color="black" />
              </TouchableOpacity>

              <ScrollView className="mx-3 my-1">
                {pending && <ActivityIndicator size={30} color="white" />}
                {leaderboardArray &&
                  leaderboardArray.map((element, index) => (
                    <LeaderboardCard
                      key={index}
                      position={index + 1}
                      time={element.time}
                      userId={element.userId}
                    />
                  ))}
                {!leaderboardArray && !pending && (
                  <View className="items-center space-y-4 mt-10">
                    <Text className="text-black font-bold">
                      Jeszcze nikt nie brał udziału w wyzwaniu
                    </Text>
                    <Image
                      className="w-24 h-24"
                      source={require("../assets/myAssets/tourist_male.png")}
                    />
                  </View>
                )}
              </ScrollView>
            </LinearGradient>
          </View>
        </View>
      )}
    </>
  );
};

export default ChallengeLeaderboard;
