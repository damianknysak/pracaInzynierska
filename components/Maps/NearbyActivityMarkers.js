import {View, Text} from "react-native";
import React, {useEffect, useMemo} from "react";
import NearbyMarker from "./NearbyMarker";

const NearbyActivityMarkers = ({list}) => {
  const Markers = useMemo(
    () =>
      list?.map((marker, index) => {
        console.log("hello");
        return <NearbyMarker key={index} data={marker} />;
      }),
    [list]
  );
  return <>{list && Markers}</>;
};

export default NearbyActivityMarkers;
