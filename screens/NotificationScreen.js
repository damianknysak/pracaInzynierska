import { View, Text, TouchableOpacity } from "react-native";
import React, { useRef, useState } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { XMarkIcon } from "react-native-heroicons/outline";
import NotificationElement from "../components/Notification/NotificationElement";
import { useNavigation, useRoute } from "@react-navigation/native";
import useNotification from "../hooks/useNotification";
import {
  GestureHandlerRootView,
  ScrollView,
} from "react-native-gesture-handler";
const NotificationScreen = () => {
  const [refreshing, setRefreshing] = useState();
  let route = useRoute();
  let { notificationsList } = route.params;
  const navigation = useNavigation();
  const scrollViewRef = useRef();

  return (
    <GestureHandlerRootView>
      <View className="h-full w-screen items-center">
        <View className="relative w-5/6 mt-10 rounded-3xl h-5/6">
          <LinearGradient
            className="flex-1 rounded-3xl"
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            colors={["#E5E7EB", "#9CA3AF", "#4B5563"]}
          >
            <Text className="font-bold text-center mt-4 text-lg">
              Powiadomienia
            </Text>
            <TouchableOpacity
              className="absolute bg-black/50 p-1 items-center justify-center rounded-full right-3 top-3"
              onPress={() => {
                navigation.goBack();
              }}
            >
              <XMarkIcon size={30} color="black" />
            </TouchableOpacity>
            <ScrollView
              ref={scrollViewRef}
              contentContainerStyle={{ paddingBottom: 20 }}
              className="mt-2 flex-1"
            >
              {notificationsList.map((notification) => {
                return (
                  <NotificationElement
                    key={notification.actionId || notification.creatorId}
                    item={notification}
                    scrollViewRef={scrollViewRef}
                  />
                );
              })}
            </ScrollView>
          </LinearGradient>
        </View>
      </View>
    </GestureHandlerRootView>
  );
};

export default NotificationScreen;
