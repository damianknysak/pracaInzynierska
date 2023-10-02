import {
  View,
  Text,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
  Image,
} from "react-native";
import React, {useEffect} from "react";
import useHomeActivity from "../../hooks/useHomeActivity";
import FriendsImageCard from "./FriendsImageCard";
import FriendsChallengeCard from "./FriendsChallengeCard";

const FriendsActivityView = () => {
  const {
    fetchFriendsActivity,
    friendsActivityList,
    friendsActivityListPending,
  } = useHomeActivity();

  return (
    <ScrollView
      className="-mt-8"
      contentContainerStyle={{
        paddingBottom: 200,
      }}
      refreshControl={
        <RefreshControl
          refreshing={friendsActivityListPending}
          onRefresh={fetchFriendsActivity}
        />
      }
    >
      {friendsActivityList ? (
        friendsActivityList.map((item) => {
          const key =
            item.activityType == "image"
              ? "key: " + item.image.imgUrl
              : "key: " + item.challenge.id;
          return (
            <View key={key}>
              {item.activityType == "image" ? (
                <FriendsImageCard item={item} />
              ) : (
                <FriendsChallengeCard item={item} />
              )}
            </View>
          );
        })
      ) : (
        //if activityList loading
        <ActivityIndicator className="mt-52" size={50} color="white" />
      )}
      {friendsActivityList && friendsActivityList.length === 0 && (
        <View className="justify-center items-center mt-20 space-y-10">
          <Text className="text-white text-2xl">Brak aktywności znajomych</Text>
          <Image
            className="w-40 h-40"
            source={require("../../assets/myAssets/no-results.png")}
          />
        </View>
      )}
    </ScrollView>
  );
};

export default FriendsActivityView;
