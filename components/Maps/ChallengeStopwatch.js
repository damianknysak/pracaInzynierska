import {View, Text, TouchableOpacity} from "react-native";
import React, {useEffect, useState} from "react";
import {ClockIcon} from "react-native-heroicons/outline";
import {secondsToTimeObject, timeObjectToSeconds} from "../../utils/timeUtils";

const ChallengeStopwatch = ({time, setTime, intervalId, setIntervalId}) => {
  const [startChallenge, setStartChallenge] = useState(Date.now());
  const start = () => {
    if (!intervalId) {
      let id = setInterval(updateTimer, 1000);
      setIntervalId(id);
    }
  };
  const updateTimer = () => {
    console.log("updateTimer called");
    setStartChallenge(Math.floor((Date.now() - startChallenge) / 1000));
    setTime((prev) => {
      let newTime = {...prev};
      // update sec and see if we need to increase min
      if (newTime.sec < 59) newTime.sec += 1;
      else {
        newTime.min += 1;
        newTime.sec = 0;
      }
      // min has increased in *newTime* by now if it was updated, see if it has crossed 59
      if (newTime.min === 60) {
        newTime.min = 0;
        newTime.hr += 1;
      }

      return newTime;
    });
  };

  useEffect(() => {
    start();
  }, []);
  // to make minimized counting work without counting in background
  useEffect(() => {
    if (
      startChallenge != timeObjectToSeconds(time) &&
      startChallenge < 1695225439
    ) {
      setTime(secondsToTimeObject(startChallenge));
    }
  }, [startChallenge]);

  return (
    <TouchableOpacity className="absolute bottom-36 py-2 px-2 items-center w-full z-10 flex-row bg-black/75 space-x-2">
      <ClockIcon color="lightblue" size={30} />
      <Text className="text-white">Czas wyzwania:</Text>
      <Text className="text-white text-lg font-bold">{`${
        time.hr < 10 ? 0 : ""
      }${time.hr} : ${time.min < 10 ? 0 : ""}${time.min} : ${
        time.sec < 10 ? 0 : ""
      }${time.sec}`}</Text>
    </TouchableOpacity>
  );
};

export default ChallengeStopwatch;
