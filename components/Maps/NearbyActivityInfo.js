import {View, Text, ActivityIndicator} from "react-native";
import React, {useEffect} from "react";
import {getNearbyActivityList} from "../../utils/imageUtils";

const NearbyActivityInfo = ({nearbyMarkersList, setNearbyMarkersList}) => {
  const getInfoAsync = async () => {
    const list = await getNearbyActivityList();
    setNearbyMarkersList(list);
  };

  useEffect(() => {
    getInfoAsync();
  }, []);
  return (
    <>
      {!nearbyMarkersList && (
        <View className="flex-row space-x-2 absolute z-30 left-10 right-10 rounded-xl top-5 bg-black/90 p-3">
          <Text className="text-white">Ładowanie aktywności w pobliżu</Text>
          <ActivityIndicator />
        </View>
      )}
    </>
  );
};

export default NearbyActivityInfo;
