import { View, TouchableOpacity } from "react-native";
import React from "react";
import { TrashIcon } from "react-native-heroicons/outline";
import { deleteChallenge } from "../../utils/challengeUtils";
import { useNavigation } from "@react-navigation/native";

const ChallengeProps = ({ item, toastRef, refreshSetter }) => {
  const navigation = useNavigation();

  const handleDelete = () => {
    deleteChallenge(item, toastRef);
    refreshSetter && refreshSetter(true);
  };

  return (
    <>
      <View className="absolute right-2 top-5 z-20">
        <TouchableOpacity
          onPress={() => {
            navigation.navigate("CustomDialog", {
              handleDelete,
              topic: "Usuń wyzwanie",
              description: "Czy jesteś pewien, że chcesz usunąć to wyzwanie?",
            });
          }}
          className="bg-black/50 rounded-full w-10 h-10 items-center justify-center"
        >
          <TrashIcon size={20} color="red" />
        </TouchableOpacity>
      </View>
    </>
  );
};

export default ChallengeProps;
