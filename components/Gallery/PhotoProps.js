import {
  View,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Text,
  ActivityIndicator,
} from "react-native";
import React from "react";
import {
  AdjustmentsVerticalIcon,
  EyeIcon,
  EyeSlashIcon,
  MapPinIcon,
} from "react-native-heroicons/outline";
import auth from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";
import { useState } from "react";

const PhotoProps = ({ item }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [thisItem, setThisItem] = useState(item);
  const [isPublicUpdating, setIsPublicUpdating] = useState(false);

  const setImageIsPublic = async (isPublic) => {
    try {
      setIsPublicUpdating(true);
      const currentUserUid = auth().currentUser.uid;
      const querySnapshot = await firestore()
        .collection("Users")
        .doc(currentUserUid)
        .collection("Images")
        .where("imgUrl", "==", item.imgUrl)
        .limit(1)
        .get();

      if (!querySnapshot.empty) {
        const doc = querySnapshot.docs[0];
        await doc.ref.update({ isPublic: isPublic });
      }
      setIsPublicUpdating(false);
      setThisItem({ ...thisItem, isPublic: isPublic });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <View className="absolute right-5 top-14 z-20">
        <TouchableOpacity
          onPress={() => setModalVisible(!modalVisible)}
          className="bg-black/50 rounded-full w-10 h-10 items-center justify-center"
        >
          <AdjustmentsVerticalIcon size={25} color="white" />
        </TouchableOpacity>
      </View>
      {modalVisible && (
        <>
          <TouchableWithoutFeedback
            onPressIn={() => {
              setModalVisible(false);
            }}
          >
            <View className="absolute w-screen h-full z-20" />
          </TouchableWithoutFeedback>
          <View className="absolute right-5 top-28 z-30 bg-black/50 max-w-xs rounded-xl">
            <View className="flex-row items-center justify-center space-x-2 p-4 ">
              <MapPinIcon
                size={20}
                color={item.address ? `lightgreen` : `red`}
              />
              <Text className="text-white">
                {item.address ? `${item.address}` : `prywatna`}
              </Text>
            </View>
            <View className="flex-row items-center justify-center space-x-2 p-4 border-t-2 border-gray-300">
              {thisItem.isPublic ? (
                <>
                  <EyeIcon size={20} color="lightgreen" />
                  <Text className="text-white">publiczne</Text>
                  <TouchableOpacity
                    onPress={() => {
                      setImageIsPublic(false);
                    }}
                    className="px-3 py-1 flex-row space-x-1 bg-red-500/75 rounded-2xl"
                  >
                    <Text className="text-white">Ukryj</Text>
                    {isPublicUpdating && (
                      <ActivityIndicator size={20} color="white" />
                    )}
                  </TouchableOpacity>
                </>
              ) : (
                <>
                  <EyeSlashIcon size={20} color="red" />
                  <Text className="text-white">prywatne</Text>
                  <TouchableOpacity
                    onPress={() => {
                      setImageIsPublic(true);
                    }}
                    className="px-3 py-1 flex-row space-x-1 bg-green-500/75 rounded-2xl"
                  >
                    <Text className="text-white">Opublikuj</Text>
                    {isPublicUpdating && (
                      <ActivityIndicator size={20} color="white" />
                    )}
                  </TouchableOpacity>
                </>
              )}
            </View>
          </View>
        </>
      )}
    </>
  );
};

export default PhotoProps;
