import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from "react-native";
import React, {useState} from "react";
import {SafeAreaView} from "react-native-safe-area-context";
import storage from "@react-native-firebase/storage";
import firestore from "@react-native-firebase/firestore";
import auth from "@react-native-firebase/auth";
import {useEffect} from "react";
import {LinearGradient} from "expo-linear-gradient";
import {
  ArrowLeftOnRectangleIcon,
  PencilSquareIcon,
} from "react-native-heroicons/outline";
import Header from "../components/Profile/Header";
import ProfileStats from "../components/Profile/ProfileStats";
import {getInfoAboutUser} from "../utils/firebaseUtils";
import useAuth from "../hooks/useAuth";

const ProfileScreen = () => {
  const [uploading, setUploading] = useState(false);
  const [profilePic, setProfilePic] = useState("");
  const [userStats, setUserStats] = useState({});
  const [displayName, setDisplayName] = useState();
  const {signOut} = useAuth();
  const selectImage = async () => {
    try {
      var ImagePicker = require("react-native-image-picker");

      const pickedImage = await ImagePicker.launchImageLibrary({
        mediaType: "photo",
        includeBase64: false,
        maxWidth: 200,
        maxHeight: 200,
      });
      if (pickedImage.didCancel) return;

      return pickedImage.assets[0];
    } catch (error) {
      console.log(error);
    }
  };

  const uploadImage = async (uri) => {
    setUploading(true);

    try {
      const currentUserUid = auth().currentUser.uid;
      const filename = uri.substring(uri.lastIndexOf("/") + 1);
      const uploadUri = uri;

      const profilePictureRef = storage().ref(
        `UsersStorage/${currentUserUid}/profilePicture`
      );

      const {items} = await profilePictureRef.listAll();

      const deletePromises = items.map((item) => item.delete());

      await Promise.all(deletePromises);

      await storage()
        .ref(`UsersStorage/${currentUserUid}/profilePicture/${filename}`)
        .putFile(uploadUri);
      setUploading(false);
      return true;
    } catch (err) {
      console.log("Błąd podczas przesyłania zdjęcia:", err);
      return false;
    }
  };

  const getProfilePictureAsync = async () => {
    try {
      const currentUserUid = auth().currentUser.uid;
      const userInfo = await getInfoAboutUser(currentUserUid);
      setProfilePic(userInfo.profileImgUrl);
      setDisplayName(`${userInfo.firstName} ${userInfo.lastName}`);
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
    setUserStats({...userStats, imagesCount: count});
  };

  const changeProfileImage = async () => {
    try {
      const pickedImage = await selectImage();
      if (pickedImage) {
        const uploadResult = await uploadImage(pickedImage?.uri);
        if (uploadResult) {
          getProfilePictureAsync();
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getProfilePictureAsync();
    countImagesInCollection();
  }, []);
  return (
    <LinearGradient
      className="flex-1"
      start={{x: 0, y: 0}}
      end={{x: 1, y: 1}}
      colors={["#374151", "#111827"]}
    >
      <SafeAreaView>
        <View className="items-center">
          <Header />
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
            <Text className="text-white text-xl">{displayName}</Text>
          </View>
        </View>
        <ProfileStats />
        <View className="items-center m-4">
          <TouchableOpacity
            onPress={signOut}
            className="bg-black/50 items-center justify-center rounded-xl w-full flex-row space-x-2 py-3"
          >
            <ArrowLeftOnRectangleIcon color="tomato" size={35} />
            <Text className="text-white">Wyloguj</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
};

export default ProfileScreen;
