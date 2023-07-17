import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import storage from "@react-native-firebase/storage";
import firestore from "@react-native-firebase/firestore";
import auth from "@react-native-firebase/auth";
import { useEffect } from "react";
import { LinearGradient } from "expo-linear-gradient";
import {
  AdjustmentsVerticalIcon,
  ArrowLeftIcon,
  PencilSquareIcon,
} from "react-native-heroicons/outline";
import useAuth from "../hooks/useAuth";
import { useNavigation } from "@react-navigation/native";

const ProfileScreen = () => {
  const [uploading, setUploading] = useState(false);
  const [profilePic, setProfilePic] = useState("");
  const [userStats, setUserStats] = useState({});

  const { user } = useAuth();
  const navigation = useNavigation();

  const selectImage = async () => {
    try {
      console.log("selectImage start");

      var ImagePicker = require("react-native-image-picker");

      const pickedImage = await ImagePicker.launchImageLibrary({
        mediaType: "photo",
        includeBase64: false,
        maxWidth: 200,
        maxHeight: 200,
      });
      console.log("selectImage end");

      if (pickedImage.didCancel) return;
      return pickedImage.assets[0];
    } catch (error) {
      console.log(error);
    }
  };

  const uploadImage = async (uri) => {
    console.log("uploadImage start");
    setUploading(true);

    try {
      const currentUserUid = auth().currentUser.uid;
      const filename = uri.substring(uri.lastIndexOf("/") + 1);
      const uploadUri = uri;

      const profilePictureRef = storage().ref(
        `UsersStorage/${currentUserUid}/profilePicture`
      );

      const { items } = await profilePictureRef.listAll();

      const deletePromises = items.map((item) => item.delete());

      await Promise.all(deletePromises);

      await storage()
        .ref(`UsersStorage/${currentUserUid}/profilePicture/${filename}`)
        .putFile(uploadUri);
      console.log("Zdjęcie zostało przesłane pomyślnie");
      setUploading(false);
      console.log("uploadImage end");
      return true;
    } catch (err) {
      console.log("Błąd podczas przesyłania zdjęcia:", err);
      return false;
    }
  };

  const getProfilePicture = async () => {
    try {
      console.log(`getProfilePicture start`);
      const currentUserUid = auth().currentUser.uid;
      const profilePictureRef = storage().ref(
        `UsersStorage/${currentUserUid}/profilePicture`
      );
      const { items } = await profilePictureRef.list({ maxResults: 1 });
      if (items.length > 0) {
        const profileImageRef = items[0];
        setProfilePic(await profileImageRef.getDownloadURL());
      } else {
        const defaultImageRef = storage().ref(`DefaultMedia/default_user.png`);
        setProfilePic(await defaultImageRef.getDownloadURL());
      }
      console.log(`getProfilePicture end`);
    } catch (error) {
      console.log(error);
    }
  };

  const countImagesInCollection = async () => {
    const currentUserUid = auth().currentUser.uid;

    const querySnapshot = await firestore()
      .collection("Users")
      .doc(currentUserUid)
      .collection("Images")
      .get();

    const count = querySnapshot.size;
    setUserStats({ ...userStats, imagesCount: count });
  };

  const changeProfileImage = async () => {
    try {
      const pickedImage = await selectImage();
      if (pickedImage) {
        const uploadResult = await uploadImage(pickedImage?.uri);
        if (uploadResult) {
          await getProfilePicture();
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getProfilePicture();
    countImagesInCollection();
  }, []);
  return (
    <LinearGradient
      className="flex-1"
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      colors={["#374151", "#111827"]}
    >
      <SafeAreaView>
        <View className="items-center">
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
              <AdjustmentsVerticalIcon size={25} color="white" />
            </TouchableOpacity>
          </View>
          <View className="relative w-28 h-28 p-1 items-center justify-center rounded-full">
            {uploading && (
              <View className="absolute z-10">
                <ActivityIndicator size={40} color="white" />
              </View>
            )}
            {profilePic && (
              <Image
                style={{
                  borderColor: "gray",
                  borderWidth: 4,
                  borderRadius: 75,
                }}
                className="w-28 h-28 rounded-full"
                source={{
                  uri: profilePic,
                }}
              />
            )}

            <TouchableOpacity
              onPress={changeProfileImage}
              className="absolute right-0 bottom-0 bg-gray-500 p-2 rounded-full"
            >
              <PencilSquareIcon size={15} color="lightgray" />
            </TouchableOpacity>
          </View>
          <View className="mt-4">
            <Text className="text-white text-xl">{user.displayName}</Text>
          </View>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
};

export default ProfileScreen;
