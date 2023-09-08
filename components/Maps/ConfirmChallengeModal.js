import {
  View,
  Text,
  TouchableWithoutFeedback,
  TouchableOpacity,
  Image,
} from "react-native";
import React, {useEffect, useState} from "react";
import {
  ArrowTrendingUpIcon,
  ExclamationCircleIcon,
  MapIcon,
} from "react-native-heroicons/outline";

const ConfirmChallengeModal = ({
  isActive,
  setIsActive,
  googleMapRoutePress,
  geodesicRoutePress,
}) => {
  const [isChallengeByFoot, setIsChallengeByFoot] = useState(false);
  const [isChallengeByBike, setIsChallengeByBike] = useState(false);

  const [areAllElementsFilled, setAreAllElementsFilled] = useState(true);
  return (
    <>
      {isActive && (
        <>
          <View className="absolute z-30 left-2 right-2 rounded-xl top-1/3 bg-black/90 p-3">
            {areAllElementsFilled || (
              <View className="flex-row space-x-1 items-center justify-center">
                <ExclamationCircleIcon size={30} color="red" />
                <Text className="text-red-600 font-bold ">
                  Wybierz rower lub spacer
                </Text>
              </View>
            )}
            <Text className="text-center font-bold text-white my-2">
              Jak zamierzasz pokonać trasę?
            </Text>
            <View className="flex-row w-full justify-around">
              <TouchableOpacity
                onPress={() => {
                  if (isChallengeByFoot && !isChallengeByBike)
                    setIsChallengeByFoot(false);
                  setIsChallengeByBike(!isChallengeByBike);
                }}
                className={`w-32 h-32 ${
                  !isChallengeByBike ? "bg-gray-500" : "bg-white"
                } rounded-xl items-center justify-center`}
              >
                <Image
                  className="h-20 aspect-square"
                  source={require("../../assets/myAssets/bicycle.png")}
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  if (isChallengeByBike && !isChallengeByFoot)
                    setIsChallengeByBike(false);
                  setIsChallengeByFoot(!isChallengeByFoot);
                }}
                className={`w-32 h-32 ${
                  !isChallengeByFoot ? "bg-gray-500" : "bg-white"
                } rounded-xl items-center justify-center`}
              >
                <Image
                  className="h-20 aspect-square"
                  source={require("../../assets/myAssets/walk.png")}
                />
              </TouchableOpacity>
            </View>
            <Text className="text-center text-white font-bold my-2">
              Rodzaj trasy
            </Text>
            <View className="flex-1 justify-around space-y-2">
              <TouchableOpacity
                onPress={() => {
                  if (isChallengeByBike || isChallengeByFoot) {
                    isChallengeByBike && googleMapRoutePress("bike");
                    isChallengeByFoot && googleMapRoutePress("foot");
                  } else {
                    setAreAllElementsFilled(false);
                  }
                }}
                className="bg-white flex-row justify-center space-x-2 items-center py-3 rounded-xl border border-black"
              >
                <MapIcon size={25} color="black" />
                <Text className="text-center">
                  Trasa wyzwania z Google Maps
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  if (isChallengeByBike || isChallengeByFoot) {
                    isChallengeByBike && geodesicRoutePress("bike");
                    isChallengeByFoot && geodesicRoutePress("foot");
                  } else {
                    setAreAllElementsFilled(false);
                  }
                }}
                className="bg-white flex-row justify-center space-x-2 items-center py-3 rounded-xl border border-black"
              >
                <ArrowTrendingUpIcon size={25} color="black" />
                <Text className="text-center">Trasa niestandardowa</Text>
              </TouchableOpacity>
            </View>
          </View>
          <TouchableWithoutFeedback
            onPressIn={() => {
              setIsActive(false);
            }}
          >
            <View className="absolute w-screen h-full z-20" />
          </TouchableWithoutFeedback>
        </>
      )}
    </>
  );
};

export default ConfirmChallengeModal;
