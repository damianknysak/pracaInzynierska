import {View, Text, TouchableOpacity, ActivityIndicator} from "react-native";
import React, {useState} from "react";
import {BookmarkIcon} from "react-native-heroicons/outline";
import auth from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";
import {notifyFriends} from "../../utils/notifyUtils";
import {distance, getAddressFromCoordinates} from "../../utils/mapsUtils";

const SaveModal = ({challenge, onCancelPress, toastRef}) => {
  const getAddressAsync = async (item) => {
    try {
      const start = await getAddressFromCoordinates({
        latitude: item.startLatitude,
        longitude: item.startLongitude,
      });
      const finish = await getAddressFromCoordinates({
        latitude: item.finishLatitude,
        longitude: item.finishLongitude,
      });
      const startDN = start?.display_name;
      const finishDN = finish?.display_name;
      return {
        startAddress: startDN?.substring(0, startDN.indexOf(",")),
        finishAddress: finishDN?.substring(0, finishDN.indexOf(",")),
      };
    } catch (e) {
      console.log(`Failed to fetch address ${e}`);
    }
  };

  const [saving, setSaving] = useState(false);
  const saveChallenge = async () => {
    setSaving(true);
    try {
      const currentUserUid = auth().currentUser.uid;
      let dist;
      if (challenge.routeType == "straight") {
        dist = distance(
          {lat: challenge.startLatitude, lon: challenge.startLongitude},
          {lat: challenge.finishLatitude, lon: challenge.finishLongitude}
        );
      } else {
        dist = challenge.distance;
      }
      const {startAddress, finishAddress} = await getAddressAsync(challenge);

      const docRef = await firestore().collection("Challenges").add({
        creatorId: currentUserUid,
        startLongitude: challenge.startLongitude,
        startLatitude: challenge.startLatitude,
        finishLongitude: challenge.finishLongitude,
        finishLatitude: challenge.finishLatitude,
        routeType: challenge.routeType,
        startAddress: startAddress,
        finishAddress: finishAddress,
        transportType: challenge.transportType,
        date: firestore.FieldValue.serverTimestamp(),
        distance: dist,
      });

      notifyFriends("challengeAdd", docRef.id);
      toastRef.current.show({
        type: "success",
        text: "Wyzwanie zostało stworzone!",
        duration: 2000,
      });
    } catch (e) {
      toastRef.current.show({
        type: "error",
        text: "Błąd przy tworzeniu wyzwania!",
        duration: 2000,
      });
      console.log(e);
    }
    onCancelPress();
    setSaving(false);
  };

  return (
    <View className=" absolute z-10 bottom-2 left-2 right-2 rounded-xl bg-black/75 h-32">
      <Text className="text-white text-lg font-bold text-center my-2">
        Czy chcesz zapisać wyzwanie?
      </Text>
      <View className="flex-row justify-center space-x-5 ">
        <TouchableOpacity
          onPress={saveChallenge}
          className="flex-row items-center justify-center space-x-1 bg-white h-14 w-24 rounded-xl"
        >
          {saving ? (
            <ActivityIndicator size={25} color="lightgreen" />
          ) : (
            <BookmarkIcon size={25} color="black" />
          )}
          <Text className="font-bold">Zapisz</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={onCancelPress}
          className="flex-row items-center justify-center bg-white h-14 w-24 rounded-xl"
        >
          <Text className="font-bold">Anuluj</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default SaveModal;
