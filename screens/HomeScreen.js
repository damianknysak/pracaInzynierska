import {View, Text, ScrollView, RefreshControl} from "react-native";
import React, {useState} from "react";
import {Image, TouchableOpacity} from "react-native";
import useAuth from "../hooks/useAuth";
import {SafeAreaView} from "react-native-safe-area-context";
import {StatusBar} from "expo-status-bar";
import {LinearGradient} from "expo-linear-gradient";
import MainMenu from "../components/Home/MainMenu";
import Header from "../components/Home/Header";
import PopularPlaces from "../components/Home/PopularPlaces";
import {useNavigation} from "@react-navigation/native";
import UserActivityView from "../components/Home/UserActivityView";
import {useEffect} from "react";
import useNotification from "../hooks/useNotification";
import useHomeActivity from "../hooks/useHomeActivity";
import {GestureHandlerRootView} from "react-native-gesture-handler";
import {useRef} from "react";
import Toast from "../components/Shared/CustomToast";
import {Alert} from "react-native";
import messaging from "@react-native-firebase/messaging";
import axios from "axios";

const HomeScreen = () => {
  const [headerMenu, setHeaderMenu] = useState("friends");
  const {getCurrentUserInfoDB} = useAuth();
  const [currentUser, setCurrentUser] = useState();
  const navigation = useNavigation();
  const {notificationsList} = useNotification();
  const {activityList, fetchActivity} = useHomeActivity();
  const [scrollEnabled, setScrollEnabled] = useState(true);
  if (!currentUser) {
    getCurrentUserInfoDB()
      .then((tego) => {
        setCurrentUser(tego);
      })
      .catch((error) => {
        setCurrentUser({firstName: null});
        console.log(error);
      });
  }

  useEffect(() => {
    if (headerMenu == "me") {
      setScrollEnabled(false);
    } else {
      setScrollEnabled(true);
    }
  }, [headerMenu]);
  const toastRef = useRef();

  // const asynctest = async () => {
  //   await messaging().registerDeviceForRemoteMessages();
  //   const token = await messaging().getToken();
  //   console.log(token);
  // };

  // useEffect(() => {
  //   asynctest();
  //   const unsubscribe = messaging().onMessage(async (remoteMessage) => {
  //     Alert.alert("A new FCM message arrived!");
  //     console.log(JSON.stringify(remoteMessage));
  //   });
  //   return unsubscribe;
  // }, []);

  // const sendNotification = async () => {
  //   const FCM_ENDPOINT =
  //     "https://fcm.googleapis.com/v1/projects/damianinzynierka/messages:send";
  //   const serverKey = "b0e71f03f07f05da9380414199da3576a48d05a0";
  //   const deviceToken =
  //     "fdz9bBgASpa3vk-VlHsUey:APA91bG_n8DV5VVeeOCsYxnZSWdDeyYEHScRsI5bcCJDOWCWcoxWB7Z720xsFp2guBLPZJwZzCOwAPtzBbJpuHJBAkrq9Vuml-wSUr8pBj68yid_1-5oWC8q4MCpQNtT1PR7Zcjk9d3F"; // Tu wstaw token urządzenia

  //   const notification = {
  //     message: {
  //       token: deviceToken,
  //       notification: {
  //         title: "Tytuł powiadomienia",
  //         body: "Treść powiadomienia",
  //       },
  //     },
  //   };

  //   try {
  //     await axios.post(FCM_ENDPOINT, notification, {
  //       headers: {
  //         Authorization: `Bearer ${serverKey}`,
  //         "Content-Type": "application/json",
  //       },
  //     });
  //     console.log("Powiadomienie wysłane!");
  //   } catch (error) {
  //     console.error("Błąd wysyłki powiadomienia:", error);
  //   }
  // };

  return (
    <GestureHandlerRootView>
      <Toast ref={toastRef} />
      <View className="h-full w-screen">
        <StatusBar
          barStyle="light-content"
          translucent
          backgroundColor="transparent"
        />
        <LinearGradient
          className="flex-1"
          start={{x: 0, y: 0}}
          end={{x: 1, y: 1}}
          colors={["#374151", "#111827"]}
        >
          <SafeAreaView className="h-screen">
            <View>
              <ScrollView
                //because user activity screen could scroll header
                scrollEnabled={scrollEnabled}
                contentContainerStyle={{
                  paddingBottom: 60,
                }}
                showsVerticalScrollIndicator={false}
              >
                <Header
                  headerMenu={headerMenu}
                  setHeaderMenu={setHeaderMenu}
                  navigation={navigation}
                  userName={currentUser?.firstName}
                  notificationsList={notificationsList}
                />
                {headerMenu == "friends" && (
                  <>
                    <MainMenu />
                    <PopularPlaces />
                    <TouchableOpacity
                      onPress={() => {
                        navigation.navigate("Test");
                      }}
                    >
                      <Text className="text-xl text-red-500">
                        Go to Test Screen
                      </Text>
                    </TouchableOpacity>
                  </>
                )}
              </ScrollView>
              {headerMenu == "me" && (
                <UserActivityView
                  toastRef={toastRef}
                  activityList={activityList}
                  fetchActivity={fetchActivity}
                />
              )}
            </View>
          </SafeAreaView>
        </LinearGradient>
      </View>
    </GestureHandlerRootView>
  );
};

export default HomeScreen;
