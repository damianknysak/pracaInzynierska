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
} from "react-native-heroicons/outline";
import moment from "moment";
import "moment/locale/pl";
import YourChallengesCard from "./YourChallengesCard";

const YourChallenges = ({refresh, setRefresh, toastRef}) => {
  const [itemsList, setItemsList] = useState();
  const navigation = useNavigation();
  const getChallegesListAsync = async () => {
    setItemsList(await getChallengesList());
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

  LogBox.ignoreLogs([
    "Non-serializable values were found in the navigation state",
  ]);
  return (
    <View className="">
      <Text className="text-white text-lg font-bold">Twoje wyzwania</Text>
      <ScrollView showsHorizontalScrollIndicator={false} horizontal>
        {itemsList &&
          itemsList.length > 0 &&
          itemsList.map((challenge) => (
            <YourChallengesCard
              key={challenge.id}
              challenge={challenge}
              refresh={refresh}
              setRefresh={setRefresh}
              toastRef={toastRef}
            />
          ))}
        {itemsList && itemsList.length == 0 && (
          <View className="relative bg-black/50 rounded-xl my-2 p-3 space-y-3 h-52 w-52">
            <View className="h-full w-full space-y-2  justify-center items-center ">
              <Text className="text-white text-center text-lg">
                Nie dodałeś jeszcze żadnego wyzwania ...
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
            <View className="relative bg-black/50 rounded-xl my-2 p-3 space-y-3 h-52 w-44">
              <View className="h-full w-full flex-row space-x-1  justify-center items-center ">
                <ActivityIndicator size={40} />
              </View>
            </View>
            <View className="relative bg-black/50 rounded-xl my-2 p-3 space-y-3 h-52 w-44">
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

export default YourChallenges;
