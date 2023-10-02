import {View, Text, TouchableOpacity} from "react-native";
import React from "react";
import {
  ArrowLeftIcon,
  FireIcon,
  PlusIcon,
} from "react-native-heroicons/outline";
import {useNavigation} from "@react-navigation/native";

const Header = () => {
  const navigation = useNavigation();

  return (
    <View className="w-full flex-row items-center justify-between">
      <TouchableOpacity
        onPress={() => {
          navigation.goBack();
        }}
        className="w-12 h-12 items-center justify-center bg-black/50 rounded-full"
      >
        <ArrowLeftIcon size={25} color="white" />
      </TouchableOpacity>
      <View className="flex-row space-x-2">
        <Text className="text-lg text-white">Wyzwania</Text>
        <FireIcon color={"orange"} size={30} />
      </View>
      <TouchableOpacity className="w-12 h-12 items-center justify-center bg-black/50 rounded-full">
        <PlusIcon size={25} color="white" />
      </TouchableOpacity>
    </View>
  );
};

export default Header;
