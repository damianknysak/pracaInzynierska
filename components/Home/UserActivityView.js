import {
  View,
  ActivityIndicator,
  ScrollView,
  RefreshControl,
  Image,
} from "react-native";
import React, {useEffect, useRef, useState} from "react";
import ImageView from "./ImageView";
import ChallengeView from "./ChallengeView";
import {Text} from "react-native";
import {FaceFrownIcon} from "react-native-heroicons/outline";
import {GestureHandlerRootView} from "react-native-gesture-handler";
import Toast from "../Shared/CustomToast";

const UserActivityView = ({activityList, fetchActivity, toastRef}) => {
  const [refreshing, setRefreshing] = React.useState(false);
  const onRefresh = () => {
    setRefreshing(true);
    fetchActivity();
    setRefreshing(false);
  };

  return (
    <ScrollView
      className="-mt-8"
      contentContainerStyle={{
        paddingBottom: 200,
      }}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {activityList ? (
        activityList.map((item, index) =>
          item.imgUrl ? (
            <ImageView
              toastRef={toastRef}
              onRefresh={onRefresh}
              key={index}
              item={item}
            />
          ) : (
            <ChallengeView
              toastRef={toastRef}
              onRefresh={onRefresh}
              key={index}
              item={item}
            />
          )
        )
      ) : (
        //if activityList loading
        <ActivityIndicator className="mt-52" size={50} color="white" />
      )}
      {activityList && activityList.length === 0 && (
        <View className="justify-center items-center mt-20 space-y-10">
          <Text className="text-white text-2xl">Brak aktywności</Text>
          <Image
            className="w-40 h-40"
            source={require("../../assets/myAssets/no-results.png")}
          />
        </View>
      )}
    </ScrollView>
  );
};

export default UserActivityView;
