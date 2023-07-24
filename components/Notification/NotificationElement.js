import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Image,
} from "react-native";
import React, { useEffect, useState } from "react";
import {
  CheckBadgeIcon,
  FireIcon,
  UserPlusIcon,
  XMarkIcon,
} from "react-native-heroicons/outline";
import { getInfoAboutUser } from "../../utils/firebaseUtils";

const NotificationElement = ({ item }) => {
  const [senderInfo, setSenderInfo] = useState();
  useEffect(() => {
    const getInfoAboutUserAsync = async () => {
      setSenderInfo(await getInfoAboutUser(item.creatorId));
    };
    getInfoAboutUserAsync();
  }, []);

  return (
    <View className="bg-black/75 rounded-3xl mx-2 my-1 px-2 py-1">
      {senderInfo ? (
        <View>
          <View className="flex-row space-x-2 items-center">
            <Image
              className="w-14 h-14 rounded-full"
              source={{ uri: senderInfo.profileImgUrl }}
            />
            <Text
              style={{ maxWidth: "70%" }}
              className="text-white break-words"
            >
              <Text style={{ color: "tomato" }} className="font-bold">
                {senderInfo.firstName + " " + senderInfo.lastName}
              </Text>{" "}
              dodał wyzwanie
            </Text>
            {item.notificationType == "challengeAdd" && (
              <FireIcon size={25} color="orange" />
            )}
          </View>
          <TouchableOpacity className="flex-row space-x-2 justify-center items-center px-3 py-2 bg-black/50 mb-2 mt-1 rounded-full">
            <Text className="text-white font-semibold">Przejdź</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ActivityIndicator size={25} color="white" />
      )}
    </View>
  );
};

export default NotificationElement;
