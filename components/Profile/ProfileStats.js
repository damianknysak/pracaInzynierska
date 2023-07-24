import { View, Text } from "react-native";
import React from "react";
import {
  FireIcon,
  PhotoIcon,
  TrophyIcon,
  UserCircleIcon,
} from "react-native-heroicons/outline";
import firestore from "@react-native-firebase/firestore";
import { useEffect } from "react";
import auth from "@react-native-firebase/auth";
import { useState } from "react";

const ProfileStats = () => {
  const [challengesCount, setChallengesCount] = useState(0);
  const [imagesCount, setImagesCount] = useState(0);
  const [friendsCount, setFriendsCount] = useState(0);

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
        <View className="bg-black/50 py-4 flex-row items-center rounded-xl justify-center space-x-2 w-5/12">
          <FireIcon size={25} color="orange" />
          <Text className="text-white">Wyzwania: {challengesCount}</Text>
        </View>
        <View className="bg-black/50 py-4 flex-row items-center rounded-xl justify-center space-x-2 w-5/12">
          <PhotoIcon size={25} color="white" />
          <Text className="text-white">Zdjęcia: {imagesCount}</Text>
        </View>
      </View>
      <View className="flex-row justify-around mt-2">
        <View className="bg-black/50 py-4 flex-row items-center rounded-xl justify-center space-x-2 w-5/12">
          <UserCircleIcon size={25} color="green" />
          <Text className="text-white">Znajomi: {friendsCount}</Text>
        </View>
        <View className="bg-black/50 py-4 flex-row items-center rounded-xl justify-center space-x-2 w-5/12">
          <TrophyIcon size={25} color="gold" />
          <Text className="text-white">Lider: 15</Text>
        </View>
      </View>
    </View>
  );
};

export default ProfileStats;
