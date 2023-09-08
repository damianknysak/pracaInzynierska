import auth from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";
import {getInfoAboutUser} from "./firebaseUtils";
import {getAddressFromCoordinates} from "./mapsUtils";

export async function deleteChallenge(item, toastRef) {
  try {
    const docsRef = await firestore()
      .collection("Challenges")
      .where("creatorId", "==", item.creatorId)
      .where("date", "==", item.date)
      .where("distance", "==", item.distance)
      .limit(1)
      .get();
    await docsRef.docs[0].ref.delete();
    toastRef.current.show({
      type: "success",
      text: "Wyzwanie zostało usunięte",
      duration: 2000,
    });
  } catch (e) {
    toastRef.current.show({
      type: "error",
      text: "Błąd przy usuwaniu wyzwania",
      duration: 2000,
    });
    console.log(`Error while deleting challenge ${e}`);
  }
}

export async function getChallengesList() {
  try {
    const colRef = await firestore()
      .collection("Challenges")
      .where("creatorId", "==", auth().currentUser.uid)
      .orderBy("date")
      .limit(10)
      .get();

    const challenges = await Promise.all(
      colRef.docs.map(async (doc) => {
        let challengeObject = doc.data();
        challengeObject.id = doc.id;
        return challengeObject;
      })
    );

    return challenges.reverse();
  } catch (e) {
    console.log(`Error while getFriendsList ${e}`);
  }
}

export async function getFriendsChallengesList() {
  try {
    const friendsRef = await firestore()
      .collection("Users")
      .doc(auth().currentUser.uid)
      .collection("Friends")
      .get();
    const friendsIds = friendsRef.docs.map((doc) => doc.data().friendId);

    const challengesRef = await firestore()
      .collection("Challenges")
      .where("creatorId", "in", friendsIds)
      .orderBy("date")
      .limit(10)
      .get();

    const challenges = await Promise.all(
      challengesRef.docs.map(async (doc) => {
        let challengeObject = doc.data();
        let creator = await getInfoAboutUser(challengeObject.creatorId);
        challengeObject.id = doc.id;
        challengeObject.creator = creator;
        return challengeObject;
      })
    );

    return challenges.reverse();
  } catch (e) {
    console.log(`Error while getFriendsList ${e}`);
  }
}
