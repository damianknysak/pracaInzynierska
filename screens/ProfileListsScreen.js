import {useNavigation, useRoute} from "@react-navigation/native";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import React, {useEffect, useState} from "react";
import {LinearGradient} from "expo-linear-gradient";
import {UserPlusIcon, XMarkIcon} from "react-native-heroicons/outline";
import {getFriendsList} from "../utils/firebaseUtils";
import FriendsList from "../components/Profile/FriendsList";
import {getChallengesList} from "../utils/challengeUtils";
import ChallengesList from "../components/Profile/ChallengesList";

const ProfileListsScreen = () => {
  const [itemsList, setItemsList] = useState();
  const navigation = useNavigation();
  const route = useRoute();
  const {type} = route.params;
  const getFriendsListAsync = async () => {
    setItemsList(await getFriendsList());
  };

  const getChallegesListAsync = async () => {
    setItemsList(await getChallengesList());
  };

  useEffect(() => {
    type == "friends" && getFriendsListAsync();
    type == "challenges" && getChallegesListAsync();
  }, []);

  return (
    <View className="h-full w-screen items-center justify-center">
      <View className="relative rounded-3xl h-4/5 w-4/5">
        <LinearGradient
          className="flex-1 rounded-3xl"
          start={{x: 0, y: 0}}
          end={{x: 1, y: 1}}
          colors={["#E5E7EB", "#9CA3AF", "#4B5563"]}
        >
          <Text className="font-bold text-center mt-4 text-lg">
            {type == "friends" ? "Lista znajomych" : "Lista wyzwań"}
          </Text>
          <TouchableOpacity
            className="absolute bg-black/50 p-1 items-center justify-center rounded-full right-3 top-3"
            onPress={() => {
              navigation.goBack();
            }}
          >
            <XMarkIcon size={30} color="black" />
          </TouchableOpacity>
          <ScrollView className="m-3">
            {itemsList ? (
              itemsList.length > 0 ? (
                type == "friends" ? (
                  <FriendsList list={itemsList} />
                ) : (
                  <ChallengesList list={itemsList} />
                )
              ) : (
                <Text>List znajomych pusta</Text>
              )
            ) : (
              <ActivityIndicator size={40} />
            )}
          </ScrollView>
        </LinearGradient>
      </View>
    </View>
  );
};

export default ProfileListsScreen;
