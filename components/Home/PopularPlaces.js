import { View, Text, Image, TouchableOpacity, Linking } from "react-native";
import React, { useEffect, useState } from "react";
import { MapPinIcon } from "react-native-heroicons/outline";
import { GOOGLE_MAPS_APIKEY } from "../../utils/mapsUtils";
import Geolocation from "@react-native-community/geolocation";
import { StarIcon } from "react-native-heroicons/solid";

const PopularPlaces = () => {
  const [items, setItems] = useState([]);
  const [location, setLocation] = useState();
  const getCurrentPosition = async () => {
    Geolocation.getCurrentPosition((pos) => {
      const crd = pos.coords;
      setLocation({
        latitude: crd.latitude,
        longitude: crd.longitude,
      });
    });
  };

  const getImageUrl = (reference) => {
    return `https://maps.googleapis.com/maps/api/place/photo?photoreference=${reference}&sensor=false&maxheight=400&maxwidth=200&key=${GOOGLE_MAPS_APIKEY}`;
  };

  const fetchForPopularPlacesNearby = async () => {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${location.latitude},${location.longitude}&radius=4000&type=tourist_attraction&key=${GOOGLE_MAPS_APIKEY}`
    );
    const responseJson = await response.json();
    if (responseJson.results) {
      console.log(responseJson.results);
      setItems(responseJson.results);
    }
  };

  const shortenString = (inputString) => {
    if (inputString.length > 30) {
      return inputString.slice(0, 27) + "...";
    } else {
      return inputString;
    }
  };

  useEffect(() => {
    getCurrentPosition();
  }, []);

  useEffect(() => {
    if (location) {
      fetchForPopularPlacesNearby();
    }
  }, [location]);
  return (
    <View>
      <View className="mx-2">
        <Text className="text-white text-base font-bold">
          Miejsca blisko Ciebie
        </Text>
      </View>
      <View className="flex-row flex-wrap">
        {items.length > 0 ? (
          items.map((item, index) => (
            <TouchableOpacity
              className="relative"
              key={index}
              style={{ width: "33%", paddingHorizontal: 3, paddingVertical: 5 }}
              onPress={() => {
                Linking.openURL(
                  `https://www.google.com/maps/search/?api=1&query=Google&query_place_id=${item.place_id}`
                );
              }}
            >
              <View className="rounded justify-center">
                <View className="flex-row justify-center absolute left-0 right-0 items-center space-x-1  py-1 z-10 bg-black/75">
                  <MapPinIcon size={20} color="lightgreen" />
                  <Text className="text-xs font-bold text-center text-white max-w-[100px]">
                    {shortenString(item.name)}
                  </Text>
                </View>
                <View className="flex-row justify-center items-center space-x-1 absolute left-0 right-0 bottom-10  py-1 z-10 bg-black/50">
                  <StarIcon size={20} color="gold" />
                  <Text className="text-xs font-bold text-center text-white">
                    {"Oceny: " + item.rating}
                  </Text>
                </View>
                {item && item.photos && item.photos[0].photo_reference ? (
                  <Image
                    className="w-full rounded-3xl"
                    style={{
                      aspectRatio: 0.6,
                      resizeMode: "cover",
                    }}
                    source={{
                      uri: getImageUrl(item.photos[0].photo_reference),
                    }}
                  />
                ) : (
                  <View className="w-full rounded-3xl h-64 bg-black"></View>
                )}
              </View>
            </TouchableOpacity>
          ))
        ) : (
          <View className="w-full items-center bg-black rounded-t-3xl mt-5">
            <View className="max-w-xs rounded-xl mt-2">
              <Text className="text-white text-lg">
                Aby korzystać z polecanych miejsc na podstawie Twojej
                lokalizacji musisz włączyć lokalizacje i nadać naszej aplikacji
                uprawnienia.
              </Text>
            </View>
            <Image
              className="w-64 h-64"
              source={require("../../assets/myAssets/map-location.png")}
            />
          </View>
        )}
      </View>
    </View>
  );
};

export default PopularPlaces;
