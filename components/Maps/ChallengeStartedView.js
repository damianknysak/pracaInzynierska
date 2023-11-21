import React, { useEffect, useRef, useState } from "react";
import MapView, { Polygon } from "react-native-maps";
import MapViewDirections from "react-native-maps-directions";
import ChallengeMarkerView from "./ChallengeMarkerView";
import { GOOGLE_MAPS_APIKEY } from "../../utils/mapsUtils";

const ChallengeStartedView = ({
  challenge,
  usersPosition,
  setUsersPosition,
  challengeStarted,
}) => {
  const mapRef = useRef(null);
  const [region, setRegion] = useState({
    latitude: 0,
    longitude: 0,
  });

  const [followUserLocation, setFollowUserLocation] = useState(true);

  const userLocationChanged = (event) => {
    const newRegion = event.nativeEvent.coordinate;
    setUsersPosition({
      latitude: newRegion.latitude,
      longitude: newRegion.longitude,
    });
    setRegion((prevRegion) => ({
      ...prevRegion,
      latitude: newRegion.latitude,
      longitude: newRegion.longitude,
    }));

    animateToRegion();
  };

  const animateToRegion = () => {
    if (mapRef.current) {
      mapRef.current.animateToRegion(region, 1000);
    }
  };

  const regionChanged = (event) => {
    setRegion({
      latitude: event.latitude,
      longitude: event.longitude,
    });
  };

  const onDrag = (event) => {
    setFollowUserLocation(false);
  };

  useEffect(() => {
    if (usersPosition) {
      setRegion(usersPosition);
    }
  }, [usersPosition]);

  return (
    <MapView
      className="w-full h-full"
      zoomEnabled={true}
      initialRegion={{
        latitude: challenge.startLatitude,
        longitude: challenge.startLongitude,
        latitudeDelta: 0.05,
        longitudeDelta: 0.0421,
      }}
      showsUserLocation
      showsMyLocationButton={false}
      loadingEnabled
      onUserLocationChange={(event) => {
        if (challengeStarted) {
          return followUserLocation && userLocationChanged(event);
        }
      }}
      onRegionChange={regionChanged}
      followUserLocation={() => {
        if (challengeStarted) {
          return followUserLocation;
        }
      }}
      ref={mapRef}
      onMoveShouldSetResponder={onDrag}
      key="mapa"
    >
      {challenge.routeType == "straight" && (
        <Polygon
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
          strokeWidth={6}
          strokeColor="hotpink"
          apikey={GOOGLE_MAPS_APIKEY}
          tappable={true}
        />
      )}
      <ChallengeMarkerView
        type="start"
        color="red"
        draggable={false}
        pinPosition={{
          latitude: challenge.startLatitude,
          longitude: challenge.startLongitude,
        }}
      />
      <ChallengeMarkerView
        type="finish"
        draggable={false}
        color="lightgreen"
        pinPosition={{
          latitude: challenge.finishLatitude,
          longitude: challenge.finishLongitude,
        }}
      />
      {usersPosition && (
        <ChallengeMarkerView
          type="user"
          draggable={false}
          pinPosition={{
            latitude: usersPosition.latitude,
            longitude: usersPosition.longitude,
          }}
        />
      )}
    </MapView>
  );
};

export default ChallengeStartedView;
