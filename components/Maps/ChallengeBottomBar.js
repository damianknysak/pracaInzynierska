import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { FlagIcon } from "react-native-heroicons/solid";

const ChallengeBottomBar = ({ onSetPress, start, finish }) => {
  return (
    <View className="justify-between absolute z-10 bottom-2 left-2 right-2 rounded-xl bg-black/75 h-20">
      <Text className="text-white text-xs text-center mt-2">
        Przeciągnij pin w miejsce gdzie chcesz ustawić{" "}
        {!finish ? "Start" : "Metę"} Wyzwania
      </Text>
      <TouchableOpacity
        onPress={onSetPress}
        className="flex-row items-center justify-center space-x-2 bg-white mb-2 mx-6 py-1 rounded-xl"
      >
        <FlagIcon size={30} color={!finish ? "orange" : "lightgreen"} />
        <Text className="font-bold">Ustaw {!finish ? "Start" : "Metę"}</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ChallengeBottomBar;
