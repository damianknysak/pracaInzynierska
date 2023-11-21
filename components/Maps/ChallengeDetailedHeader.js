import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { FireIcon, XMarkIcon } from "react-native-heroicons/outline";
import { useNavigation } from "@react-navigation/native";
import useChallengeLocation from "../../hooks/useChallengeLocation";

const ChallengeDetailedHeader = () => {
  const navigation = useNavigation();
  const handleDelete = () => {
    navigation.goBack();
  };
  return (
    <View className="absolute z-10 w-full items-center justify-between">
      <View className="bg-black/50 rounded-xl p-2 mt-5 flex-row items-center space-x-2">
        <Text className="font-bold text-white text-xl">Wyzwanie</Text>
        <FireIcon size={30} color="orange" />
      </View>
      <TouchableOpacity
        className="absolute bg-black/50 p-2 items-center justify-center rounded-full right-3 top-3"
        onPress={() => {
          navigation.navigate("CustomDialog", {
            handleDelete,
            topic: "Opuść wyzwanie",
            description:
              "Jeżeli wyjdziesz to wszystkie nieopublikowane wyniki zostaną usunięte",
          });
        }}
      >
        <XMarkIcon size={30} color="black" />
      </TouchableOpacity>
    </View>
  );
};

export default ChallengeDetailedHeader;
