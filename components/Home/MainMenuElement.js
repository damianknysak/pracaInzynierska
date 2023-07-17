import { View, Text, Image, TouchableOpacity, Animated } from "react-native";
import React from "react";

const MainMenuElement = ({
  index,
  imgURL,
  smallDesc,
  desc,
  buttonDesc,
  onButtonPress,
  scrollX,
}) => {
  const inputRange = [(index - 1) * 264, index * 264, (index + 1) * 264];
  const translateY = scrollX.interpolate({
    inputRange,
    outputRange: [0, -50, 0],
  });
  return (
    <Animated.View
      style={{ transform: [{ translateY }] }}
      className="w-64 ml-2"
    >
      <View className="flex-row mt-14">
        <View className="w-64 h-62 items-center justify-center bg-black/50 rounded-t-full">
          <Image
            className="w-60 h-60 mt-2 rounded-full"
            source={{ uri: imgURL }}
          />
        </View>
      </View>

      <View className="bg-black/50 h-52 rounded-b-full relative">
        <Text className="text-gray-500 text-center text-xs mt-3">
          {smallDesc}
        </Text>
        <Text className="text-white mx-8 text-2xl font-semibold text-center">
          {desc}
        </Text>
        <TouchableOpacity
          onPress={onButtonPress}
          className="bg-blue-200 py-2 px-5 rounded-full  absolute -bottom-2 right-1/2 translate-x-9"
        >
          <Text className="font-bold">{buttonDesc}</Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
};

export default MainMenuElement;
