import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import React, { useState } from "react";
import moment from "moment";
import "moment/locale/pl";
import {
  ArrowTrendingUpIcon,
  FireIcon,
  MapPinIcon,
} from "react-native-heroicons/outline";
import ChallengeProps from "./ChallengeProps";

const ChallengeView = ({ item, toastRef, onRefresh }) => {
  const [toBeDeleted, setToBeDeleted] = useState(false);

  return (
    <>
      {toBeDeleted || (
        <View className="items-center bg-black/50 rounded-xl my-2">
          <ChallengeProps
            item={item}
            toastRef={toastRef}
            setDelete={setToBeDeleted}
            refreshSetter={onRefresh}
          />
          <View className="flex-row space-x-1 items-center justify-center my-2 ">
            <FireIcon size={25} color="orange" />
            <Text className="text-white">
              Dodałeś wyzwanie {moment(item.date.toDate()).fromNow()}
            </Text>
          </View>
          <View className="flex-row items-center justify-center space-x-2 mb-3">
            <MapPinIcon size={25} color="lightgreen" />
            {item.startAddress == item.finishAddress ? (
              <Text className="text-white">
                Start/Meta:{" "}
                {item.startAddress || (
                  <ActivityIndicator size={18} color="white" />
                )}
              </Text>
            ) : (
              <View>
                <Text className="text-white">
                  Start:{" "}
                  {item.startAddress || (
                    <ActivityIndicator size={18} color="white" />
                  )}
                </Text>
                <Text className="text-white">
                  Meta:{" "}
                  {item.finishAddress || (
                    <ActivityIndicator size={18} color="white" />
                  )}
                </Text>
              </View>
            )}
          </View>
          <View className="flex-row space-x-2 items-center  mb-3">
            <ArrowTrendingUpIcon size={25} color="white" />
            <Text className="text-white">
              Dystans:{" "}
              {item.distance < 1
                ? `${item.distance.toFixed(3) * 1000} m`
                : `${item.distance.toFixed(2)} km`}
            </Text>
          </View>
          <TouchableOpacity className="bg-orange-400 px-3 py-2 mb-3 rounded-xl">
            <Text className="text-white font-bold">Przejdź do wyzwania</Text>
          </TouchableOpacity>
        </View>
      )}
    </>
  );
};

export default ChallengeView;
