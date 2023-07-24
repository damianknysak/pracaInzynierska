import { View, Text, Image, StyleSheet } from "react-native";
import React, { useEffect, useState } from "react";
import auth from "@react-native-firebase/auth";
import storage from "@react-native-firebase/storage";
import PhotoProps from "../Gallery/PhotoProps";
import { PhotoIcon } from "react-native-heroicons/outline";
import moment from "moment";
import "moment/locale/pl";
const ImageView = ({ item }) => {
  const [imgUrl, setImgUrl] = useState();

  const imgURLToDownloadURL = async (img) => {
    const currentUserUid = auth().currentUser.uid;
    const reference = storage().ref(
      `UsersStorage/${currentUserUid}/cameraImages/${img}`
    );
    return await reference.getDownloadURL();
  };

  useEffect(() => {
    const getUserImages = async () => {
      try {
        if (item.imgUrl) {
          const newURL = await imgURLToDownloadURL(item.imgUrl);
          setImgUrl(newURL);
          const dateTimeAgo = moment(item.date.toDate()).fromNow();
        }
      } catch (error) {
        console.log(error);
      }
    };
    getUserImages();
  }, []);

  return (
    <View className="items-center bg-black/50 rounded-xl my-2">
      <View className="flex-row space-x-1 items-center justify-center my-2 ">
        <PhotoIcon size={25} color="white" />
        <Text className="text-white">
          Dodałeś zdjęcie {moment(item.date.toDate()).fromNow()}
        </Text>
      </View>
      <PhotoProps item={item} />
      {imgUrl ? (
        <Image className="w-full aspect-square" source={{ uri: imgUrl }} />
      ) : (
        <View className="w-full aspect-square bg-black/50 rounded"></View>
      )}
    </View>
  );
};

export default ImageView;
