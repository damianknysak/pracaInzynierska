import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { CameraIcon } from "react-native-heroicons/outline";

const TakePictureButton = ({ takePicture }) => {
  return (
    <View
      style={{
        position: "absolute",

        left: 0,
        right: 0,
        bottom: 40,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <TouchableOpacity
        onPress={takePicture}
        className=" bg-black/25 rounded-full w-20 h-20 items-center justify-center"
      >
        <CameraIcon size={40} color="white" />
      </TouchableOpacity>
    </View>
  );
};

export default TakePictureButton;
