import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Image,
} from "react-native";
import React, {useEffect, useState} from "react";
import moment from "moment";
import "moment/locale/pl";
import {
  ArrowTrendingUpIcon,
  FireIcon,
  MapPinIcon,
} from "react-native-heroicons/outline";
import ChallengeProps from "./ChallengeProps";
import {useNavigation} from "@react-navigation/native";

const FriendsChallengeCard = ({item}) => {
  const navigation = useNavigation();
  return (
    <View className="relative items-center bg-black/50 rounded-xl my-2">
      <View className="flex-row space-x-1 items-center justify-center my-2 ">
        <Text className="text-white">{item.activityCreatorName}</Text>
        <Image
          className="w-10 h-10 rounded-full"
          source={{uri: item.activityCreatorProfileImgUrl}}
        />
      </View>
      <View className="flex-row space-x-1 items-center justify-center my-2 ">
        <FireIcon size={25} color="orange" />
        <Text className="text-white">
          Nowe wyzwanie {moment(item.challenge.date.toDate()).fromNow()}
        </Text>
      </View>
      <View className="flex-row items-center justify-center space-x-2 mb-3">
        <MapPinIcon size={25} color="lightgreen" />
        {item.challenge.startAddress == item.challenge.finishAddress ? (
          <Text className="text-white">
            Start/Meta:{" "}
            {item.challenge.startAddress || (
              <ActivityIndicator size={18} color="white" />
            )}
          </Text>
        ) : (
          <View>
            <Text className="text-white">
              Start:{" "}
              {item.challenge.startAddress || (
                <ActivityIndicator size={18} color="white" />
              )}
            </Text>
            <Text className="text-white">
              Meta:{" "}
              {item.challenge.finishAddress || (
                <ActivityIndicator size={18} color="white" />
              )}
            </Text>
          </View>
        )}
      </View>
      <View className="flex-row space-x-2 items-center  mb-3">
        <ArrowTrendingUpIcon size={25} color="white" />
        <Text className="text-white">
          Dystans:{" "}
          {item.challenge.distance < 1
            ? `${item.challenge.distance.toFixed(3) * 1000} m`
            : `${item.challenge.distance.toFixed(2)} km`}
        </Text>
      </View>
      <TouchableOpacity
        onPress={() => {
          navigation.navigate("Challenges");
        }}
        className="bg-orange-400 px-3 py-2 mb-3 rounded-xl"
      >
        <Text className="text-white font-bold">Przejdź do wyzwań</Text>
      </TouchableOpacity>
    </View>
  );
};

export default FriendsChallengeCard;
