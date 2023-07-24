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
  PhotoIcon,
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
          <View className="flex-row justify-between  items-center">
            <Image
              className="w-14 h-14 rounded-full mr-2"
              source={{ uri: senderInfo.profileImgUrl }}
            />
            <View style={{ maxWidth: "60%" }}>
              <Text className="text-white break-words">
                <Text style={{ color: "tomato" }} className="font-bold">
                  {senderInfo.firstName + " " + senderInfo.lastName}
                </Text>{" "}
                {item.notificationType == "challengeAdd" &&
                  "dodał/a nowe wyzwanie"}
                {item.notificationType == "imageAdd" && "dodał/a nowe zdjęcie"}
              </Text>
            </View>

            {item.notificationType == "challengeAdd" && (
              <FireIcon size={25} color="orange" />
            )}
            {item.notificationType == "imageAdd" && (
              <PhotoIcon size={25} color="lightgreen" />
            )}
          </View>
        </View>
      ) : (
        <ActivityIndicator size={25} color="white" />
      )}
    </View>
  );
};

export default NotificationElement;
