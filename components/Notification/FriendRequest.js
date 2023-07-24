import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import {
  CheckBadgeIcon,
  MinusCircleIcon,
  PlusCircleIcon,
  UserPlusIcon,
  XMarkIcon,
} from "react-native-heroicons/outline";
import { addUserToFriends } from "../../utils/firebaseUtils";

const FriendRequest = ({ userEmail }) => {
  return (
    <View className="bg-black/50 rounded-3xl mx-2 my-1 px-2 py-1">
      <View className="flex-row  space-x-2 items-center">
        <UserPlusIcon size={25} color="white" />
        <Text className="text-white mr-3">
          Użytkownik {userEmail} chce dodać Cię do znajomych!
        </Text>
      </View>
      <View className="flex-row py-2 justify-center space-x-8">
        <TouchableOpacity
          onPress={() => {
            addUserToFriends(userEmail);
          }}
          className="flex-row rounded items-center space-x-1 border px-1 py-2 bg-black/50"
        >
          <Text className="text-white">Akceptuj</Text>
          <CheckBadgeIcon size={25} color="green" />
        </TouchableOpacity>
        <TouchableOpacity className="flex-row rounded items-center space-x-1 border px-1 py-2 bg-black/50">
          <Text className="text-white">Odrzuć</Text>
          <XMarkIcon size={25} color="red" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default FriendRequest;
