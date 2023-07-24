import {
  View,
  ActivityIndicator,
  ScrollView,
  RefreshControl,
} from "react-native";
import React, { useEffect, useState } from "react";
import firestore from "@react-native-firebase/firestore";
import useAuth from "../../hooks/useAuth";
import ImageView from "./ImageView";
import ChallengeView from "./ChallengeView";
import { Text } from "react-native";
import { FaceFrownIcon } from "react-native-heroicons/outline";

const UserActivityView = () => {
  const { user } = useAuth();
  const [activityList, setActivityList] = useState();
  const fetchActivity = async () => {
    try {
      let limitOfContent = 20;
      const userDocumentImage = firestore()
        .collection("Users")
        .doc(user.uid)
        .collection("Images")
        .limit(15)
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
      if (combinedList.length > 20) {
        combinedList.splice(20);
      }
      setActivityList(combinedList);
    } catch (e) {
      console.log(`Błąd podczas pobierania aktywności: ${e}`);
    }
  };

  useEffect(() => {
    fetchActivity();
  }, []);

  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = () => {
    setRefreshing(true);
    setActivityList(null);
    fetchActivity();
    setRefreshing(false);
  };

  return (
    <ScrollView
      contentContainerStyle={{
        paddingBottom: 150,
      }}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {activityList ? (
        activityList.map((item, index) =>
          item.imgUrl ? (
            <ImageView key={index} item={item} />
          ) : (
            <ChallengeView key={index} item={item} />
          )
        )
      ) : (
        //if activityList loading
        <ActivityIndicator className="mt-52" size={50} color="white" />
      )}
      {activityList && activityList.length === 0 && (
        <View className="justify-center items-center">
          <Text className="text-white text-xl">
            Jeszcze nie miałeś żadnej aktywności
          </Text>
          <FaceFrownIcon size={40} color="orange" />
        </View>
      )}
    </ScrollView>
  );
};

export default UserActivityView;
