import {View, Text, Image} from "react-native";
import React, {useEffect, useState} from "react";
import {Callout, Marker} from "react-native-maps";
import {FireIcon, PhotoIcon} from "react-native-heroicons/outline";

const NearbyMarker = ({data}) => {
  const [position, setPosition] = useState();

  useEffect(() => {
    if (data.activityType == "image") {
      setPosition({
        latitude: data.image.latitude,
        longitude: data.image.longitude,
      });
    } else {
      setPosition({
        latitude: data.challenge.startLatitude,
        longitude: data.challenge.startLongitude,
      });
    }
  }, []);

  return (
    <>
      {position && (
        <Marker
          onPress={() => {
            console.log(data.activityType);
          }}
          draggable={false}
          coordinate={position}
          tracksViewChanges={false}
        >
          <View
            className={`relative border ${
              data.activityType == "challenge"
                ? "border-orange-400"
                : "border-blue-400"
            } rounded-b-full items-center justify-center bg-black`}
          >
            <View className="">
              {data.activityType == "challenge" ? (
                <FireIcon size={20} color="orange" />
              ) : (
                <PhotoIcon size={20} color="lightblue" />
              )}
            </View>
            <Image
              className="w-10 h-10 rounded-full"
              source={{uri: data.activityCreatorProfileImgUrl}}
            />
          </View>
        </Marker>
      )}
    </>
  );
};

export default NearbyMarker;
