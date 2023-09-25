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
        <View className="flex-row my-1 items-center bg-black/50 p-1 rounded-xl border border-white">
          <View className="flex-row space-x-10 w-1/3 mr-3">
            <Text className="text-xl font-bold">{position}</Text>
            <View className="items-center">
              <Text className="text-xl">
                {timeObject.hr + ":" + timeObject.min + ":" + timeObject.sec}
              </Text>
            </View>
          </View>
          <View className="flex-row items-center flex-1 space-x-3">
            <Image
              className="w-10 h-10 rounded-full"
              source={{uri: userInfo.profileImgUrl}}
            />
            <Text className="font-bold">
              {userInfo.firstName + " " + userInfo.lastName}
            </Text>
          </View>
        </View>
      )}
    </>
  );
};

export default LeaderboardCard;
