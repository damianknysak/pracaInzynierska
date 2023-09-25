import {View} from "react-native";
import React, {useEffect, useRef, useState} from "react";
import MapView, {Polyline} from "react-native-maps";
import Geolocation from "@react-native-community/geolocation";
import Toast from "../components/Shared/CustomToast";
import ChallengeMarkerView from "../components/Maps/ChallengeMarkerView";
import ChallengeButton from "../components/Maps/ChallengeButton";
import ChallengeBottomBar from "../components/Maps/ChallengeBottomBar";
import ConfirmChallengeModal from "../components/Maps/ConfirmChallengeModal";
import MapViewDirections from "react-native-maps-directions";
import SaveModal from "../components/Maps/SaveModal";
import {GestureHandlerRootView} from "react-native-gesture-handler";
import NearbyActivityButton from "../components/Maps/NearbyActivityButton";
import NearbyActivityInfo from "../components/Maps/NearbyActivityInfo";
import NearbyActivityMarkers from "../components/Maps/NearbyActivityMarkers";
const MapsScreen = () => {
  const [nearbyActivity, setNearbyActivity] = useState(false);
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
  const GOOGLE_MAPS_APIKEY = "AIzaSyAcRStPFc7CQTBjWLRnMqkEbviZ0kxS5NY";
  const toastRef = useRef();
  const [nearbyMarkersList, setNearbyMarkersList] = useState();
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
    <GestureHandlerRootView>
      <View className="relative h-full w-screen bg-red-100">
        <Toast ref={toastRef} />
        <ChallengeButton
          color={challenge.active ? "lightgreen" : "orange"}
          onChallengePress={onChallengePress}
        />
        <NearbyActivityButton
          nearbyActivity={nearbyActivity}
          setNearbyActivity={setNearbyActivity}
        />
        {!challenge.active && nearbyActivity && (
          <NearbyActivityInfo
            nearbyMarkersList={nearbyMarkersList}
            setNearbyMarkersList={setNearbyMarkersList}
          />
        )}

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
          googleMapRoutePress={(transportType) => {
            setChallenge((prevState) => ({
              ...prevState,
              routeType: "google",
              transportType: transportType,
            }));
            setConfirmationModalActive(false);
          }}
          geodesicRoutePress={(transportType) => {
            setChallenge((prevState) => ({
              ...prevState,
              routeType: "straight",
              transportType: transportType,
            }));
            setConfirmationModalActive(false);
          }}
        />
        {challenge.routeType && (
          <SaveModal
            toastRef={toastRef}
            challenge={challenge}
            onCancelPress={resetChallengeValues}
          />
        )}

        <MapView
          className="w-full h-full"
          zoomEnabled={true}
          region={{
            latitude: position.latitude,
            longitude: position.longitude,
            latitudeDelta: 0.0522,
            longitudeDelta: 0.0421,
          }}
          onRegionChange={(e) => {
            challenge.setStart || setPinStart(e);
            challenge.setFinish || setPinFinish(e);
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
              type="finish"
              draggable={!challenge.finishLatitude ? true : false}
              color="lightgreen"
              pinPosition={pinFinish}
              setPinPosition={setPinFinish}
            />
          )}
          {nearbyActivity && <NearbyActivityMarkers list={nearbyMarkersList} />}
        </MapView>
      </View>
    </GestureHandlerRootView>
  );
};

export default MapsScreen;
