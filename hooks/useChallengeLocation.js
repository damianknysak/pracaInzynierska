import React, {useEffect, useState} from "react";
import {StyleSheet, Text, View, Button} from "react-native";

import * as TaskManager from "expo-task-manager";
import * as Location from "expo-location";
import {distance} from "../utils/mapsUtils";
import {schedulePushNotification} from "../utils/localNotification";

const LOCATION_TASK_NAME = "LOCATION_TASK_NAME";

const useChallengeLocation = (
  challenge,
  METERS_TO_MAKE_CHALLENGE_READY = 50
) => {
  // Define position state: {latitude: number, longitude: number}
  const [usersPosition, setUsersPosition] = useState(null);
  const [distanceToStart, setDistanceToStart] = useState();
  const [distanceToFinish, setDistanceToFinish] = useState();
  const [challengeStarted, setChallengeStarted] = useState(false);
  const [challengeFinished, setChallengeFinished] = useState(false);
  const [finishChallengeDate, setFinishChallengeDate] = useState();

  const [isNotificationScheduled, setIsNotificationScheduled] = useState(false);
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

  // Define the background task for location tracking
  TaskManager.defineTask(LOCATION_TASK_NAME, async ({data, error}) => {
    if (error) {
      console.error(error);
      return;
    }

    if (data) {
      // Extract location coordinates from data
      const {locations} = data;
      const location = locations[0];
      if (location) {
        setUsersPosition(location.coords);
        if (challenge && usersPosition) {
          setDistanceToStart(calculateDistanceToStart());
          setDistanceToFinish(calculateDistanceToFinish());

          if (
            challengeStarted &&
            distanceToFinish * 1000 < METERS_TO_MAKE_CHALLENGE_READY
          ) {
            //make sure notifications only is sent once
            isNotificationScheduled || schedulePushNotification();
            setIsNotificationScheduled(true);
            // finish challenge
            console.log(`Challenge Finished At: ${distanceToFinish * 1000}`);
            setChallengeFinished(true);
            //make sure date only set once
            if (!finishChallengeDate) {
              setFinishChallengeDate(Date.now());
            }
          }
        }
      }
    }
  });

  // Request permissions right after starting the app
  useEffect(() => {
    const requestPermissions = async () => {
      const foreground = await Location.requestForegroundPermissionsAsync();
      if (foreground.granted)
        await Location.requestBackgroundPermissionsAsync();
    };
    requestPermissions();
  }, []);

  // Start location tracking in background
  const startBackgroundUpdate = async () => {
    setIsNotificationScheduled(false);
    console.log("location tracking started");
    // Don't track position if permission is not granted
    const {granted} = await Location.getBackgroundPermissionsAsync();
    if (!granted) {
      console.log("location tracking denied");
      return;
    }

    // Make sure the task is defined otherwise do not start tracking
    const isTaskDefined = await TaskManager.isTaskDefined(LOCATION_TASK_NAME);
    if (!isTaskDefined) {
      console.log("Task is not defined");
      return;
    }

    // Don't track if it is already running in background
    const hasStarted = await Location.hasStartedLocationUpdatesAsync(
      LOCATION_TASK_NAME
    );
    if (hasStarted) {
      console.log("Already started");
      return;
    }

    await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
      // For better logs, we set the accuracy to the most sensitive option
      accuracy: Location.Accuracy.BestForNavigation,
      timeInterval: 3000,
      // Make sure to enable this notification if you want to consistently track in the background
      showsBackgroundLocationIndicator: true,
      foregroundService: {
        notificationTitle: "Our Trip",
        notificationBody:
          "Lokalizujemy twoje położenie, bo bierzesz udział w wyzwaniu!",
        notificationColor: "#fff",
      },
    });
  };

  // Stop location tracking in background
  const stopBackgroundUpdate = async () => {
    const hasStarted = await Location.hasStartedLocationUpdatesAsync(
      LOCATION_TASK_NAME
    );
    if (hasStarted) {
      await Location.stopLocationUpdatesAsync(LOCATION_TASK_NAME);
      console.log("Location tracking stopped");
    }
  };

  return {
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
  };
};

export default useChallengeLocation;
