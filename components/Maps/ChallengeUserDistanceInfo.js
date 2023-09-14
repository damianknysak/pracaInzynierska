import {View, Text, TouchableOpacity} from "react-native";
import React from "react";
import {SignalIcon, SignalSlashIcon} from "react-native-heroicons/outline";

const ChallengeUserDistanceInfo = ({
  challengeStarted,
  isChallengeReadyToStart,
  distanceToFinish,
  distanceToStart,
}) => {
  return (
    <>
      {challengeStarted ? (
        <View className="items-center ">
          <TouchableOpacity className="absolute flex-row items-center space-x-2 bottom-24 bg-black/75 w-full p-2">
            <SignalIcon size={25} color="lightgreen" />
            <Text className="text-white">Dystans do mety:</Text>
            <Text
              className={`${
                isChallengeReadyToStart ? "text-green-600" : "text-red-600"
              } font-bold text-lg`}
            >
              {distanceToFinish && distanceToFinish}
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View className="items-center ">
          <TouchableOpacity className="absolute flex-row items-center space-x-2 bottom-24 bg-black/75 w-full p-2">
            {isChallengeReadyToStart ? (
              <SignalIcon size={25} color="lightgreen" />
            ) : (
              <SignalSlashIcon size={25} color="red" />
            )}
            <Text className="text-white">
              {isChallengeReadyToStart
                ? "Dystans od startu:"
                : "Zbliż się do startu:"}
            </Text>
            <Text
              className={`${
                isChallengeReadyToStart ? "text-green-600" : "text-red-600"
              } font-bold text-lg`}
            >
              {distanceToStart && distanceToStart}
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </>
  );
};

export default ChallengeUserDistanceInfo;
