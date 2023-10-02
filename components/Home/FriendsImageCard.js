import {View, Text, Image, ActivityIndicator} from "react-native";
import React, {useEffect, useState} from "react";
import {MapPinIcon, PhotoIcon} from "react-native-heroicons/outline";
import moment from "moment";
import "moment/locale/pl";
import {imgURLToDownloadURL} from "../../utils/imageUtils";

const FriendsImageCard = ({item}) => {
  const [imageUrl, setImageUrl] = useState();

  const getImageAsync = async () => {
    const imgUrl = await imgURLToDownloadURL(
      item.image.imgUrl,
      item.activityCreator
    );
    setImageUrl(imgUrl);
  };

  useEffect(() => {
    getImageAsync();
  }, []);

  function shortenedAddressString(inputString) {
    const firstCommaIndex = inputString.indexOf(","); // Indeks pierwszego przecinka
    const secondCommaIndex = inputString.indexOf(",", firstCommaIndex + 1); // Indeks drugiego przecinka

    if (firstCommaIndex !== -1 && secondCommaIndex !== -1) {
      const result = inputString.substring(0, secondCommaIndex);
      return result;
    } else {
      return inputString;
    }
  }
  return (
    <View className="items-center bg-black/50 rounded-xl my-2">
      <View className="flex-row my-2 justify-between px-2 w-full items-center">
        <View className="flex-row items-center justify-center space-x-2">
          <Text className="text-white">{item.activityCreatorName}</Text>
          <Image
            className="w-10 h-10 rounded-full"
            source={{uri: item.activityCreatorProfileImgUrl}}
          />
        </View>

        <Text className="text-white">
          {moment(item.image.date.toDate()).fromNow()}
        </Text>
      </View>

      {imageUrl ? (
        <>
          <Image
            className="relative w-full aspect-square"
            source={{uri: imageUrl}}
          />

          <View className="absolute bottom-8 w-full bg-black/75 h-10 flex-row space-x-2 items-center justify-center">
            {item.image.address ? (
              <>
                <MapPinIcon size={25} color="lightgreen" />
                <Text className="text-white">
                  {shortenedAddressString(item.image.address)}
                </Text>
              </>
            ) : (
              <></>
            )}
          </View>
        </>
      ) : (
        <View className="w-full aspect-square bg-black/50 rounded"></View>
      )}
    </View>
  );
};

export default FriendsImageCard;
