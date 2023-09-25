import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Image,
} from "react-native";
import React from "react";
import {useNavigation} from "@react-navigation/native";
import {
  ArrowTrendingUpIcon,
  FireIcon,
  TrophyIcon,
} from "react-native-heroicons/outline";
import moment from "moment";
import "moment/locale/pl";

const FriendsChallengeCard = ({challenge}) => {
  const navigation = useNavigation();
  return (
    <View
      key={challenge.id}
      className="relative bg-black/50 rounded-xl my-2 p-3 space-y-3 mr-3 justify-between w-52"
    >
      <View className="flex-row space-x-1  justify-center ">
        <FireIcon size={25} color="orange" />
        <Text className="text-white">
          {moment(challenge.date.toDate()).fromNow()}
        </Text>
      </View>

      <View className="flex-row items-center space-x-2">
        <Image
          className="w-10 h-10 rounded-full"
          source={{uri: challenge.creator.profileImgUrl}}
        />
        <Text style={{color: "tomato"}}>
          {challenge.creator.firstName + " " + challenge.creator.lastName}
        </Text>
      </View>
      <View className="border border-white rounded-xl items-center">
        {challenge.transportType == "bike" && (
          <Image
            className="w-10 h-10"
            source={require("../../assets/myAssets/bicycle.png")}
          />
        )}
        {challenge.transportType == "foot" && (
          <Image
            className="w-10 h-10"
            source={require("../../assets/myAssets/walk.png")}
          />
        )}
      </View>
      {challenge.startAddress == challenge.finishAddress ? (
        <Text className="text-white">
          Start/Meta:{" "}
          {challenge.startAddress || (
            <ActivityIndicator size={18} color="white" />
          )}
        </Text>
      ) : (
        <View>
          <Text className="text-white">
            Start:{" "}
            {challenge.startAddress || (
              <ActivityIndicator size={18} color="white" />
            )}
          </Text>
          <Text className="text-white">
            Meta:{" "}
            {challenge.finishAddress || (
              <ActivityIndicator size={18} color="white" />
            )}
          </Text>
        </View>
      )}
      <View className="flex-row space-x-2 ">
        <ArrowTrendingUpIcon size={25} color="white" />
        <Text className="text-white">
          Dystans:{" "}
          {challenge.distance < 1
            ? `${challenge.distance.toFixed(3) * 1000} m`
            : `${challenge.distance.toFixed(2)} km`}
        </Text>
      </View>
      <TouchableOpacity
        onPress={() => {
          navigation.navigate("ChallengeDetailed", {
            challenge: challenge,
          });
        }}
        className="bg-orange-400 px-3 py-2 rounded-xl"
      >
        <Text className="text-white font-bold text-center">
          Zobacz szczegóły
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {
          navigation.navigate("ChallengeLeaderboard", {
            challengeId: challenge.id,
          });
        }}
        className="border-2 border-orange-400 bg-white px-3 py-1 rounded-xl flex-row items-center justify-center space-x-1"
      >
        <Text className="text-orange-400 font-bold text-center">Top 10</Text>
        <TrophyIcon size={25} color="gold" />
      </TouchableOpacity>
    </View>
  );
};

export default FriendsChallengeCard;
