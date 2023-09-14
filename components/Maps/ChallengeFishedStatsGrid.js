import {View, Text, TouchableOpacity} from "react-native";
import React from "react";
import {
  ClockIcon,
  MapPinIcon,
  TrophyIcon,
  UserCircleIcon,
} from "react-native-heroicons/outline";

const ChallengeFishedStatsGrid = ({time}) => {
  return (
    <View className="w-full">
      <View className="flex-row mx-2 justify-around mt-2 space-x-2">
        <TouchableOpacity className="bg-black/50 flex-1 py-10 flex-row items-center rounded-xl justify-center space-x-2">
          <ClockIcon size={25} color="lightblue" />
          <Text className="text-white">Czas:</Text>
          <Text className="text-white text-lg font-bold">{`${
            time.hr < 10 ? 0 : ""
          }${time.hr} : ${time.min < 10 ? 0 : ""}${time.min} : ${
            time.sec < 10 ? 0 : ""
          }${time.sec}`}</Text>
        </TouchableOpacity>
        <TouchableOpacity className="bg-black/50 flex-1 py-10 flex-row items-center rounded-xl justify-center space-x-2">
          <TrophyIcon size={25} color="gold" />
          <Text className="text-white">Miejsce w tabeli:</Text>
          <Text className="text-white font-bold text-lg">8</Text>
        </TouchableOpacity>
      </View>
      <View className="flex-row justify-around mx-2 mt-2 space-x-2">
        <TouchableOpacity className="bg-black/50 flex-1 py-10 rounded-xl">
          <View className="flex-row items-center justify-center space-x-1">
            <UserCircleIcon size={25} color="gray" />
            <Text className="text-white">Twórca wyzwania: </Text>
          </View>
          <Text className="text-center text-lg font-bold text-white">
            Damian Knysak
          </Text>
        </TouchableOpacity>
        <TouchableOpacity className="bg-black/50 flex-1 py-10 rounded-xl space-x-2">
          <View className="flex-row items-center justify-center space-x-1">
            <MapPinIcon size={25} color="lightgreen" />
            <Text className="text-white">Miejsce: </Text>
          </View>
          <Text className="text-center text-lg font-bold text-white">
            Zawada
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ChallengeFishedStatsGrid;
