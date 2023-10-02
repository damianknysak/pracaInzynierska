import {
  View,
  Text,
  Image,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import React, {useEffect} from "react";
import {
  ArrowTrendingUpIcon,
  FireIcon,
  MapPinIcon,
} from "react-native-heroicons/outline";
import moment from "moment";
import "moment/locale/pl";
import {useNavigation} from "@react-navigation/native";

const ChallengesList = ({list}) => {
  const navigation = useNavigation();
  return (
    <View>
      {list.map((challenge) => (
        <View
          key={challenge.id}
          className="relative challenges-center bg-black/50 rounded-xl my-2 p-3 space-y-3"
        >
          <View className="flex-row space-x-1 challenges-center justify-center ">
            <FireIcon size={25} color="orange" />
            <Text className="text-white">
              Dodałeś wyzwanie {moment(challenge.date.toDate()).fromNow()}
            </Text>
          </View>

          <View className="flex-row space-x-2 challenges-center ">
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
              navigation.navigate("Challenges");
            }}
            className="bg-orange-400 px-3 py-2 rounded-xl"
          >
            <Text className="text-white font-bold text-center">
              Przejdź do wyzwań
            </Text>
          </TouchableOpacity>
        </View>
      ))}
    </View>
  );
};

export default ChallengesList;
