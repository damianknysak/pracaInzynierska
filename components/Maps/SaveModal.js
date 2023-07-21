import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import React, { useState } from "react";
import { BookmarkIcon } from "react-native-heroicons/outline";
import auth from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";

const SaveModal = ({ challenge, onCancelPress }) => {
  function distance(coords1, coords2) {
    const R = 6371e3; // metres
    const φ1 = (coords1.lat * Math.PI) / 180; // φ, λ in radians
    const φ2 = (coords2.lat * Math.PI) / 180;
    const Δφ = ((coords2.lat - coords1.lat) * Math.PI) / 180;
    const Δλ = ((coords2.lon - coords1.lon) * Math.PI) / 180;

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return (R * c) / 1000; // in metres
  }
  const [saving, setSaving] = useState(false);
  const saveChallenge = async () => {
    setSaving(true);
    try {
      const currentUserUid = auth().currentUser.uid;
      let dist;
      if (challenge.routeType == "straight") {
        dist = distance(
          { lat: challenge.startLatitude, lon: challenge.startLongitude },
          { lat: challenge.finishLatitude, lon: challenge.finishLongitude }
        );
      } else {
        dist = challenge.distance;
      }
      await firestore().collection("Challenges").add({
        creatorId: currentUserUid,
        startLongitude: challenge.startLongitude,
        startLatitude: challenge.startLatitude,
        finishLongitude: challenge.finishLongitude,
        finishLatitude: challenge.finishLatitude,
        routeType: challenge.routeType,
        date: firestore.FieldValue.serverTimestamp(),
        distance: dist,
      });
    } catch (e) {
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
