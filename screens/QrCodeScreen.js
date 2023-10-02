import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Image,
} from "react-native";
import React, {useEffect, useRef, useState} from "react";
import {LinearGradient} from "expo-linear-gradient";
import {
  QrCodeIcon,
  UserPlusIcon,
  XMarkIcon,
} from "react-native-heroicons/outline";
import {useNavigation} from "@react-navigation/native";
import {getInfoAboutUser, sendFriendRequest} from "../utils/firebaseUtils";
import QRCode from "react-native-qrcode-svg";
import useAuth from "../hooks/useAuth";
import {BarCodeScanner} from "expo-barcode-scanner";
import auth from "@react-native-firebase/auth";
import ScannedFriendRequest from "../components/Profile/ScannedFriendRequest";
import {GestureHandlerRootView} from "react-native-gesture-handler";
import Toast from "../components/Shared/CustomToast";

const QrCodeScreen = () => {
  const navigation = useNavigation();
  const {user} = useAuth();
  const [hasPermission, setHasPermission] = useState(null);
  const [scanMode, setScanMode] = useState(false);
  const [profilePic, setProfilePic] = useState("");
  const [displayName, setDisplayName] = useState();
  const [scanned, setScanned] = useState(false);
  const [scanData, setScanData] = useState();
  const toastRef = useRef();

  const getProfilePictureAsync = async () => {
    try {
      const currentUserUid = auth().currentUser.uid;
      const userInfo = await getInfoAboutUser(currentUserUid);
      setProfilePic(userInfo.profileImgUrl);
      setDisplayName(`${userInfo.firstName} ${userInfo.lastName}`);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getProfilePictureAsync();
  }, []);

  useEffect(() => {
    (async () => {
      const {status} = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  const handleBarCodeScanned = ({type, data}) => {
    if (data.startsWith("/add ") && !scanned) {
      setScanned(true);
      setScanData(data);
    }
  };

  const renderCamera = () => {
    return (
      <>
        <View className="bg-black/75 items-center justify-center w-full py-3 rounded-t-xl mt-2">
          <Text className="text-white">Najedź na kod QR nowego znajomego!</Text>
        </View>
        <View className="h-full w-full relative ">
          {scanned && (
            <ScannedFriendRequest
              scanData={scanData}
              setScanned={setScanned}
              toastRef={toastRef}
            />
          )}
          <BarCodeScanner
            onBarCodeScanned={handleBarCodeScanned}
            className="flex-1 -mt-20"
          />
          <View className="absolute bottom-32 w-full items-center">
            <TouchableOpacity
              onPress={() => {
                setScanMode(false);
              }}
              className="border border-white bg-black p-4 rounded-full space-x-2 flex-row items-center justify-center"
            >
              <Text className="text-white">Pokaż mój kod</Text>
              <QrCodeIcon size={30} color="white" />
            </TouchableOpacity>
          </View>
        </View>
      </>
    );
  };

  if (hasPermission === false && scanMode) {
    return (
      <View className="h-full w-full items-center justify-center">
        <Text className="text-lg">Camera permission not granted</Text>
      </View>
    );
  }

  return (
    <GestureHandlerRootView>
      <Toast ref={toastRef} />

      <View className="h-full w-screen items-center justify-center">
        <View className="relative w-5/6 rounded-3xl h-3/4 overflow-hidden">
          <LinearGradient
            className="flex-1 rounded-3xl"
            start={{x: 0, y: 0}}
            end={{x: 1, y: 1}}
            colors={["#E5E7EB", "#9CA3AF", "#4B5563"]}
          >
            <View className="mt-4 flex-row items-center justify-center space-x-1">
              <Text className="font-bold text-center text-lg">Twój kod QR</Text>
              <UserPlusIcon size={30} color="black" />
            </View>

            <TouchableOpacity
              className="absolute z-20 bg-black/50 p-1 items-center justify-center rounded-full right-3 top-3"
              onPress={() => {
                navigation.goBack();
              }}
            >
              <XMarkIcon size={30} color="black" />
            </TouchableOpacity>
            {!scanMode ? (
              <View className="mt-3 items-center">
                <View className="bg-black/75 w-full py-3 rounded-t-xl">
                  <Text className="text-white px-2">
                    Twój znajomy może zeskanować ten kod, aby dodać Cię do
                    znajomych.
                  </Text>
                </View>
                <View className="items-center bg-black/50 w-full pt-3 rounded-b-xl">
                  <View className="mb-3 w-28 h-28 p-1 items-center justify-center rounded-full flex-row space-x-2">
                    {profilePic && (
                      <Image
                        style={{
                          borderColor: "gray",
                          borderWidth: 4,
                          borderRadius: 75,
                        }}
                        className="w-28 h-28 rounded-full"
                        source={{
                          uri: profilePic,
                        }}
                      />
                    )}
                    {displayName && (
                      <Text className="font-bold text-white">
                        {displayName}
                      </Text>
                    )}
                  </View>
                  <QRCode size={250} value={`/add ${user.email}`} />
                </View>

                <TouchableOpacity
                  onPress={() => {
                    setScanMode(true);
                  }}
                  className="border border-white mt-5 bg-black p-4 rounded-full space-x-2 flex-row items-center justify-center"
                >
                  <Text className="text-white">Zeskanuj znajomego</Text>
                  <QrCodeIcon size={30} color="white" />
                </TouchableOpacity>
              </View>
            ) : (
              renderCamera()
            )}
          </LinearGradient>
        </View>
      </View>
    </GestureHandlerRootView>
  );
};

export default QrCodeScreen;
