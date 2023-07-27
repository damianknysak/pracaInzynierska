import {
  View,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Alert,
} from "react-native";
import React from "react";
import { useState } from "react";
import { TrashIcon } from "react-native-heroicons/outline";
import { deleteChallenge } from "../../utils/challengeUtils";

const ChallengeProps = ({ item, toastRef, setDelete, refreshSetter }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const handleDelete = () => {
    Alert.alert("Galeria", "Czy jesteś pewny, że chcesz usunąć to wyzwanie ?", [
      {
        text: "Tak",
        onPress: () => {
          deleteChallenge(item, toastRef);
          refreshSetter && refreshSetter(true);
          setDelete(true);
        },
      },
      {
        text: "Nie",
        onPress: () => {
          console.log("Nie pressed");
        },
      },
    ]);
  };
  return (
    <>
      <View className="absolute right-2 top-5 z-20">
        <TouchableOpacity
          onPress={handleDelete}
          className="bg-black/50 rounded-full w-10 h-10 items-center justify-center"
        >
          <TrashIcon size={20} color="red" />
        </TouchableOpacity>
      </View>
    </>
  );
};

export default ChallengeProps;
