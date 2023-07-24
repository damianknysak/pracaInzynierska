import { View, Text, TouchableOpacity, TextInput } from "react-native";
import React, { useState } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { UserPlusIcon, XMarkIcon } from "react-native-heroicons/outline";
import { useNavigation } from "@react-navigation/native";
import { sendFriendRequest } from "../utils/firebaseUtils";

const AddFriendScreen = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState("");
  return (
    <View className="h-full w-screen items-center justify-center">
      <View className="relative w-5/6 mt-10 rounded-3xl h-52">
        <LinearGradient
          className="flex-1 rounded-3xl"
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          colors={["#E5E7EB", "#9CA3AF", "#4B5563"]}
        >
          <Text className="font-bold text-center mt-4 text-lg">
            Dodaj do znajomych
          </Text>
          <TouchableOpacity
            className="absolute bg-black/50 p-1 items-center justify-center rounded-full right-3 top-3"
            onPress={() => {
              navigation.goBack();
            }}
          >
            <XMarkIcon size={30} color="black" />
          </TouchableOpacity>
          <View className="m-3">
            <Text className="text-black pt-4 pb-1">
              Podaj email użytkownika:
            </Text>
            <TextInput
              className="bg-black px-2 py-1 rounded border border-gray-500"
              placeholder="damian@company.com"
              placeholderTextColor="gray"
              color="white"
              onChangeText={(text) => {
                setEmail(text);
              }}
            />
            <TouchableOpacity
              onPress={() => {
                sendFriendRequest(email);
              }}
              className="flex-row justify-center space-x-3 bg-white rounded items-center"
            >
              <UserPlusIcon size={20} color="black" />
              <Text className="text-black py-2 font-bold">
                Wyślij zaproszenie
              </Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </View>
    </View>
  );
};

export default AddFriendScreen;
