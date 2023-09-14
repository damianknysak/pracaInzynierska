import {View, Text, TouchableOpacity, Image} from "react-native";
import React, {useState} from "react";
import {Marker} from "react-native-maps";
import {FireIcon} from "react-native-heroicons/outline";
import UserLocationIcon from "../../assets/myAssets/user-location.png";

const ChallengeMarkerView = ({
  pinPosition,
  setPinPosition,
  color,
  draggable,
  type,
}) => {
  return (
    <Marker
      // className="w-24 h-24"
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
      {type && type == "user" && (
        <View style={{width: 50, height: 50}}>
          <Image
            style={{
              width: 50,
              height: 50,
            }}
            source={UserLocationIcon}
          />
        </View>
      )}
    </Marker>
  );
};

export default ChallengeMarkerView;
