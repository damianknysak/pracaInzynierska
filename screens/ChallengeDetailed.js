import {View, Text, TouchableOpacity, Image} from "react-native";
import React, {useEffect} from "react";
import {useNavigation, useRoute} from "@react-navigation/native";
import {LinearGradient} from "expo-linear-gradient";
import {
  ArrowTrendingUpIcon,
  CalendarDaysIcon,
  FireIcon,
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
  useEffect(() => {
    console.log(challenge);
  }, [challenge]);
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
              <Text className="font-bold text-xl p-3" style={{color: "tomato"}}>
                Twoje wyzwanie
              </Text>
            ) : (
              <View className="justify-center space-y-4 mt-3">
                <View className="justify-center items-center">
                  <Image
                    className="w-20 h-20 rounded-full"
                    source={{uri: challenge.creator.profileImgUrl}}
                  />
                  <Text className="text-xl font-bold" style={{color: "tomato"}}>
                    {challenge.creator.firstName +
                      " " +
                      challenge.creator.lastName}
                  </Text>
                </View>
              </View>
            )}
            <View className="justify-center space-y-4 mt-3">
              <View className="flex-row space-x-1 px-3">
                <CalendarDaysIcon size={30} color="black" />
                <Text className="text-lg">
                  {moment(challenge.date.toDate()).fromNow()}
                </Text>
              </View>
              <View className="flex-row space-x-2 px-3">
                <ArrowTrendingUpIcon size={30} color="black" />
                <Text className="text-lg">
                  {challenge.distance < 1
                    ? `${challenge.distance.toFixed(3) * 1000} m`
                    : `${challenge.distance.toFixed(2)} km`}
                </Text>
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
              <TouchableOpacity className="bg-white mx-3 p-3 flex-row justify-center items-center rounded">
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
