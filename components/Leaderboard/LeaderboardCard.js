import {View, Text, Image} from "react-native";
import React, {useEffect, useState} from "react";
import {getInfoAboutUser} from "../../utils/firebaseUtils";
import {secondsToTimeObject} from "../../utils/timeUtils";
import {ClockIcon} from "react-native-heroicons/outline";

const LeaderboardCard = ({time, userId, position}) => {
  const [userInfo, setUserInfo] = useState();
  const timeObject = secondsToTimeObject(time);

  const getInfoAboutUserAsync = async () => {
    const userInfo = await getInfoAboutUser(userId);
    setUserInfo(userInfo);
  };
  useEffect(() => {
    getInfoAboutUserAsync();
  }, []);

  return (
    <>
      {userInfo && (
        <View
          className={`
          ${
            position == 1 ? "border-yellow-400" : "border-white"
          } flex-row space-x-2 my-1 items-center bg-gray-500 p-1 rounded-xl border-2 shadow-lg`}
        >
          <Text
            className={`text-xl font-bold ${
              position == 1 && "text-yellow-400"
            }`}
          >
            {position}.
          </Text>
          <Text className="text-lg text-white">
            {timeObject.hr + ":" + timeObject.min + ":" + timeObject.sec}
          </Text>
          <View className="flex-row items-center flex-1 space-x-2">
            <Text className={`font-bold ${position == 1 && "text-orange-400"}`}>
              {userInfo.firstName + " " + userInfo.lastName}
            </Text>
            <View className="border-2 border-white rounded-full">
              <Image
                className="w-10 h-10 rounded-full"
                source={{uri: userInfo.profileImgUrl}}
              />
            </View>
          </View>
        </View>
      )}
    </>
  );
};

export default LeaderboardCard;
