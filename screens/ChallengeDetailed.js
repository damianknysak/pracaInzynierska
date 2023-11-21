import { View } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { useRoute } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import ChallengeStartedView from "../components/Maps/ChallengeStartedView";
import ChallengeDetailedDesc from "../components/Maps/ChallengeDetailedDesc";
import ChallengeDetailedBottomBtn from "../components/Maps/ChallengeDetailedBottomBtn";
import ChallengeUserDistanceInfo from "../components/Maps/ChallengeUserDistanceInfo";
import ChallengeDetailedHeader from "../components/Maps/ChallengeDetailedHeader";
import ChallengeFinishedInfo from "../components/Maps/ChallengeFinishedInfo";
import ChallengeStopwatch from "../components/Maps/ChallengeStopwatch";
import Toast from "../components/Shared/CustomToast";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import useChallengeLocation from "../hooks/useChallengeLocation";
import PermissionRequestView from "../components/Maps/PermissionRequestView";
const ChallengeDetailed = () => {
  // setting start date if challenge has started
  const [startChallengeDate, setStartChallengeDate] = useState();

  const [time, setTime] = useState({
    sec: 0,
    min: 0,
    hr: 0,
  });
  const [intervalId, setIntervalId] = useState();
  const METERS_TO_MAKE_CHALLENGE_READY = 70;
  const route = useRoute();
  const { challenge, isCurrentUsers } = route.params;
  const {
    usersPosition,
    setUsersPosition,
    startBackgroundUpdate,
    stopBackgroundUpdate,
    distanceToStart,
    distanceToFinish,
    challengeStarted,
    setChallengeStarted,
    challengeFinished,
    setChallengeFinished,
    finishChallengeDate,
    setFinishChallengeDate,
    checkLocationPermissions,
    requestLocationPermissions,
  } = useChallengeLocation(challenge, METERS_TO_MAKE_CHALLENGE_READY);
  const [isChallengeReadyToStart, setIsChallengeReadyToStart] = useState(false);
  const toastRef = useRef();

  const resetChallenge = () => {
    intervalId && clearInterval(intervalId);
    intervalId && setIntervalId(null);
    setTime({ sec: 0, min: 0, hr: 0 });
    challengeFinished && setChallengeFinished(false);
    challengeStarted && setChallengeStarted(false);
    setStartChallengeDate(null);
    setFinishChallengeDate(null);
  };
  const [distanceToStartString, setDistanceToStartString] = useState("");
  const [distanceToFinishString, setDistanceToFinishString] = useState("");

  useEffect(() => {
    if (usersPosition && distanceToStart && distanceToFinish) {
      if (distanceToStart.toFixed(3) * 1000 < METERS_TO_MAKE_CHALLENGE_READY) {
        setIsChallengeReadyToStart(true);
      } else {
        //do testów zakomentuj
        setIsChallengeReadyToStart(false);
      }
      distanceToStart < 1
        ? setDistanceToStartString(
            `${distanceToStart.toFixed(3) * 1000} metrów`
          )
        : setDistanceToStartString(`${distanceToStart.toFixed(2)} km`);

      distanceToFinish < 1
        ? setDistanceToFinishString(
            `${distanceToFinish.toFixed(3) * 1000} metrów`
          )
        : setDistanceToFinishString(`${distanceToFinish.toFixed(2)} km`);
    }
  }, [usersPosition]);

  useEffect(() => {
    return () => {
      // on component unmount
      stopBackgroundUpdate();
      intervalId && clearInterval(intervalId);
      intervalId && setIntervalId(null);
    };
  }, []);

  //if challenge is finished stop tracking users position
  useEffect(() => {
    if (challengeFinished) {
      stopBackgroundUpdate();
      clearInterval(intervalId);
    } else {
      startBackgroundUpdate();
    }
  }, [challengeFinished, hasLocationPermission]);

  useEffect(() => {
    if (challengeStarted) {
      setStartChallengeDate(Date.now());
    }
  }, [challengeStarted]);

  const [hasLocationPermission, setHasLocationPermission] = useState(false);

  useEffect(() => {
    const checkPermissions = async () => {
      const result = await checkLocationPermissions();
      setHasLocationPermission(result);
    };

    checkPermissions();
  }, []);

  return (
    <GestureHandlerRootView>
      <View className="relative h-full w-screen items-center justify-center">
        <Toast ref={toastRef} />
        <View className="absolute top-10 bottom-20 left-3 right-3 rounded-3xl overflow-hidden">
          <LinearGradient
            className="flex-1 rounded-3xl"
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            colors={["#E5E7EB", "#9CA3AF", "#4B5563"]}
          >
            <ChallengeDetailedHeader />
            {!hasLocationPermission ? (
              <PermissionRequestView
                requestLocationPermissions={requestLocationPermissions}
              />
            ) : (
              <>
                <View>
                  {!challengeStarted && !challengeFinished && (
                    <ChallengeDetailedDesc
                      isCurrentUsers={isCurrentUsers}
                      challenge={challenge}
                    />
                  )}
                  {challengeStarted && !challengeFinished && (
                    <ChallengeStopwatch
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
                        distanceToFinish={distanceToFinishString}
                        distanceToStart={distanceToStartString}
                      />

                      {/* Challenge start/stop btns */}
                      <ChallengeDetailedBottomBtn
                        challengeFinished={challengeFinished}
                        challengeStarted={challengeStarted}
                        setChallengeStarted={setChallengeStarted}
                        isChallengeReadyToStart={isChallengeReadyToStart}
                        resetChallenge={resetChallenge}
                      />
                    </>
                  )}
                  {challengeFinished && (
                    <ChallengeFinishedInfo
                      startChallengeDate={startChallengeDate}
                      finishChallengeDate={finishChallengeDate}
                      resetChallenge={resetChallenge}
                      time={time}
                      challenge={challenge}
                      toastRef={toastRef}
                    />
                  )}
                </View>
              </>
            )}
          </LinearGradient>
        </View>
      </View>
    </GestureHandlerRootView>
  );
};

export default ChallengeDetailed;
