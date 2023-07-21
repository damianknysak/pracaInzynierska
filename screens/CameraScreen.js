import { View, Text, Image, Alert } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import * as MediaLibrary from "expo-media-library";
import { Camera, CameraType } from "expo-camera";
import TakePictureButton from "../components/Camera/TakePictureButton";
import auth from "@react-native-firebase/auth";
import storage from "@react-native-firebase/storage";
import GoBackButton from "../components/Camera/GoBackButton";
import BottomPanel from "../components/Camera/BottomPanel";
import FlashButton from "../components/Camera/FlashButton";
import SwitchCameraButton from "../components/Camera/SwitchCameraButton";
import { FlipType, manipulateAsync, SaveFormat } from "expo-image-manipulator";
import firestore from "@react-native-firebase/firestore";
import GalleryButton from "../components/Camera/GalleryButton";
import PropertySwitches from "../components/Camera/PropertySwitches";
import Geolocation from "@react-native-community/geolocation";
import { getAddressFromCoordinates } from "../utils/mapsUtils";
import BottomInfo from "../components/Camera/BottomInfo";

const CameraScreen = () => {
  const [hasCameraPermission, setHasCameraPermission] = useState(null);
  const [image, setImage] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);
  const [flash, setFlash] = useState(Camera.Constants.FlashMode.off);
  const [ratio, setRatio] = useState("20:9");
  const [uploading, setUploading] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [locationStatus, setLocationStatus] = useState(true);
  const [isPublic, setIsPublic] = useState(true);
  const [positionGeocode, setPositionGeocode] = useState();
  const [address, setAddress] = useState();

  const cameraRef = useRef(null);
  async function firstConfiguration() {
    try {
      MediaLibrary.requestPermissionsAsync();
      const cameraStatus = await Camera.requestCameraPermissionsAsync();
      setHasCameraPermission(cameraStatus.status === "granted");
      const ratios = await cameraRef.current.getSupportedRatiosAsync();

      if (ratios.indexOf("20:9") < 0) {
        setRatio("16:9");
      }

      Geolocation.getCurrentPosition((pos) => {
        const crd = pos.coords;
        setPositionGeocode({
          latitude: crd.latitude,
          longitude: crd.longitude,
        });
        console.log(`curr: lat ${crd.latitude} lon ${crd.longitude}`);
      });
    } catch (e) {
      console.log(`First configuration fail: ${e}`);
    }
  }
  useEffect(() => {
    firstConfiguration();
  }, []);

  const getAddress = async () => {
    try {
      const findAddress = await getAddressFromCoordinates({
        latitude: positionGeocode.latitude,
        longitude: positionGeocode.longitude,
      });

      setAddress(findAddress?.display_name);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (positionGeocode && !address) {
      getAddress();
    }
  }, [positionGeocode]);

  const addImgToUser = async () => {
    try {
      const currentUserUid = auth().currentUser.uid;
      const filename = image.substring(image.lastIndexOf("/") + 1);
      const latitude = locationStatus ? positionGeocode.latitude : null;
      const longitude = locationStatus ? positionGeocode.longitude : null;
      const curAddress = locationStatus ? address : null;
      await firestore()
        .collection("Users")
        .doc(currentUserUid)
        .collection("Images")
        .add({
          isPublic: isPublic,
          imgUrl: filename,
          latitude: latitude,
          longitude: longitude,
          address: curAddress,
          date: firestore.FieldValue.serverTimestamp(),
        });
    } catch (error) {
      console.log(error);
    }
  };

  async function takePicture() {
    if (cameraRef) {
      try {
        const data = await cameraRef.current.takePictureAsync();
        console.log(data);
        if (type === CameraType.front) {
          let photo = await manipulateAsync(
            data.localUri || data.uri,
            [{ rotate: 180 }, { flip: FlipType.Vertical }],
            { compress: 1, format: SaveFormat.JPEG }
          );
          setImage(photo.uri);
        } else {
          setImage(data.uri);
        }
      } catch (error) {
        console.log(error);
      }
    }
  }

  async function onSavePress() {
    if (image) {
      try {
        setDownloading(true);
        await MediaLibrary.createAssetAsync(image);
        setDownloading(false);
      } catch (error) {
        console.log(error);
      }
    }
  }

  async function onSaveCloudPress() {
    if (image) {
      try {
        setUploading(true);
        const currentUserUid = auth().currentUser.uid;
        //sending to storage
        const uri = image;
        const filename = uri.substring(uri.lastIndexOf("/") + 1);
        const uploadUri = uri;
        const task = await storage()
          .ref(`UsersStorage/${currentUserUid}/cameraImages/${filename}`)
          .putFile(uploadUri);
        //adding image to user in DB
        addImgToUser();
      } catch (e) {
        console.error(e);
      }
      setUploading(false);
    }
  }

  if (hasCameraPermission === false) {
    return (
      <View className="h-full w-screen justify-center align-center">
        <Text>No access to camera</Text>
      </View>
    );
  }

  return (
    <View className="h-full w-screen relative">
      {!image ? (
        <View
          className={`w-full aspect-${ratio === "20:9" ? "[9/20]" : "[9/16]"}`}
        >
          <Camera
            className="w-full h-full"
            type={type}
            flashMode={flash}
            ref={cameraRef}
            ratio={ratio}
          >
            <SwitchCameraButton
              onPressFunc={() => {
                setType(
                  type == CameraType.back ? CameraType.front : CameraType.back
                );
              }}
            />
            <FlashButton
              curFlashState={flash}
              onPressFunc={() => {
                setFlash(
                  flash === Camera.Constants.FlashMode.off
                    ? Camera.Constants.FlashMode.on
                    : Camera.Constants.FlashMode.off
                );
              }}
            />
            <TakePictureButton takePicture={takePicture} />
            <GalleryButton />
          </Camera>
        </View>
      ) : (
        <>
          <GoBackButton
            onPressFunc={() => {
              setImage(null);
              setDownloading(false);
              setUploading(false);
            }}
          />
          <View
            className={`w-full aspect-${
              ratio === "20:9" ? "[9/20]" : "[9/16]"
            }`}
          >
            <Image className="w-full h-full" source={{ uri: image }} />
          </View>
          <BottomInfo
            address={address}
            isPublic={isPublic}
            locationStatus={locationStatus}
          />

          <PropertySwitches
            isPublic={isPublic}
            locationStatus={locationStatus}
            onEyePress={() => {
              setIsPublic(!isPublic);
            }}
            onLocationPress={() => {
              setLocationStatus(!locationStatus);
            }}
          />
          <BottomPanel
            downloading={downloading}
            uploading={uploading}
            onSavePress={onSavePress}
            onSaveCloudPress={onSaveCloudPress}
          />
        </>
      )}
    </View>
  );
};

export default CameraScreen;
