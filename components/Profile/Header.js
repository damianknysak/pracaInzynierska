import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { ArrowLeftIcon, QrCodeIcon } from "react-native-heroicons/outline";
import { useNavigation } from "@react-navigation/native";

const Header = () => {
  const navigation = useNavigation();

  return (
    <View className="w-full flex-row items-center justify-between p-4">
      <TouchableOpacity
        onPress={() => {
          navigation.goBack();
        }}
        className="w-12 h-12 items-center justify-center bg-black/50 rounded-full"
      >
        <ArrowLeftIcon size={25} color="white" />
      </TouchableOpacity>
      <Text className="text-lg text-white">Twój profil</Text>
      <TouchableOpacity className="w-12 h-12 items-center justify-center bg-black/50 rounded-full">
        <QrCodeIcon size={25} color="white" />
      </TouchableOpacity>
    </View>
  );
};

export default Header;
