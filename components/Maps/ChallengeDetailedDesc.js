import {View, Text, TouchableOpacity, Image} from "react-native";
import React from "react";
import {useNavigation, useRoute} from "@react-navigation/native";
import {LinearGradient} from "expo-linear-gradient";
import {
  ArrowTrendingUpIcon,
  CalendarDaysIcon,
  MapIcon,
  MapPinIcon,
  FireIcon,
} from "react-native-heroicons/outline";
import moment from "moment";
import "moment/locale/pl";

const ChallengeDetailedDesc = ({isCurrentUsers, challenge}) => {
  return (
    <View className="absolute mt-14 z-10">
      {isCurrentUsers ? (
        <View className="px-3 mt-5 mb-2 rounded-r-full bg-black/75 py-2 flex-row justify-between">
          <Text className="font-bold text-xl text-white">
            Ty stworzyłeś to wyzwanie
          </Text>
        </View>
      ) : (
        <View className="justify-center space-y-4 mt-5 mb-2 rounded-r-full bg-black/75 py-2">
          <View className="justify-center items-center flex-row space-x-2 w-full">
            <Text className="text-lg font-bold text-white">Stworzył:</Text>
            <View className="w-10 h-10 rounded-full border border-white">
              <Image
                className="w-full h-full rounded-full"
                source={{uri: challenge.creator.profileImgUrl}}
              />
            </View>

            <Text className="text-lg font-bold text-white">
              {challenge.creator.firstName + " " + challenge.creator.lastName}
            </Text>
          </View>
        </View>
      )}
      <View className="space-y-4 px-3 bg-black/50 rounded-r-full py-2">
        <View className="flex-row space-x-1">
          <CalendarDaysIcon size={30} color="orange" />
          <Text className="text-lg text-white">
            {moment(challenge.date.toDate()).fromNow()}
          </Text>
        </View>
        <View className="flex-row justify-between">
          <View className="flex-row space-x-2">
            <ArrowTrendingUpIcon size={30} color="orange" />
            <Text className="text-lg text-white">
              {challenge.distance < 1
                ? `${challenge.distance.toFixed(3) * 1000} m`
                : `${challenge.distance.toFixed(2)} km`}
            </Text>
          </View>
          <View className="flex-row items-center space-x-1">
            <MapPinIcon color="lightgreen" size={25} />
            <Text className="text-lg font-bold text-white">
              {challenge.startAddress}
            </Text>
          </View>
        </View>

        <View className="flex-row items-center space-x-2">
          <MapIcon size={30} color="orange" />
          <Text className="text-lg text-white">
            Trasa{" "}
            {challenge.routeType == "google" ? "Google" : "niestandardowa"}
          </Text>
        </View>
      </View>
    </View>
  );
};

export default ChallengeDetailedDesc;
