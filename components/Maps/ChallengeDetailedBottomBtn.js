import {View, Text, TouchableOpacity, Image} from "react-native";
import React, {useEffect, useState} from "react";
import {useNavigation, useRoute} from "@react-navigation/native";
import {LinearGradient} from "expo-linear-gradient";
import {FireIcon} from "react-native-heroicons/outline";

const ChallengeDetailedBottomBtn = ({
  challengeStarted,
  setChallengeStarted,
  isChallengeReadyToStart,
}) => {
  const navigation = useNavigation();

  const handleDelete = () => {
    setChallengeStarted(false);
  };

  return (
    <View className="items-center">
      {!challengeStarted ? (
        <TouchableOpacity
          onPress={() => {
            setChallengeStarted(true);
          }}
          disabled={!isChallengeReadyToStart}
          className={`flex-row items-center space-x-2 absolute bottom-6 rounded-xl p-4 border-2 ${
            isChallengeReadyToStart
              ? "bg-black border-gray-500"
              : "bg-gray-500 border-black"
          } `}
        >
          <Text className="text-white text-lg font-bold">Rozpocznij</Text>
          <FireIcon size={30} color="orange" />
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          onPress={() => {
            navigation.navigate("CustomDialog", {
              handleDelete,
              topic: "Porzuć wyzwanie",
              description: "Czy jesteś pewien, że chcesz porzucić to wyzwanie?",
            });
          }}
          className={`flex-row items-center space-x-2 absolute bottom-6 rounded-xl p-4 border-2 bg-black border-gray-500`}
        >
          <Text className="text-white text-lg font-bold">Porzuć wyzwanie</Text>
          <FireIcon size={30} color="orange" />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default ChallengeDetailedBottomBtn;
