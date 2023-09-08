import {View, Text} from "react-native";
import React, {useEffect, useRef, useState} from "react";
import MapView from "react-native-maps";
import MapViewDirections from "react-native-maps-directions";
import {Polyline} from "react-native-svg";
import Geolocation from "@react-native-community/geolocation";
import ChallengeMarkerView from "./ChallengeMarkerView";
import ChallengeActiveInfo from "./ChallengeActiveInfo";

const ChallengeStartedView = ({challenge}) => {
  const mapRef = useRef();
  const GOOGLE_MAPS_APIKEY = "AIzaSyAcRStPFc7CQTBjWLRnMqkEbviZ0kxS5NY";
  const [usersPosition, setUsersPosition] = useState();

  const getUsersPosition = () => {
    Geolocation.getCurrentPosition((pos) => {
      const crd = pos.coords;
      setUsersPosition({
        latitude: crd.latitude,
        longitude: crd.longitude,
      });
    });
  };

  useEffect(() => {}, []);
  return (
    <View className="relative h-screen w-full">
      <MapView
        mapPadding={{top: 50}}
        ref={mapRef}
        userLocationUpdateInterval={5000}
        onUserLocationChange={getUsersPosition}
        showsUserLocation
        showsMyLocationButton={true}
        followsUserLocation={true}
        className="w-full h-full"
        zoomEnabled={true}
        region={{
          latitude: challenge.startLatitude,
          longitude: challenge.startLongitude,
          latitudeDelta: 0.0522,
          longitudeDelta: 0.0321,
        }}
      >
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
            strokeWidth={3}
            strokeColor="hotpink"
            apikey={GOOGLE_MAPS_APIKEY}
            tappable={true}
            onPress={() => {
              console.log("Polyline pressed");
            }}
          />
        )}
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

        <ChallengeMarkerView
          color="orange"
          draggable={!challenge.startLatitude ? true : false}
          pinPosition={{
            latitude: challenge.startLatitude,
            longitude: challenge.startLongitude,
          }}
        />
        <ChallengeMarkerView
          type="finish"
          draggable={!challenge.finishLatitude ? true : false}
          pinPosition={{
            latitude: challenge.finishLatitude,
            longitude: challenge.finishLongitude,
          }}
        />
        {usersPosition && (
          <ChallengeMarkerView
            type="user"
            draggable={!challenge.finishLatitude ? true : false}
            pinPosition={usersPosition}
          />
        )}
      </MapView>
      <View className="absolute z-10 bottom-20">
        <ChallengeActiveInfo />
      </View>
    </View>
  );
};

export default ChallengeStartedView;
