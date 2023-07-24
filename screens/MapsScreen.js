import { View, Text, Image, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import MapView, { Callout, Marker, Polyline } from "react-native-maps";
import Geolocation from "@react-native-community/geolocation";
import UserMarkerView from "../components/Maps/UserMarkerView";
import ChallengeMarkerView from "../components/Maps/ChallengeMarkerView";
import ChallengeButton from "../components/Maps/ChallengeButton";
import ChallengeBottomBar from "../components/Maps/ChallengeBottomBar";
import ConfirmChallengeModal from "../components/Maps/ConfirmChallengeModal";
import MapViewDirections from "react-native-maps-directions";
import SaveModal from "../components/Maps/SaveModal";
const MapsScreen = () => {
  const [position, setPosition] = useState({
    latitude: 50.3318456,
    longitude: 18.0296002,
  });
  const [challenge, setChallenge] = useState({
    active: false,
    setStart: false,
    setFinish: false,
    startLongitude: null,
    startLatitude: null,
    finishLongitude: null,
    finishLatitude: null,
    routeType: null,
  });

  const [pinStart, setPinStart] = useState({});
  const [pinFinish, setPinFinish] = useState({});
  const [confirmationModalActive, setConfirmationModalActive] = useState(false);
  const origin = { latitude: 37.3318456, longitude: -122.0296002 };
  const destination = { latitude: 37.771707, longitude: -122.4053769 };
  const GOOGLE_MAPS_APIKEY = "AIzaSyAcRStPFc7CQTBjWLRnMqkEbviZ0kxS5NY";
  const [toBeSaved, setToBeSaved] = useState(false);

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
        setPinStart({
          latitude: crd.latitude,
          longitude: crd.longitude,
        });
        setPinFinish({
          latitude: crd.latitude,
          longitude: crd.longitude,
        });
      });
    } catch (err) {
      console.log(err);
    }
  }, []);

  const resetChallengeValues = () => {
    setChallenge({
      active: false,
      setStart: false,
      setFinish: false,
      startLongitude: null,
      startLatitude: null,
      finishLongitude: null,
      finishLatitude: null,
      routeType: null,
    });
  };

  const onChallengePress = () => {
    if (!challenge.active) {
      setChallenge((prevState) => ({
        ...prevState,
        active: !prevState.active,
        setStart: true,
      }));
    } else {
      resetChallengeValues();
    }
  };

  const onSetChallengePress = () => {
    if (challenge.setStart && !challenge.setFinish) {
      setChallenge((prevState) => ({
        ...prevState,
        startLongitude: pinStart.longitude,
        startLatitude: pinStart.latitude,
        setFinish: true,
      }));
    }
    if (challenge.setFinish) {
      setChallenge((prevState) => ({
        ...prevState,
        finishLongitude: pinFinish.longitude,
        finishLatitude: pinFinish.latitude,
      }));
      setConfirmationModalActive(true);
    }
  };

  return (
    <View className="relative h-full w-screen bg-red-100">
      <ChallengeButton
        color={challenge.active ? "lightgreen" : "orange"}
        onChallengePress={onChallengePress}
      />
      {challenge.active && !challenge.routeType && (
        <ChallengeBottomBar
          start={challenge.setStart}
          finish={challenge.setFinish}
          onSetPress={onSetChallengePress}
        />
      )}

      <ConfirmChallengeModal
        isActive={confirmationModalActive}
        setIsActive={setConfirmationModalActive}
        googleMapRoutePress={() => {
          setChallenge((prevState) => ({
            ...prevState,
            routeType: "google",
          }));
          setConfirmationModalActive(false);
        }}
        geodesicRoutePress={() => {
          setChallenge((prevState) => ({
            ...prevState,
            routeType: "straight",
          }));
          setConfirmationModalActive(false);
        }}
      />
      {challenge.routeType && (
        <SaveModal challenge={challenge} onCancelPress={resetChallengeValues} />
      )}

      <MapView
        className="w-full h-full"
        zoomEnabled={true}
        region={{
          latitude: position.latitude,
          longitude: position.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
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
            onReady={(result) => {
              setChallenge((prevState) => ({
                ...prevState,
                distance: result.distance,
              }));
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

        {challenge.setStart && (
          <ChallengeMarkerView
            color="orange"
            draggable={!challenge.startLatitude ? true : false}
            pinPosition={pinStart}
            setPinPosition={setPinStart}
          />
        )}
        {challenge.setFinish && (
          <ChallengeMarkerView
            draggable={!challenge.finishLatitude ? true : false}
            color="lightgreen"
            pinPosition={pinFinish}
            setPinPosition={setPinFinish}
          />
        )}
      </MapView>
    </View>
  );
};

export default MapsScreen;
