import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { PhotoIcon } from "react-native-heroicons/outline";
import { useNavigation } from "@react-navigation/native";

const GalleryButton = () => {
  const navigation = useNavigation();
  return (
    <View className="absolute right-5 bottom-12">
      <TouchableOpacity
        onPress={() => {
          navigation.navigate("Gallery");
        }}
        className="bg-black/25 rounded-full w-14 h-14 items-center justify-center"
      >
        <PhotoIcon size={30} color="white" />
      </TouchableOpacity>
    </View>
  );
};

export default GalleryButton;
