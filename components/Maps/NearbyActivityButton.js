import {Text, TouchableOpacity} from "react-native";
import React from "react";
import {UserGroupIcon} from "react-native-heroicons/outline";

const NearbyActivityButton = ({nearbyActivity, setNearbyActivity}) => {
  return (
    <TouchableOpacity
      onPress={() => {
        setNearbyActivity(!nearbyActivity);
      }}
      className="w-20 h-20 items-center justify-center rounded-full bg-black/75 absolute z-10 right-5 top-36"
    >
      <UserGroupIcon size={30} color={nearbyActivity ? "lightgreen" : "red"} />
      <Text className="text-xs text-white text-center">
        Aktywność w pobliżu
      </Text>
    </TouchableOpacity>
  );
};

export default NearbyActivityButton;
