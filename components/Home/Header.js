import { View, Text, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { BellIcon, CameraIcon, LinkIcon } from "react-native-heroicons/outline";
import { useNavigation } from "@react-navigation/native";

const Header = ({ headerMenu, setHeaderMenu, userName, navigation }) => {
  return (
    <View>
      <View className="flex-row justify-between mx-3 items-center">
        <TouchableOpacity
          onPress={() => {
            navigation.navigate("Camera");
          }}
          className="bg-black/50 p-2 items-center justify-center rounded-xl border border-gray-600"
        >
          <CameraIcon size={20} color="white" />
        </TouchableOpacity>

        <Text className="text-white mx-8 text-2xl font-semibold text-center">
          Hej {userName}
        </Text>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate("Notification");
          }}
          className="bg-black/50 p-2 items-center justify-center rounded-xl border border-gray-600"
        >
          <BellIcon size={20} color="white" />
        </TouchableOpacity>
      </View>
      <View className="flex-row justify-between mt-3 mx-1 items-center space-x-1">
        <TouchableOpacity
          onPress={() => {
            setHeaderMenu("me");
          }}
          className={
            headerMenu != "me"
              ? "flex-row space-x-1 bg-black/50 py-2 flex-1 items-center justify-center rounded-3xl"
              : "flex-row space-x-1 bg-blue-100/50 py-2 flex-1 items-center justify-center rounded-3xl"
          }
        >
          <Text
            className={
              headerMenu != "me"
                ? "text-gray-500 text-xs"
                : "text-black text-xs"
            }
          >
            Twoja aktywność
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            setHeaderMenu("friends");
          }}
          className={
            headerMenu != "friends"
              ? "flex-row space-x-1 bg-black/50 py-2 flex-1 items-center justify-center rounded-3xl"
              : "flex-row space-x-1 bg-blue-100/50 py-2 flex-1 items-center justify-center rounded-3xl"
          }
        >
          <LinkIcon
            size={20}
            color={headerMenu != "friends" ? "gray" : "black"}
          />
          <Text
            className={
              headerMenu != "friends"
                ? "text-gray-500 text-xs"
                : "text-black text-xs"
            }
          >
            Znajomi
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            setHeaderMenu("community");
          }}
          className={
            headerMenu != "community"
              ? "bg-black/50  py-2 flex-1 items-center justify-center rounded-3xl"
              : "bg-blue-100/50  py-2 flex-1 items-center justify-center rounded-3xl"
          }
        >
          <Text
            className={
              headerMenu != "community"
                ? "text-gray-500 text-xs"
                : "text-black text-xs"
            }
          >
            Społeczność
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Header;
