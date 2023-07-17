import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import {
  EyeIcon,
  EyeSlashIcon,
  MapPinIcon,
} from "react-native-heroicons/outline";
import { useState } from "react";

const PropertySwitches = ({
  locationStatus,
  isPublic,
  onLocationPress,
  onEyePress,
}) => {
  const [isEnabled, setIsEnabled] = useState(false);
  const toggleSwitch = () => setIsEnabled((previousState) => !previousState);
  return (
    <View className="absolute top-14 right-5 space-y-3">
      <TouchableOpacity
        onPress={onLocationPress}
        className="flex-row bg-black/25 rounded-full w-10 h-10 items-center justify-center"
      >
        <MapPinIcon
          color={`${locationStatus ? "lightgreen" : "red"}`}
          size={25}
        />
      </TouchableOpacity>
      <TouchableOpacity
        onPress={onEyePress}
        className="flex-row bg-black/25 rounded-full w-10 h-10 items-center justify-center"
      >
        {isPublic ? (
          <EyeIcon color="lightgreen" size={25} />
        ) : (
          <EyeSlashIcon color="red" size={25} />
        )}
      </TouchableOpacity>
    </View>
  );
};

export default PropertySwitches;
