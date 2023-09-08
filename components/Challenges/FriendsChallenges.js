import {View, Text, ScrollView, ActivityIndicator, Image} from "react-native";
import React, {useEffect, useState} from "react";
import {useNavigation} from "@react-navigation/native";
import {getFriendsChallengesList} from "../../utils/challengeUtils";
import FriendsChallengeCard from "./FriendsChallengeCard";

const FriendsChallenges = ({refresh, setRefresh}) => {
  const [itemsList, setItemsList] = useState();
  const navigation = useNavigation();

  const getChallegesListAsync = async () => {
    setItemsList(await getFriendsChallengesList());
  };

  useEffect(() => {
    getChallegesListAsync();
  }, []);

  useEffect(() => {
    if (refresh) {
      getChallegesListAsync();
      setRefresh(false);
    }
  }, [refresh]);
  return (
    <View className="mt-10">
      <Text className="text-white text-lg font-bold">Wyzwania znajomych</Text>
      <ScrollView showsHorizontalScrollIndicator={false} horizontal>
        {itemsList &&
          itemsList.length > 0 &&
          itemsList.map((challenge) => (
            <FriendsChallengeCard key={challenge.id} challenge={challenge} />
          ))}
        {itemsList && itemsList.length == 0 && (
          <View className="relative bg-black/50 rounded-xl my-2 p-3 space-y-3 h-64 w-52">
            <View className="h-full w-full space-y-2  justify-center items-center ">
              <Text className="text-white text-center text-lg">
                Brak wyzwań ...
              </Text>
              <Image
                className="w-20 h-20"
                source={require("../../assets/myAssets/no-fire.png")}
              />
            </View>
          </View>
        )}

        {!itemsList && (
          <View className="flex-row space-x-2">
            <View className="relative bg-black/50 rounded-xl my-2 p-3 space-y-3 h-64 w-52">
              <View className="h-full w-full flex-row space-x-1  justify-center items-center ">
                <ActivityIndicator size={40} />
              </View>
            </View>
            <View className="relative bg-black/50 rounded-xl my-2 p-3 space-y-3 h-64 w-52">
              <View className="h-full w-full flex-row space-x-1  justify-center items-center ">
                <ActivityIndicator size={40} />
              </View>
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default FriendsChallenges;
