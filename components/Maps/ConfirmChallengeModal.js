import {
  View,
  Text,
  TouchableWithoutFeedback,
  TouchableOpacity,
} from "react-native";
import React, { useState } from "react";
import { ArrowTrendingUpIcon, MapIcon } from "react-native-heroicons/outline";

const ConfirmChallengeModal = ({
  isActive,
  setIsActive,
  googleMapRoutePress,
  geodesicRoutePress,
}) => {
  return (
    <>
      {isActive && (
        <>
          <View className="absolute z-30 h-40 left-2 right-2 rounded-xl top-1/2 bg-black/75">
            <Text className="text-center text-white text-xs my-2">
              Po wybraniu rodzaju trasy wyzwanie zostanie stworzone
            </Text>
            <View className="flex-1 justify-around">
              <TouchableOpacity
                onPress={googleMapRoutePress}
                className="bg-white flex-row justify-center space-x-2 items-center mx-3 py-3 rounded-xl border border-black"
              >
                <MapIcon size={25} color="black" />
                <Text className="text-center">
                  Trasa wyzwania z Google Maps
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={geodesicRoutePress}
                className="bg-white flex-row justify-center space-x-2 items-center mx-3 py-3 rounded-xl border border-black"
              >
                <ArrowTrendingUpIcon size={25} color="black" />
                <Text className="text-center">Trasa niestandardowa</Text>
              </TouchableOpacity>
            </View>
          </View>
          <TouchableWithoutFeedback
            onPressIn={() => {
              setIsActive(false);
            }}
          >
            <View className="absolute w-screen h-full z-20" />
          </TouchableWithoutFeedback>
        </>
      )}
    </>
  );
};

export default ConfirmChallengeModal;
