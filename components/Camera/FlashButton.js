import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { BoltIcon, BoltSlashIcon } from "react-native-heroicons/outline";

const FlashButton = ({ curFlashState, onPressFunc }) => {
  return (
    <View className="absolute right-5 top-14">
      <TouchableOpacity
        className="bg-black/25 rounded-full w-10 h-10 items-center justify-center"
        onPress={onPressFunc}
      >
        {curFlashState ? (
          <BoltSlashIcon size={25} color="white" />
        ) : (
          <BoltIcon size={25} color="white" />
        )}
      </TouchableOpacity>
    </View>
  );
};

export default FlashButton;
