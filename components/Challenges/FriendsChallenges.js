import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Image,
} from "react-native";
import React, {useEffect, useState} from "react";
import {useNavigation} from "@react-navigation/native";
import {
  getChallengesList,
  getFriendsChallengesList,
} from "../../utils/challengeUtils";
import {
  ArrowTrendingUpIcon,
  FireIcon,
  MapPinIcon,
} from "react-native-heroicons/outline";
import moment from "moment";
import "moment/locale/pl";

const FriendsChallenges = () => {
  const [itemsList, setItemsList] = useState();
  const navigation = useNavigation();

  const getChallegesListAsync = async () => {
    setItemsList(await getFriendsChallengesList());
  };

  useEffect(() => {
    getChallegesListAsync();
  }, []);
  return (
    <View className="mt-10">
      <Text className="text-white text-lg font-bold">Wyzwania znajomych</Text>
      <ScrollView showsHorizontalScrollIndicator={false} horizontal>
        {itemsList &&
          itemsList.length > 0 &&
          itemsList.map((challenge) => (
            <View
              key={challenge.id}
              className="relative bg-black/50 rounded-xl my-2 p-3 space-y-3 mr-3 justify-between h-64 w-52"
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
                  {challenge.creator.firstName +
                    " " +
                    challenge.creator.lastName}
                </Text>
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
            </View>
          ))}
        {itemsList && itemsList.length == 0 && (
          <View className="relative bg-black/50 rounded-xl my-2 p-3 space-y-3 h-64 w-52">
            <View className="h-full w-full flex-row space-x-1  justify-center items-center ">
              <FireIcon size={25} color="orange" />
              <Text className="text-white">Brak wyzwań</Text>
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
