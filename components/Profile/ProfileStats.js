import {View, Text, TouchableOpacity} from "react-native";
import React from "react";
import {
  FireIcon,
  PhotoIcon,
  TrophyIcon,
  UserCircleIcon,
} from "react-native-heroicons/outline";
import firestore from "@react-native-firebase/firestore";
import {useEffect} from "react";
import auth from "@react-native-firebase/auth";
import {useState} from "react";
import {useNavigation} from "@react-navigation/native";

const ProfileStats = () => {
  const [challengesCount, setChallengesCount] = useState(0);
  const [imagesCount, setImagesCount] = useState(0);
  const [friendsCount, setFriendsCount] = useState(0);
  const navigation = useNavigation();
  const countChallenges = async () => {
    try {
      const querySnapshot = await firestore()
        .collection("Challenges")
        .where("creatorId", "==", auth().currentUser.uid)
        .get();

      const numberOfChallenges = querySnapshot.size;
      setChallengesCount(numberOfChallenges);
    } catch (e) {
      console.log(`Cant download challenges count ${e}`);
    }
  };
  const countImages = async () => {
    try {
      const querySnapshot = await firestore()
        .collection("Users")
        .doc(auth().currentUser.uid)
        .collection("Images")
        .get();

      const numberOfImages = querySnapshot.size;
      setImagesCount(numberOfImages);
    } catch (e) {
      console.log(`Cant download Images count ${e}`);
    }
  };

  const countFriends = async () => {
    try {
      const querySnapshot = await firestore()
        .collection("Users")
        .doc(auth().currentUser.uid)
        .collection("Friends")
        .get();

      const numberOfFriends = querySnapshot.size;
      setFriendsCount(numberOfFriends);
    } catch (e) {
      console.log(`Cant download Friends count ${e}`);
    }
  };

  useEffect(() => {
    countChallenges();
    countImages();
    countFriends();
  }, []);
  return (
    <View>
      <View className="flex-row justify-around mt-4">
        <TouchableOpacity
          onPress={() => {
            navigation.navigate("ProfileList", {type: "challenges"});
          }}
          className="bg-black/50 py-4 flex-row items-center rounded-xl justify-center space-x-2 w-5/12"
        >
          <FireIcon size={25} color="orange" />
          <Text className="text-white">Wyzwania: {challengesCount}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          // onPress={() => {
          //   navigation.navigate("Gallery");
          // }}
          className="bg-black/50 py-4 flex-row items-center rounded-xl justify-center space-x-2 w-5/12"
        >
          <PhotoIcon size={25} color="white" />
          <Text className="text-white">Zdjęcia: {imagesCount}</Text>
        </TouchableOpacity>
      </View>
      <View className="flex-row justify-around mt-2">
        <TouchableOpacity
          onPress={() => {
            navigation.navigate("ProfileList", {type: "friends"});
          }}
          className="bg-black/50 py-4 flex-row items-center rounded-xl justify-center space-x-2 w-5/12"
        >
          <UserCircleIcon size={25} color="green" />
          <Text className="text-white">Znajomi: {friendsCount}</Text>
        </TouchableOpacity>
        <TouchableOpacity className="bg-black/50 py-4 flex-row items-center rounded-xl justify-center space-x-2 w-5/12">
          <TrophyIcon size={25} color="gold" />
          <Text className="text-white">Lider: 15</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ProfileStats;
