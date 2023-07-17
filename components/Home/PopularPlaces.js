import {
  View,
  Text,
  Image,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import React from "react";
import {
  ArrowRightCircleIcon,
  MapIcon,
  MapPinIcon,
} from "react-native-heroicons/outline";

const PopularPlaces = () => {
  const items = [
    {
      key: 1,
      gallery_image_url: "https://shorturl.at/prxDI",
      userImageURL: "https://shorturl.at/blFJ3",
      placeName: "New York City",
      name: "dupa",
    },
    {
      key: 2,
      gallery_image_url: "https://shorturl.at/hwEGR",
      userImageURL: "https://shorturl.at/wxEQY",
      placeName: "Nowy Sącz",
      name: "dupa",
    },
    {
      key: 3,
      gallery_image_url: "https://shorturl.at/giIJL",
      userImageURL: "https://shorturl.at/xDEJN",
      placeName: "Częstochowa",
      name: "dupa",
    },
    {
      key: 4,
      gallery_image_url: "https://shorturl.at/aruPS",
      userImageURL: "https://shorturl.at/blFJ3",
      placeName: "Elbląg",
      name: "dupa",
    },
    // https://shorturl.at/cjmL0
    {
      key: 5,
      gallery_image_url: "https://shorturl.at/cjmL0",
      userImageURL: "https://shorturl.at/moswy",
      name: "dupa",
      placeName: "Francja, Paryż",
    },
  ];

  return (
    <View>
      <View className="mx-2">
        <Text className="text-white text-base font-bold">
          Popularne Miejsca
        </Text>
      </View>
      <View className="flex-row flex-wrap">
        {items.map((item) => (
          <TouchableOpacity
            key={item.key}
            style={{ width: "33%", paddingHorizontal: 3, paddingVertical: 5 }}
          >
            <View className="rounded relative">
              <View className="absolute z-10 top-2 left-2">
                <Image
                  className="w-10 h-10 rounded-full"
                  source={{ uri: item.userImageURL }}
                />
              </View>
              <View className="flex-row justify-center items-center space-x-1 absolute py-1 left-0 right-0 bottom-4 z-10 bg-gray-500/50">
                <MapPinIcon size={20} color="black" />
                <Text className="text-xs font-bold text-center">
                  {item.placeName}
                </Text>
              </View>
              <Image
                className="w-full rounded-3xl"
                style={{
                  aspectRatio: 0.6,
                  resizeMode: "cover",
                }}
                source={{ uri: item.gallery_image_url }}
              />
            </View>
          </TouchableOpacity>
        ))}
        <TouchableOpacity
          style={{ width: "33%" }}
          className="my-1  py-5 bg-black/50 rounded-3xl justify-center"
        >
          <View className="flex-row items-center justify-center space-x-1">
            <Text className="text-xs text-center  text-white">
              Zobacz więcej
            </Text>
            <ArrowRightCircleIcon size={20} color="white" />
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const style = StyleSheet.create({
  row: {
    flex: 1,
    justifyContent: "space-between",
  },
});
export default PopularPlaces;
