import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import React, { useEffect, useState } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { XMarkIcon } from "react-native-heroicons/outline";
import { subscribeToNotifications } from "../utils/notifyUtils";
import NotificationElement from "../components/Notification/NotificationElement";
const NotificationScreen = ({ navigation }) => {
  const [notificationsList, setNotificationsList] = useState([]);

  useEffect(() => {
    const unsubscribeNotifications = subscribeToNotifications((requests) => {
      setNotificationsList(requests);
    });

    // Zwracamy funkcję do odsubskrybowania w celu czyszczenia subskrypcji przy wycofywaniu komponentu
    return () => {
      unsubscribeNotifications();
    };
  }, []);
  return (
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
            contentContainerStyle={{ paddingBottom: 20 }}
            className="mt-2 flex-1"
          >
            {notificationsList.map((notification) => {
              return (
                <NotificationElement
                  key={notification.actionId || notification.creatorId}
                  item={notification}
                />
              );
            })}
          </ScrollView>
        </LinearGradient>
      </View>
    </View>
  );
};

export default NotificationScreen;
