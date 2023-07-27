import { useEffect, useState } from "react";
import { createContext, useContext } from "react";
import useAuth from "./useAuth";
import firestore from "@react-native-firebase/firestore";
import { getAddressFromCoordinates } from "../utils/mapsUtils";

const HomeActivityContext = createContext({});

export const HomeActivityProvider = ({ children }) => {
  const { user } = useAuth();
  const [activityList, setActivityList] = useState();

  const getAddressAsync = async (item) => {
    try {
      const start = await getAddressFromCoordinates({
        latitude: item.startLatitude,
        longitude: item.startLongitude,
      });
      const finish = await getAddressFromCoordinates({
        latitude: item.finishLatitude,
        longitude: item.finishLongitude,
      });
      const startDN = start?.display_name;
      const finishDN = finish?.display_name;
      return {
        startAddress: startDN?.substring(0, startDN.indexOf(",")),
        finishAddress: finishDN?.substring(0, finishDN.indexOf(",")),
      };
    } catch (e) {
      console.log(`Failed to fetch address ${e}`);
    }
  };

  const fetchActivity = async () => {
    try {
      let limitOfContent = 20;
      const userDocumentImage = firestore()
        .collection("Users")
        .doc(user.uid)
        .collection("Images")
        .limit(15)
        .orderBy("date");

      const querySnapshotImage = await userDocumentImage.get();
      //Desc order
      const imagesList = querySnapshotImage.docs
        .map((doc) => doc.data())
        .reverse();

      const userDocumentChallenge = firestore()
        .collection("Challenges")
        .where("creatorId", "==", user.uid)
        .limit(10)
        .orderBy("date");

      const querySnapshotChallenge = await userDocumentChallenge.get();
      const challengesList = querySnapshotChallenge.docs
        .map((doc) => doc.data())
        .reverse();

      // Combine imagesList and challengesList
      const combinedList = [...imagesList, ...challengesList];
      combinedList.sort((a, b) => b.date.seconds - a.date.seconds);
      if (combinedList.length > 20) {
        combinedList.splice(20);
      }
      const promises = combinedList.map(async (element) => {
        //if is of type challenge type
        if (element.startLatitude) {
          const { startAddress, finishAddress } = await getAddressAsync(
            element
          );
          return {
            ...element,
            startAddress: startAddress,
            finishAddress: finishAddress,
          };
        } else {
          return element;
        }
      });
      const combinedListWithAddresses = await Promise.all(promises);

      setActivityList(combinedListWithAddresses);
    } catch (e) {
      console.log(`Błąd podczas pobierania aktywności: ${e}`);
    }
  };

  useEffect(() => {
    fetchActivity();
  }, []);
  return (
    <HomeActivityContext.Provider
      value={{
        activityList,
        fetchActivity,
      }}
    >
      {children}
    </HomeActivityContext.Provider>
  );
};

export default function useHomeActivity() {
  return useContext(HomeActivityContext);
}
