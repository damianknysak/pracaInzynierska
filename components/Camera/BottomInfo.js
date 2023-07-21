import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { EyeIcon, MapPinIcon } from "react-native-heroicons/outline";

const BottomInfo = ({ address, locationStatus, isPublic }) => {
  return (
    <View className="absolute bottom-20 max-w-screen-sm">
      <View className="flex-row space-x-1 bg-black/25 rounded-full  p-2 items-center justify-center">
        <EyeIcon color="white" size={20} />
        <Text className="text-white text-xs text-center">
          {isPublic ? "Zdjęcie publiczne" : "Zdjęcie prywatne"}
        </Text>
      </View>
      {locationStatus && (
        <View className="flex-row space-x-1 bg-black/25 rounded-full h-10 px-5 items-center justify-center">
          <MapPinIcon color="white" size={20} />
          <Text className="text-white text-xs text-center">
            {address ? address : "OpenStreetMaps niedostępne"}
          </Text>
        </View>
      )}
    </View>
  );
};

export default BottomInfo;
