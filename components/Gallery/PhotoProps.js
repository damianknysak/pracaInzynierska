import {
  View,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Text,
  ActivityIndicator,
  Alert,
} from "react-native";
import React from "react";
import {
  AdjustmentsVerticalIcon,
  EyeIcon,
  EyeSlashIcon,
  MapPinIcon,
  TrashIcon,
} from "react-native-heroicons/outline";
import auth from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";
import { useState } from "react";
import { deleteImage } from "../../utils/imageUtils";
import CustomModal from "../Shared/CustomModal";

const PhotoProps = ({
  item,
  toastRef,
  refreshSetter = null,
  setDelete = null,
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [customModalVisible, setCustomModalVisible] = useState(false);
  const [thisItem, setThisItem] = useState(item);
  const [isPublicUpdating, setIsPublicUpdating] = useState(false);
  // const handleDelete = () => {
  //   Alert.alert("Galeria", "Czy jesteś pewny, że chcesz usunąć to zdjęcie ?", [
  //     {
  //       text: "Tak",
  //       onPress: () => {
  //         deleteImage(item.imgUrl, toastRef);
  //         refreshSetter && refreshSetter(true);
  //         setDelete != null && setDelete(true);
  //       },
  //     },
  //     {
  //       text: "Nie",
  //       onPress: () => {
  //         console.log("Nie pressed");
  //       },
  //     },
  //   ]);
  // };
  const handleClose = () => {
    setCustomModalVisible(false);
  };

  const handleDelete = () => {
    deleteImage(item.imgUrl, toastRef);
    refreshSetter && refreshSetter(true);
    setDelete != null && setDelete(true);
  };
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
      <CustomModal
        visible={customModalVisible}
        options={{ type: "slide", from: "bottom" }}
        duration={300}
        onClose={handleClose}
        onConfirm={handleDelete}
        topic="Usuń zdjęcie"
        description="Czy jesteś pewien, że chcesz usunąć to zdjęcie ?"
      />
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
          <View className="absolute right-5 top-28 z-30 bg-black/75 max-w-xs rounded-xl">
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
            <View className="items-center justify-center border-t-2 border-gray-300">
              <TouchableOpacity
                onPress={
                  // handleDelete
                  () => {
                    setCustomModalVisible(true);
                  }
                }
                className="items-center justify-center flex-row bg-red-600 px-3 py-2 space-x-2 my-4 rounded-full"
              >
                <Text className="text-white font-bold">Usuń zdjęcie</Text>
                <TrashIcon size={20} color="white" />
              </TouchableOpacity>
            </View>
          </View>
        </>
      )}
    </>
  );
};

export default PhotoProps;
