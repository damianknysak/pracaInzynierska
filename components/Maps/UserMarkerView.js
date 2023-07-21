import { View, Text, TouchableOpacity, Image } from "react-native";
import React from "react";
import { BookOpenIcon } from "react-native-heroicons/outline";
import { Callout, Marker } from "react-native-maps";

const UserMarkerView = ({
  latitude,
  longitude,
  imageUrl,
  displayName,
  shortDesc,
}) => {
  return (
    <Marker
      coordinate={{
        latitude: latitude,
        longitude: longitude,
      }}
      title={"title"}
      description={"description"}
    >
      <Image
        source={{ uri: imageUrl }}
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
        <View className="justify-center items-center">
          <View>
            <Text className="font-bold">{displayName}</Text>
          </View>
          <View>
            <Text className="text-center">{shortDesc}</Text>
          </View>
          <TouchableOpacity className="mt-3 bg-black/50 p-2 rounded-lg space-x-2 flex-row">
            <BookOpenIcon size={20} color="black" />
            <Text>Zobacz szczegóły</Text>
          </TouchableOpacity>
        </View>
      </Callout>
    </Marker>
  );
};

export default UserMarkerView;
