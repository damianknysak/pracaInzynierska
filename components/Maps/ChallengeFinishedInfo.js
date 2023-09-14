import {View, Text, TouchableOpacity} from "react-native";
import React, {useEffect, useRef} from "react";
import {
  CakeIcon,
  ShareIcon,
  TrashIcon,
  TrophyIcon,
} from "react-native-heroicons/outline";
import ChallengeFishedStatsGrid from "./ChallengeFishedStatsGrid";
import {
  addResultToChallengeLeaderboard,
  getChallengesLeaderboard,
} from "../../utils/challengeUtils";
import {timeObjectToSeconds} from "../../utils/timeUtils";
import Toast from "../Shared/CustomToast";
import {GestureHandlerRootView} from "react-native-gesture-handler";

const ChallengeFinishedInfo = ({challenge, time, resetChallenge, toastRef}) => {
  const getChallengesLeaderboardAsync = async () => {
    await getChallengesLeaderboard(challenge.id);
  };
  useEffect(() => {
    getChallengesLeaderboardAsync();
  }, []);

  return (
    <View className="absolute mt-20 items-center z-10 overflow-hidden w-full h-full bg-black/75 rounded-t-3xl space-y-5">
      <Toast ref={toastRef} />
      <View className="items-center space-x-2 bg-black py-2 w-full">
        <CakeIcon size={40} color="gold" />
        <Text className="text-white text-lg font-bold tracking-wider">
          Ukończyłeś wyzwanie!
        </Text>
      </View>

      <ChallengeFishedStatsGrid time={time} />

      <View className="absolute bottom-28 space-y-5">
        <TouchableOpacity
          onPress={resetChallenge}
          className="flex-row justify-between items-center space-x-2 p-3 bg-white rounded-xl"
        >
          <Text className="text-lg font-bold tracking-wider">Usuń wynik</Text>
          <TrashIcon color="red" size={40} />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            addResultToChallengeLeaderboard(
              challenge.id,
              timeObjectToSeconds(time),
              toastRef
            );
          }}
          className="flex-row items-center space-x-2 p-3 bg-black rounded-xl"
        >
          <Text className="text-white text-lg font-bold tracking-wider">
            Publikuj wynik
          </Text>
          <ShareIcon color="gold" size={40} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ChallengeFinishedInfo;
