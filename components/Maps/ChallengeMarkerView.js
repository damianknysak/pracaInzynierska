import {View, Text, TouchableOpacity, Image} from "react-native";
import React, {useState} from "react";
import {Marker} from "react-native-maps";
import {FireIcon} from "react-native-heroicons/outline";

const ChallengeMarkerView = ({
  pinPosition,
  setPinPosition,
  color,
  draggable,
  type,
}) => {
  return (
    <Marker
      pinColor={color}
      draggable={draggable}
      coordinate={pinPosition}
      onDragEnd={(e) => {
        setPinPosition(e.nativeEvent.coordinate);
      }}
    >
      {type && type == "finish" && (
        <Image
          className="w-10 h-10"
          source={require("../../assets/myAssets/finish-line.png")}
        />
      )}
    </Marker>
  );
};

export default ChallengeMarkerView;
