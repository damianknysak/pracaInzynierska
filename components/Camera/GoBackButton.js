import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { ArrowLeftIcon } from "react-native-heroicons/outline";

const GoBackButton = ({ onPressFunc }) => {
  return (
    <TouchableOpacity
      onPress={onPressFunc}
      className="z-10 absolute left-5 top-10 bg-black/25 rounded-full w-14 h-14 items-center justify-center"
    >
      <ArrowLeftIcon size={30} color="white" />
    </TouchableOpacity>
  );
};

export default GoBackButton;
