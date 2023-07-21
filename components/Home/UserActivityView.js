import { View, Text, FlatList } from "react-native";
import React, { useEffect, useState } from "react";
import firestore from "@react-native-firebase/firestore";
import useAuth from "../../hooks/useAuth";
import ImageView from "./ImageView";
import ChallengeView from "./ChallengeView";

const UserActivityView = () => {
  const { user } = useAuth();
  const [activityList, setActivityList] = useState();
  const fetchActivity = async () => {
    try {
    } catch (e) {
      console.log(`Błąd podczas pobierania aktywności: ${e}`);
    }
    const userDocumentImage = firestore()
      .collection("Users")
      .doc(user.uid)
      .collection("Images")
      .limit(10)
      .orderBy("date");

    const querySnapshotImage = await userDocumentImage.get();
    //Desc order
    const imagesList = querySnapshotImage.docs
      .map((doc) => doc.data())
      .reverse();

    const userDocumentChallenge = firestore()
      .collection("Challenges")
      .where("creatorId", "==", user.uid)
      .limit(10)
      .orderBy("date");

    const querySnapshotChallenge = await userDocumentChallenge.get();
    const challengesList = querySnapshotChallenge.docs
      .map((doc) => doc.data())
      .reverse();

    // Combine imagesList and challengesList
    const combinedList = [...imagesList, ...challengesList];
    combinedList.sort((a, b) => b.date.seconds - a.date.seconds);
    setActivityList(combinedList);
  };

  useEffect(() => {
    fetchActivity();
  }, []);

  return (
    <View>
      {activityList ? (
        activityList.map((item, index) =>
          item.imgUrl ? (
            <ImageView key={index} item={item} />
          ) : (
            <ChallengeView key={index} item={item} />
          )
        )
      ) : (
        <Text>Brak aktywności do wyświetlenia.</Text>
      )}
    </View>
  );
};

export default UserActivityView;
