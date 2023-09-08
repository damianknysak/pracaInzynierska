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
      // className="w-24 h-24"

      style={{width: 100, height: 100}}
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
        <View style={{width: 100, height: 100}}>
          <Image
            style={{
              width: 100,
              height: 100,
            }}
            source={require("../../assets/myAssets/user-location.png")}
          />
        </View>
      )}
    </Marker>
  );
};

export default ChallengeMarkerView;
