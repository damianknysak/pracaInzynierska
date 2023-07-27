import {
  View,
  Text,
  BackHandler,
  ActivityIndicator,
  FlatList,
  Image,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import useAuth from "../hooks/useAuth";
import firestore from "@react-native-firebase/firestore";
import storage from "@react-native-firebase/storage";
import { useRef } from "react";
import { LinearGradient } from "react-native-svg";
import { PhotoIcon } from "react-native-heroicons/outline";
import PhotoProps from "../components/Gallery/PhotoProps";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Toast from "../components/Shared/CustomToast";

const GalleryScreen = () => {
  const width = Dimensions.get("window").width;

  const [loading, setLoading] = useState(false);
  const [galleryArray, setGalleryArray] = useState([]);

  const navigation = useNavigation();
  const { user } = useAuth();

  const [refreshGalleryArray, setRefreshGalleryArray] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        navigation.navigate("Camera"); //if done like that it goes back Home
      };

      const subscription = BackHandler.addEventListener(
        "hardwareBackPress",
        onBackPress
      );

      return () => subscription.remove();
    }, [true])
  );

  const imgURLToDownloadURL = async (img) => {
    const currentUserUid = user.uid;
    const reference = storage().ref(
      `UsersStorage/${currentUserUid}/cameraImages/${img.imgUrl}`
    );
    return await reference.getDownloadURL();
  };

  const getUserImages = async () => {
    try {
      setLoading(true);

      const userDocument = firestore()
        .collection("Users")
        .doc(user.uid)
        .collection("Images")
        .orderBy("date", "desc");

      const querySnapshot = await userDocument.get();
      const imagesList = querySnapshot.docs.map((doc) => doc.data());

      const updatedImagesList = await Promise.all(
        imagesList.map(async (img) => {
          const newURL = await imgURLToDownloadURL(img);
          img.downloadUrl = newURL;

          return img;
        })
      );
      setGalleryArray(updatedImagesList);

      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  useEffect(() => {
    if (refreshGalleryArray || galleryArray.length == 0) {
      getUserImages();
      setRefreshGalleryArray(false);
    }
  }, [refreshGalleryArray]);

  const topRef = useRef();
  const thumbRef = useRef();
  const [activeIndex, setActiveIndex] = useState(0);

  const setScrollActiveIndex = (index) => {
    setActiveIndex(index);
    topRef?.current?.scrollToOffset({
      offset: index * width,
      animated: true,
    });
    //image size 80px spacing 8px
    //is the middle of the thumbNail greater than middle of screen
    //index * (IMAGE_SIZE + SPACING) - IMAGE_SIZE / 2 > width / 2
    if (index * 88 - 40 > width / 2) {
      thumbRef?.current?.scrollToOffset({
        offset: index * 88 - width / 2 + 40,
        animated: true,
      });
    }
    //below half of screen
    else {
      thumbRef?.current?.scrollToOffset({
        offset: 0,
        animated: true,
      });
    }
  };
  const renderItemFullScreen = ({ item }) => {
    return (
      <View className="w-screen h-100vh">
        <PhotoProps
          refreshSetter={setRefreshGalleryArray}
          item={item}
          toastRef={toastRef}
        />
        <Image
          style={[StyleSheet.absoluteFillObject]}
          source={{ uri: item.downloadUrl }}
        />
      </View>
    );
  };

  const renderItemBottomList = ({ item, index }) => {
    return (
      <TouchableOpacity
        onPress={() => setScrollActiveIndex(index)}
        className={`${
          index == activeIndex ? "border border-gray-200" : ""
        } rounded-xl mr-2`}
      >
        <Image
          className="w-20 h-20 rounded-xl"
          source={{ uri: item.downloadUrl }}
        />
      </TouchableOpacity>
    );
  };
  const toastRef = useRef();
  return (
    <GestureHandlerRootView>
      <Toast ref={toastRef} />
      <View className="h-full w-screen justify-center items-center bg-black/50">
        {loading ? (
          <ActivityIndicator
            className="absolute z-10 top-0 bottom-0 left-0 right-0 m-auto"
            size={60}
            color="white"
          />
        ) : (
          <>
            {galleryArray.length ? (
              <>
                <FlatList
                  data={galleryArray}
                  renderItem={renderItemFullScreen}
                  keyExtractor={(item) => item.imgUrl}
                  horizontal
                  pagingEnabled
                  showsHorizontalScrollIndicator={false}
                  ref={topRef}
                  onMomentumScrollEnd={(ev) => {
                    setScrollActiveIndex(
                      Math.floor(ev.nativeEvent.contentOffset.x / width)
                    );
                  }}
                />
                <FlatList
                  className="absolute bottom-10"
                  contentContainerStyle={{ paddingHorizontal: 8 }}
                  data={galleryArray}
                  renderItem={renderItemBottomList}
                  keyExtractor={(item) => item.imgUrl}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  ref={thumbRef}
                />
              </>
            ) : (
              <View className="items-center">
                <PhotoIcon size={100} color="white" />
                <Text className=" text-3xl">Galeria jest pusta</Text>
              </View>
            )}
          </>
        )}
      </View>
    </GestureHandlerRootView>
  );
};

export default GalleryScreen;
