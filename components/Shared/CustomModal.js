import React, { useEffect, useRef } from "react";
import {
  Text,
  View,
  Dimensions,
  Animated,
  Easing,
  TouchableOpacity,
} from "react-native";
import { QuestionMarkCircleIcon } from "react-native-heroicons/outline";

export default function CustomModal({
  visible,
  options,
  duration,
  onConfirm,
  onClose,
  topic,
  description,
}) {
  const { height } = Dimensions.get("screen");
  const startPointY = options?.from === "top" ? -height : height;
  const transY = useRef(new Animated.Value(startPointY));

  useEffect(() => {
    if (visible) {
      startAnimation(0);
    } else {
      startAnimation(startPointY);
    }
  }, [visible]);

  const startAnimation = (toValue) => {
    Animated.timing(transY.current, {
      toValue,
      duration,
      easing: Easing.inOut(Easing.ease),
      useNativeDriver: true,
    }).start();
  };

  const onConfirmPress = () => {
    onConfirm();
    onClose();
  };

  const onDeclinePress = () => {
    onClose();
  };
  const generateBackgroundOpacity = () => {
    if (startPointY >= 0) {
      return transY.current.interpolate({
        inputRange: [0, startPointY],
        outputRange: [0.8, 0],
        extrapolate: "clamp",
      });
    } else {
      return transY.current.interpolate({
        inputRange: [startPointY, 0],
        outputRange: [0, 0.8],
        extrapolate: "clamp",
      });
    }
  };

  return (
    <>
      <Animated.View
        pointerEvents="none"
        className="z-40 absolute w-full h-full justify-center items-center bg-gray-700"
        style={[{ opacity: generateBackgroundOpacity() }]}
      />

      <Animated.View
        className="z-50 absolute w-full h-full justify-center items-center"
        style={[{ transform: [{ translateY: transY.current }] }]}
      >
        <View
          style={{ elevation: 10 }}
          className="w-2/3 h-2/5 bg-white rounded-xl"
        >
          <View className="relative bg-gray-200 w-full h-full rounded-xl">
            <View className=" items-center h-4/5 space-y-5 mt-4">
              <QuestionMarkCircleIcon size={60} color="gray" />
              <Text className="text-xl font-semibold">{topic}</Text>
              <Text className="w-2/3 text-center text-gray-600">
                {description}
              </Text>
            </View>
            <TouchableOpacity
              onPress={onConfirmPress}
              className="absolute items-center justify-center bg-white bottom-0 left-0 w-1/2 h-1/5 rounded-bl-xl border-r border-gray-200"
            >
              <Text className="text-xl font-semibold">Tak</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={onDeclinePress}
              className="absolute items-center justify-center bg-white bottom-0 right-0 w-1/2 h-1/5 rounded-br-xl border-l border-gray-200"
            >
              <Text className="text-gray-500 text-xl">Nie</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Animated.View>
    </>
  );
}
