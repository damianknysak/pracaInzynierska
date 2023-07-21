import { View, Text, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { Marker } from "react-native-maps";
import { FireIcon } from "react-native-heroicons/outline";

const ChallengeMarkerView = ({
  pinPosition,
  setPinPosition,
  color,
  draggable,
}) => {
  return (
    <Marker
      pinColor={color}
      draggable={draggable}
      coordinate={pinPosition}
      onDragEnd={(e) => {
        setPinPosition(e.nativeEvent.coordinate);
      }}
    />
  );
};

export default ChallengeMarkerView;
