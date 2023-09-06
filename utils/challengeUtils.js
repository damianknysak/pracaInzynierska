import auth from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";

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
      .get();
    const challenges = colRef.docs
      .map((doc) => {
        let challengeObject = doc.data();
        challengeObject.id = doc.id;
        return challengeObject;
      })
      .reverse();

    return challenges;
  } catch (e) {
    console.log(`Error while getFriendsList ${e}`);
  }
}
