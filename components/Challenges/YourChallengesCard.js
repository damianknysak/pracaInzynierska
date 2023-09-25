import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  LogBox,
} from "react-native";
import React, {useEffect, useState} from "react";
import {useNavigation} from "@react-navigation/native";
import {
  deleteChallenge,
  getChallengesList,
  getFriendsChallengesList,
} from "../../utils/challengeUtils";
import {
  ArrowTrendingUpIcon,
  FireIcon,
  MapPinIcon,
  TrashIcon,
  TrophyIcon,
} from "react-native-heroicons/outline";
import moment from "moment";
import "moment/locale/pl";

const YourChallengesCard = ({challenge, refresh, setRefresh, toastRef}) => {
  const [isDeleted, setIsDeleted] = useState(false);
  const navigation = useNavigation();
  const handleDelete = () => {
    setIsDeleted(true);
    deleteChallenge(challenge, toastRef);
    setRefresh(true);
  };
  return (
    <>
      {!isDeleted && (
        <View
          key={challenge.id}
          className="relative w-52 bg-black/50 rounded-xl my-2 p-3 space-y-3 mr-3 justify-between"
        >
          <View className="flex-row space-x-1 items-center justify-center ">
            <FireIcon size={25} color="orange" />
            <Text className="text-white">
              {moment(challenge.date.toDate()).fromNow()}
            </Text>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate("CustomDialog", {
                  handleDelete,
                  topic: "Usuń wyzwanie",
                  description:
                    "Czy jesteś pewien, że chcesz usunąć to wyzwanie?",
                });
              }}
              className="bg-black/50 rounded-full w-10 h-10 items-center justify-center"
            >
              <TrashIcon size={20} color="red" />
            </TouchableOpacity>
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
          <View className="flex-row space-x-2  ">
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
                isCurrentUsers: true,
              });
            }}
            className="bg-orange-400 px-3 py-2 rounded-xl"
          >
            <Text className="text-white font-bold text-center">Przejdź</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate("ChallengeLeaderboard", {
                challengeId: challenge.id,
              });
            }}
            className="border-2 border-orange-400 bg-white px-3 py-1 rounded-xl flex-row items-center justify-center space-x-1"
          >
            <Text className="text-orange-400 font-bold text-center">
              Top 10
            </Text>
            <TrophyIcon size={25} color="gold" />
          </TouchableOpacity>
        </View>
      )}
    </>
  );
};

export default YourChallengesCard;
