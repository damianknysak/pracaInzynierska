import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { FireIcon } from "react-native-heroicons/outline";

const ChallengeButton = ({ onChallengePress, color }) => {
  return (
    <TouchableOpacity
      onPress={onChallengePress}
      className="w-20 h-20 items-center justify-center rounded-full bg-black/75 absolute z-10 right-5 top-14"
    >
      <FireIcon size={30} color={color} />
      <Text className="text-xs text-white">Wyzwanie</Text>
    </TouchableOpacity>
  );
};

export default ChallengeButton;
