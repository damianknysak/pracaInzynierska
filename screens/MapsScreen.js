import { View, Text, Image, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import MapView, { Callout, Marker } from "react-native-maps";
import Geolocation from "@react-native-community/geolocation";
import { BookOpenIcon, TvIcon } from "react-native-heroicons/outline";

const MyCustomMarkerView = () => {
  return (
    <View className="justify-center items-center">
      <View>
        <Text className="font-bold">Damian Knysak</Text>
      </View>
      <View>
        <Text className="text-center">
          Tutaj będą jakieś krótkie informacje co on tu odkurwiał
        </Text>
      </View>
      <TouchableOpacity className="mt-3 bg-black/50 p-2 rounded-lg space-x-2 flex-row">
        <BookOpenIcon size={20} color="black" />
        <Text>Zobacz szczegóły</Text>
      </TouchableOpacity>
    </View>
  );
};

const MapsScreen = () => {
  const [position, setPosition] = useState({
    latitude: 10,
    longitude: 10,
    latitudeDelta: 0.001,
    longitudeDelta: 0.001,
  });

  useEffect(() => {
    try {
      Geolocation.getCurrentPosition((pos) => {
        const crd = pos.coords;
        setPosition({
          latitude: crd.latitude,
          longitude: crd.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        });
      });
    } catch (err) {
      console.log(err);
    }
  }, []);
  console.log(position.longitude);
  return (
    <View className="h-full w-screen bg-red-100">
      <MapView
        className="w-full h-full"
        zoomEnabled={true}
        region={{
          latitude: 50.8220227,
          longitude: 19.3235097,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      >
        <Marker
          coordinate={{
            latitude: 50.822,
            longitude: 19.323,
          }}
          title={"title"}
          description={"description"}
        >
          <Image
            source={{ uri: "https://shorturl.at/blFJ3" }}
            style={{
              borderWidth: 2,
              borderColor: "purple",
              width: 50,
              height: 50,
              borderRadius: 25,
            }}
          />
          <Callout
            style={{
              width: 250,
              height: 120,
            }}
          >
            <MyCustomMarkerView />
          </Callout>
        </Marker>
      </MapView>
    </View>
  );
};

export default MapsScreen;
