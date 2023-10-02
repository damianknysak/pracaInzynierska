import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Image,
} from "react-native";
import React, {useEffect, useState} from "react";
import {UserPlusIcon, XCircleIcon} from "react-native-heroicons/outline";
import {
  getInfoAboutUserFromEmail,
  sendFriendRequest,
} from "../../utils/firebaseUtils";
import useAuth from "../../hooks/useAuth";

const ScannedFriendRequest = ({setScanned, scanData, toastRef}) => {
  const [friendInfo, setFriendInfo] = useState();
  const {user} = useAuth();
  const FRIEND_EMAIL = scanData.substring(5);
  const getInfoAboutUserFromEmailAsync = async () => {
    const response = await getInfoAboutUserFromEmail(FRIEND_EMAIL);
    if (response && response.email != user.email) {
      setFriendInfo(response);
    } else {
      setScanned(false);
    }
  };

  useEffect(() => {
    getInfoAboutUserFromEmailAsync();
  }, []);

  const handleFriendRequestAsync = async () => {
    const response = await sendFriendRequest(FRIEND_EMAIL, toastRef);
    if (response) {
      setScanned(false);
    }
  };
  return (
    <View className="absolute w-full h-full items-center justify-center z-10">
      <View className="bg-black/75 p-3 mb-20 w-full">
        <Text className="text-white text-lg text-center">
          Zeskanowano znajomego
        </Text>
        <View className="h-40 items-center justify-center">
          {friendInfo ? (
            <View>
              <Image
                style={{
                  borderColor: "gray",
                  borderWidth: 4,
                  borderRadius: 75,
                }}
                className="w-28 h-28 rounded-full"
                source={{
                  uri: friendInfo.profileImgUrl,
                }}
              />
              <Text className="font-bold text-white text-center">
                {friendInfo.firstName + " " + friendInfo.lastName}
              </Text>
            </View>
          ) : (
            <ActivityIndicator size={30} color="white" />
          )}
        </View>
        <View className="flex-row justify-between px-10">
          <TouchableOpacity
            onPress={handleFriendRequestAsync}
            className="flex-row space-x-1 p-4 bg-black border border-white rounded-full"
          >
            <Text className="text-white">Dodaj</Text>
            <UserPlusIcon size={25} color="lightgreen" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              setScanned(false);
            }}
            className="flex-row space-x-1 p-4 bg-black border border-white rounded-full"
          >
            <Text className="text-white">Anuluj</Text>
            <XCircleIcon size={25} color="red" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default ScannedFriendRequest;
