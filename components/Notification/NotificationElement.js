import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  Dimensions,
} from "react-native";
import React, { useEffect, useState } from "react";
import {
  CheckBadgeIcon,
  FireIcon,
  PhotoIcon,
  TrashIcon,
  UserPlusIcon,
  XMarkIcon,
} from "react-native-heroicons/outline";
import { addUserToFriends, declineInvitation } from "../../utils/firebaseUtils";
import { deleteNotification } from "../../utils/notifyUtils";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { useNavigation } from "@react-navigation/native";
import useHomeActivity from "../../hooks/useHomeActivity";

const NotificationElement = ({ item, scrollViewRef }) => {
  const [senderInfo, setSenderInfo] = useState(item.senderInfo);
  const [isDeleted, setIsDeleted] = useState(false);
  const translateX = useSharedValue(0);
  const [height, setHeight] = useState(0);
  const [loading, setLoading] = useState(false);
  const SCREEN_WIDTH = Dimensions.get("window").width;
  const TRANSLATE_X_THRESHOLD = -SCREEN_WIDTH * 0.3;
  const navigation = useNavigation();
  const { requestToChangeHomeHeader } = useHomeActivity();

  const gesture = Gesture.Pan()
    .onUpdate((event) => {
      if (event.translationX > 0) {
        translateX.value = event.translationX;
      }
    })
    .onEnd(() => {
      const shouldBeDismissed =
        Math.abs(translateX.value) > Math.abs(TRANSLATE_X_THRESHOLD);
      if (shouldBeDismissed) {
        const leftOrRight = translateX.value > 0 ? 1 : -1;
        translateX.value = withTiming(
          leftOrRight * SCREEN_WIDTH,
          null,
          (isFinished) => {
            //delete element after animation ends
            if (isFinished) {
              runOnJS(setIsDeleted)(true);
              runOnJS(deleteNotification)(item);
            }
          }
        );
      } else {
        translateX.value = withTiming(0);
      }
    })
    .simultaneousWithExternalGesture(scrollViewRef);

  const rStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateX: translateX.value,
      },
    ],
  }));

  const rIconStyle = useAnimatedStyle(() => ({
    height: height,
    opacity:
      Math.abs(translateX.value) > Math.abs(TRANSLATE_X_THRESHOLD) ? 1 : 0,
    justifyContent: translateX.value < 0 ? "flex-end" : "flex-start",
  }));

  return (
    <>
      {isDeleted ? (
        <></>
      ) : (
        <TouchableOpacity
          onPress={() => {
            if (item && item.notificationType === "imageAdd") {
              requestToChangeHomeHeader("friends");
              navigation.navigate("Home");
            }
            if (item && item.notificationType === "challengeAdd")
              navigation.navigate("Challenges");
          }}
        >
          <GestureDetector gesture={gesture}>
            <Animated.View
              onLayout={(event) => {
                setHeight(event.nativeEvent.layout.height);
              }}
              style={rStyle}
              className="bg-gray-800 rounded-3xl mx-2 my-1 px-2 py-1"
            >
              {senderInfo ? (
                <View>
                  <View className="flex-row justify-between  items-center">
                    <Image
                      className="w-14 h-14 rounded-full mr-2"
                      source={{ uri: senderInfo.profileImgUrl }}
                    />
                    <View style={{ maxWidth: "70%" }}>
                      <Text className="text-white break-words">
                        <Text style={{ color: "tomato" }} className="font-bold">
                          {senderInfo.firstName + " " + senderInfo.lastName}
                        </Text>{" "}
                        {item.notificationType == "challengeAdd" &&
                          "dodał/a nowe wyzwanie"}
                        {item.notificationType == "imageAdd" &&
                          "dodał/a nowe zdjęcie"}
                        {item.notificationType == "friendRequest" &&
                          "wysłał/a zaproszenie do grona znajomych"}
                      </Text>
                    </View>

                    {item.notificationType == "challengeAdd" && (
                      <FireIcon size={25} color="orange" />
                    )}
                    {item.notificationType == "imageAdd" && (
                      <PhotoIcon size={25} color="lightgreen" />
                    )}
                    {item.notificationType == "friendRequest" && (
                      <UserPlusIcon size={25} color="lightgreen" />
                    )}
                  </View>
                  {item.notificationType == "friendRequest" && (
                    <View className="flex-row py-2 justify-center space-x-8">
                      <TouchableOpacity
                        onPress={() => {
                          setLoading(true);
                          addUserToFriends(item.creatorId);
                          setIsDeleted(true);
                          setLoading(false);
                        }}
                        className="flex-row rounded items-center space-x-1 border px-1 py-2 bg-black/50"
                      >
                        <Text className="text-white">Akceptuj</Text>
                        {loading ? (
                          <ActivityIndicator size={25} color="green" />
                        ) : (
                          <CheckBadgeIcon size={25} color="green" />
                        )}
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => {
                          setLoading(true);
                          declineInvitation(item.creatorId);
                          setIsDeleted(true);
                          setLoading(false);
                        }}
                        className="flex-row rounded items-center space-x-1 border px-1 py-2 bg-black/50"
                      >
                        <Text className="text-white">Odrzuć</Text>
                        <XMarkIcon size={25} color="red" />
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              ) : (
                <ActivityIndicator size={25} color="white" />
              )}
            </Animated.View>
          </GestureDetector>
          <Animated.View
            style={rIconStyle}
            className="-z-10 absolute top-1 left-2 right-2 rounded-3xl flex-row items-center px-5"
          >
            <TrashIcon size={25} color="red" />
          </Animated.View>
        </TouchableOpacity>
      )}
    </>
  );
};

export default NotificationElement;
