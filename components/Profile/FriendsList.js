import {View, Text, Image} from "react-native";
import React, {useEffect} from "react";

const FriendsList = ({list}) => {
  return (
    <View>
      {list.map((user) => (
        <View
          className="bg-gray-800 rounded-3xl mx-2 my-1 px-2 py-1"
          key={user.email}
        >
          <View className="flex-row items-center">
            <Image
              className="w-14 h-14 rounded-full mr-2"
              source={{uri: user.profileImgUrl}}
            />
            <View style={{maxWidth: "70%"}}>
              <Text style={{color: "tomato"}} className="font-bold">
                {user.firstName + " " + user.lastName}
              </Text>
              <Text className="text-white text-xs">{user.email}</Text>
            </View>
          </View>
        </View>
      ))}
    </View>
  );
};

export default FriendsList;
