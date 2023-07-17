import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { ArrowPathRoundedSquareIcon } from "react-native-heroicons/outline";

const SwitchCameraButton = ({ onPressFunc }) => {
  return (
    <View className="absolute left-5 top-14">
      <TouchableOpacity
        className="bg-black/25 rounded-full w-10 h-10 items-center justify-center"
        onPress={onPressFunc}
      >
        <ArrowPathRoundedSquareIcon size={25} color="white" />
      </TouchableOpacity>
    </View>
  );
};

export default SwitchCameraButton;
