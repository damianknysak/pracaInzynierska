import auth from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";
import storage from "@react-native-firebase/storage";
import { notifyFriends } from "./notifyUtils";
import * as MediaLibrary from "expo-media-library";

export const deleteImage = async (imageUrl, toastRef) => {
  try {
    const currentUserUid = auth().currentUser.uid;
    const filename = imageUrl.substring(imageUrl.lastIndexOf("/") + 1);
    const docsRef = await firestore()
      .collection("Users")
      .doc(currentUserUid)
      .collection("Images")
      .where("imgUrl", "==", imageUrl)
      .limit(1)
      .get();

    await docsRef.docs[0].ref.delete();

    // delete from storage
    await storage()
      .ref(`UsersStorage/${currentUserUid}/cameraImages/${filename}`)
      .delete();
    toastRef.current.show({
      type: "success",
      text: "Zdjęcie zostało usunięte",
      duration: 2000,
    });
  } catch (e) {
    toastRef.current.show({
      type: "error",
      text: "Błąd przy usuwaniu zdjęcia",
      duration: 2000,
    });
    console.log(`Error while deleting image ${e}`);
  }
};

export const addImgToUser = async (
  image,
  locationStatus,
  positionGeocode,
  address,
  isPublic
) => {
  try {
    const currentUserUid = auth().currentUser.uid;
    const filename = image.substring(image.lastIndexOf("/") + 1);
    const latitude =
      locationStatus && positionGeocode ? positionGeocode.latitude : null;
    const longitude =
      locationStatus && positionGeocode ? positionGeocode.longitude : null;
    const curAddress = locationStatus && address ? address : null;
    const docRef = await firestore()
      .collection("Users")
      .doc(currentUserUid)
      .collection("Images")
      .add({
        isPublic: isPublic,
        imgUrl: filename,
        latitude: latitude || null,
        longitude: longitude || null,
        address: curAddress || null,
        date: firestore.FieldValue.serverTimestamp(),
      });
    //adding notifications
    isPublic && notifyFriends("imageAdd", docRef.id);
  } catch (error) {
    console.log(error);
  }
};

export const onSavePress = async (image, setDownloading, toastRef) => {
  if (image) {
    try {
      setDownloading(true);
      await MediaLibrary.createAssetAsync(image);
      toastRef.current.show({
        type: "success",
        text: "Zdjęcie zostało pobrane",
        duration: 2000,
      });
      setDownloading(false);
    } catch (error) {
      toastRef.current.show({
        type: "error",
        text: "Błąd przy pobieraniu zdjęcia",
        duration: 2000,
      });
      console.log(error);
    }
  }
};

export const onSaveCloudPress = async (
  image,
  locationStatus,
  positionGeocode,
  address,
  isPublic,
  setUploading,
  toastRef
) => {
  if (image) {
    try {
      setUploading(true);
      const currentUserUid = auth().currentUser.uid;
      const uri = image;
      const filename = uri.substring(uri.lastIndexOf("/") + 1);
      const uploadUri = uri;
      //check if already exists in storage
      const fileRefStorage = storage().ref(
        `UsersStorage/${currentUserUid}/cameraImages/${filename}`
      );
      const fileExistsStorage = await fileRefStorage
        .getDownloadURL()
        .then(() => true)
        .catch(() => false);
      //check if already exists in firestore
      const querySnapshot = await firestore()
        .collection("Users")
        .doc(currentUserUid)
        .collection("Images")
        .where("imgUrl", "==", filename)
        .get();

      const fileExistsDB = !querySnapshot.empty;

      if (fileExistsStorage || fileExistsDB) {
        toastRef.current.show({
          type: "warning",
          text: "Zdjęcie już zostało zapisane w chmurze",
          duration: 2000,
        });
      } else {
        //sending to storage
        const task = await storage()
          .ref(`UsersStorage/${currentUserUid}/cameraImages/${filename}`)
          .putFile(uploadUri);
        //adding image to user in DB
        addImgToUser(image, locationStatus, positionGeocode, address, isPublic);
        toastRef.current.show({
          type: "success",
          text: "Zdjęcie zostało zapisane w chmurze",
          duration: 2000,
        });
      }
    } catch (e) {
      toastRef.current.show({
        type: "error",
        text: "Błąd przy zapisywaniu zdjęcia w chmurze",
        duration: 2000,
      });
      console.error(e);
    }
    setUploading(false);
  }
};