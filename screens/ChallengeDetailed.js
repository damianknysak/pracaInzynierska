import {View} from "react-native";
import React, {useEffect, useRef, useState} from "react";
import {useRoute} from "@react-navigation/native";
import {LinearGradient} from "expo-linear-gradient";
import ChallengeStartedView from "../components/Maps/ChallengeStartedView";
import ChallengeDetailedDesc from "../components/Maps/ChallengeDetailedDesc";
import Geolocation from "@react-native-community/geolocation";
import {distance} from "../utils/mapsUtils";
import ChallengeDetailedBottomBtn from "../components/Maps/ChallengeDetailedBottomBtn";
import ChallengeUserDistanceInfo from "../components/Maps/ChallengeUserDistanceInfo";
import ChallengeDetailedHeader from "../components/Maps/ChallengeDetailedHeader";
import ChallengeFinishedInfo from "../components/Maps/ChallengeFinishedInfo";
import ChallengeStopwatch from "../components/Maps/ChallengeStopwatch";
import Toast from "../components/Shared/CustomToast";
import {GestureHandlerRootView} from "react-native-gesture-handler";
import {schedulePushNotification} from "../utils/localNotification";

const ChallengeDetailed = () => {
  const METERS_TO_MAKE_CHALLENGE_READY = 50;
  const route = useRoute();
  const {challenge, isCurrentUsers} = route.params;
  const [usersPosition, setUsersPosition] = useState();
  const [distanceToStart, setDistanceToStart] = useState();
  const [distanceToFinish, setDistanceToFinish] = useState();
  const [isChallengeReadyToStart, setIsChallengeReadyToStart] = useState(false);
  const [challengeStarted, setChallengeStarted] = useState(false);
  const [challengeFinished, setChallengeFinished] = useState(false);
  const [time, setTime] = useState({
    sec: 0,
    min: 0,
    hr: 0,
  });
  const [intervalId, setIntervalId] = useState();
  const toastRef = useRef();
  const resetChallenge = () => {
    intervalId && clearInterval(intervalId);
    setTime({sec: 0, min: 0, hr: 0});
    challengeFinished && setChallengeFinished(false);
    challengeStarted && setChallengeStarted(false);
  };
  const [isNotificationScheduled, setIsNotificationScheduled] = useState(false);

  const getUsersPosition = () => {
    Geolocation.getCurrentPosition(
      (pos) => {
        const crd = pos.coords;
        setUsersPosition({
          latitude: crd.latitude,
          longitude: crd.longitude,
        });
      },
      (error) => console.error(error),
      {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000}
    );
  };

  const calculateDistanceToStart = () => {
    const dist = distance(
      {lat: usersPosition.latitude, lon: usersPosition.longitude},
      {lat: challenge.startLatitude, lon: challenge.startLongitude}
    );
    return dist;
  };

  const calculateDistanceToFinish = () => {
    const dist = distance(
      {lat: usersPosition.latitude, lon: usersPosition.longitude},
      {lat: challenge.finishLatitude, lon: challenge.finishLongitude}
    );
    return dist;
  };
  useEffect(() => {
    getUsersPosition();
  }, []);

  useEffect(() => {
    if (usersPosition) {
      //do usunięcia
      setIsChallengeReadyToStart(true);
      // do usunięcia
      setTimeout(() => {
        challengeStarted && setChallengeFinished(true);
        isNotificationScheduled || schedulePushNotification();
        setIsNotificationScheduled(true);
        //do usunięcia
      }, 5000);

      const dist = calculateDistanceToStart();
      if (dist.toFixed(3) * 1000 < METERS_TO_MAKE_CHALLENGE_READY) {
        setIsChallengeReadyToStart(true);
      }
      dist < 1
        ? setDistanceToStart(`${dist.toFixed(3) * 1000} metrów`)
        : setDistanceToStart(`${dist.toFixed(2)} km`);

      const distFinish = calculateDistanceToFinish();
      if (distFinish.toFixed(3) * 1000 < METERS_TO_MAKE_CHALLENGE_READY) {
        challengeStarted && setChallengeFinished(true);
        // isNotificationScheduled || schedulePushNotification();
        // setIsNotificationScheduled(true);
      }
      distFinish < 1
        ? setDistanceToFinish(`${distFinish.toFixed(3) * 1000} metrów`)
        : setDistanceToFinish(`${distFinish.toFixed(2)} km`);
    }
  }, [usersPosition]);

  useEffect(() => {
    if (challengeFinished) {
      clearInterval(intervalId);
    }
  }, [challengeFinished]);

  return (
    <GestureHandlerRootView>
      <View className="relative h-full w-screen items-center justify-center">
        <Toast ref={toastRef} />
        <View className="absolute top-10 bottom-20 left-3 right-3 rounded-3xl overflow-hidden">
          <LinearGradient
            className="flex-1 rounded-3xl"
            start={{x: 0, y: 0}}
            end={{x: 1, y: 1}}
            colors={["#E5E7EB", "#9CA3AF", "#4B5563"]}
          >
            <ChallengeDetailedHeader />

            <View>
              {!challengeStarted && !challengeFinished && (
                <ChallengeDetailedDesc
                  isCurrentUsers={isCurrentUsers}
                  challenge={challenge}
                />
              )}
              {challengeStarted && !challengeFinished && (
                <ChallengeStopwatch
                  challengeFinished={challengeFinished}
                  challengeStarted={challengeStarted}
                  time={time}
                  setTime={setTime}
                  intervalId={intervalId}
                  setIntervalId={setIntervalId}
                />
              )}

              {/* MapViews */}
              <ChallengeStartedView
                challenge={challenge}
                usersPosition={usersPosition}
                setUsersPosition={setUsersPosition}
                challengeStarted={challengeStarted}
              />
              {!challengeFinished && (
                <>
                  {/* How far away from the start/finish */}
                  <ChallengeUserDistanceInfo
                    challengeStarted={challengeStarted}
                    isChallengeReadyToStart={isChallengeReadyToStart}
                    distanceToFinish={distanceToFinish}
                    distanceToStart={distanceToStart}
                  />

                  {/* Challenge start/stop btns */}
                  <ChallengeDetailedBottomBtn
                    challengeFinished={challengeFinished}
                    challengeStarted={challengeStarted}
                    setChallengeStarted={setChallengeStarted}
                    isChallengeReadyToStart={isChallengeReadyToStart}
                  />
                </>
              )}
              {challengeFinished && (
                <ChallengeFinishedInfo
                  resetChallenge={resetChallenge}
                  time={time}
                  challenge={challenge}
                  toastRef={toastRef}
                />
              )}
            </View>
          </LinearGradient>
        </View>
      </View>
    </GestureHandlerRootView>
  );
};

export default ChallengeDetailed;
