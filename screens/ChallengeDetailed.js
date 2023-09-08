import {View, Text, TouchableOpacity, Image} from "react-native";
import React from "react";
import {useNavigation, useRoute} from "@react-navigation/native";
import {LinearGradient} from "expo-linear-gradient";
import {
  ArrowTrendingUpIcon,
  CalendarDaysIcon,
  MapIcon,
  MapPinIcon,
  XMarkIcon,
} from "react-native-heroicons/outline";
import moment from "moment";
import "moment/locale/pl";
import MapView, {Polyline} from "react-native-maps";
import MapViewDirections from "react-native-maps-directions";
import ChallengeMarkerView from "../components/Maps/ChallengeMarkerView";

const ChallengeDetailed = () => {
  const route = useRoute();
  const {challenge, isCurrentUsers} = route.params;
  const navigation = useNavigation();
  const GOOGLE_MAPS_APIKEY = "AIzaSyAcRStPFc7CQTBjWLRnMqkEbviZ0kxS5NY";

  return (
    <View className="relative h-full w-screen items-center justify-center">
      <View className="absolute top-10 bottom-20 left-3 right-3 rounded-3xl">
        <LinearGradient
          className="flex-1 rounded-3xl"
          start={{x: 0, y: 0}}
          end={{x: 1, y: 1}}
          colors={["#E5E7EB", "#9CA3AF", "#4B5563"]}
        >
          <Text className="font-bold text-center mt-4 text-lg">
            Szczegóły wyzwania
          </Text>
          <TouchableOpacity
            className="absolute bg-black/50 p-1 items-center justify-center rounded-full right-3 top-3"
            onPress={() => {
              navigation.goBack();
            }}
          >
            <XMarkIcon size={30} color="black" />
          </TouchableOpacity>
          <View>
            {isCurrentUsers ? (
              <View className="px-3 mt-5 mb-2 bg-black/50 py-2 flex-row justify-between">
                <Text className="font-bold text-xl text-white">
                  Twoje wyzwanie
                </Text>
              </View>
            ) : (
              <View className="justify-center space-y-4 mt-5 mb-2 bg-black/50 py-2">
                <View className="justify-center items-center">
                  <View className="w-20 h-20 rounded-full border border-white">
                    <Image
                      className="w-full h-full rounded-full"
                      source={{uri: challenge.creator.profileImgUrl}}
                    />
                  </View>

                  <Text className="text-xl font-bold text-white">
                    {challenge.creator.firstName +
                      " " +
                      challenge.creator.lastName}
                  </Text>
                </View>
              </View>
            )}
            <View className="justify-center space-y-4">
              <View className="space-y-4 px-3">
                <View className="flex-row space-x-1">
                  <CalendarDaysIcon size={30} color="black" />
                  <Text className="text-lg">
                    {moment(challenge.date.toDate()).fromNow()}
                  </Text>
                </View>
                <View className="flex-row justify-between">
                  <View className="flex-row space-x-2">
                    <ArrowTrendingUpIcon size={30} color="black" />
                    <Text className="text-lg">
                      {challenge.distance < 1
                        ? `${challenge.distance.toFixed(3) * 1000} m`
                        : `${challenge.distance.toFixed(2)} km`}
                    </Text>
                  </View>
                  <View className="flex-row items-center space-x-1">
                    <MapPinIcon color="black" size={25} />
                    <Text className="text-lg font-bold">
                      {challenge.startAddress}
                    </Text>
                  </View>
                </View>

                <View className="flex-row items-center space-x-2">
                  <MapIcon size={30} color="black" />
                  <Text className="text-lg">
                    Trasa{" "}
                    {challenge.routeType == "google"
                      ? "Google"
                      : "niestandardowa"}
                  </Text>
                </View>
              </View>

              <MapView
                className="w-full h-64"
                zoomEnabled={true}
                region={{
                  latitude: challenge.startLatitude,
                  longitude: challenge.startLongitude,
                  latitudeDelta: 0.05,
                  longitudeDelta: 0.0421,
                }}
              >
                {challenge.routeType == "straight" && (
                  <Polyline
                    coordinates={[
                      {
                        latitude: challenge.startLatitude,
                        longitude: challenge.startLongitude,
                      },

                      {
                        latitude: challenge.finishLatitude,
                        longitude: challenge.finishLongitude,
                      },
                    ]}
                    strokeWidth={4}
                    strokeColor="hotpink"
                    lineDashPattern={[10, 1]}
                  />
                )}
                {challenge.routeType == "google" && (
                  <MapViewDirections
                    origin={{
                      latitude: challenge.startLatitude,
                      longitude: challenge.startLongitude,
                    }}
                    destination={{
                      latitude: challenge.finishLatitude,
                      longitude: challenge.finishLongitude,
                    }}
                    strokeWidth={6}
                    strokeColor="hotpink"
                    apikey={GOOGLE_MAPS_APIKEY}
                    tappable={true}
                    onPress={() => {
                      console.log("Polyline pressed");
                    }}
                  />
                )}
                <ChallengeMarkerView
                  type="start"
                  color="red"
                  draggable={false}
                  pinPosition={{
                    latitude: challenge.startLatitude,
                    longitude: challenge.startLongitude,
                  }}
                />
                <ChallengeMarkerView
                  type="finish"
                  draggable={false}
                  color="lightgreen"
                  pinPosition={{
                    latitude: challenge.finishLatitude,
                    longitude: challenge.finishLongitude,
                  }}
                />
              </MapView>
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate("Maps", {
                    challengeToBeStarted: challenge,
                  });
                }}
                className="bg-white mx-3 p-3 flex-row justify-center items-center rounded"
              >
                <Text className="font-bold text-lg">Rozpocznij wyzwanie</Text>
              </TouchableOpacity>
            </View>
          </View>
        </LinearGradient>
      </View>
    </View>
  );
};

export default ChallengeDetailed;
