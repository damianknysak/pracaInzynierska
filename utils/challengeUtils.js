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

export const getUserPositionInLeaderboard = async (challengeId, time) => {
  try {
    const leaderboardRef = firestore()
      .collection("Challenges")
      .doc(challengeId)
      .collection("Leaderboard")
      .orderBy("time");

    const leaderboardSnapshot = await leaderboardRef.get();

    if (leaderboardSnapshot.empty) {
      console.log("Kolekcja Leaderboard jest pusta czyli nr 1.");
      return 1; // Jeśli pusta to pozycja pierwsza.
    } else {
      // Kolekcja Leaderboard istnieje, przekształć ją na tablicę.
      const leaderboardData = [];
      leaderboardSnapshot.forEach((doc) => {
        leaderboardData.push(doc.data());
      });

      // Sortuj tablicę względem czasu rosnąco.
      leaderboardData.sort((a, b) => a.time - b.time);
      console.log(leaderboardData);
      // Znajdź pozycję użytkownika w rankingu na podstawie czasu.
      let position = 1; // Domyślna wartość, jeśli użytkownik nie zostanie znaleziony.
      for (let i = 0; i < leaderboardData.length; i++) {
        console.log(
          `leaderboardData[i].time ${leaderboardData[i].time} <= time ${time} ${
            leaderboardData[i].time <= time
          }`
        );
        if (leaderboardData[i].time <= time) {
          position++; // Pozycja użytkownika w rankingu (indeks + 1).
        } else {
          break;
        }
      }

      console.log(`Pozycja użytkownika dla czasu ${time} sekund: ${position}`);
      return position;
    }
  } catch (e) {
    console.log(`Wystąpił błąd podczas pobierania danych z Leaderboard: ${e}`);
    throw e;
  }
};

export const getChallengesLeaderboard = async (challengeId) => {
  try {
    const leaderboardRef = firestore()
      .collection("Challenges")
      .doc(challengeId)
      .collection("Leaderboard")
      .orderBy("time")
      .limit(10);
    const leaderboardSnapshot = await leaderboardRef.get();

    if (leaderboardSnapshot.empty) {
      console.log("Kolekcja Leaderboard jest pusta.");
      return null; // Zwracamy pustą tablicę lub odpowiednią wartość w przypadku braku danych.
    } else {
      // Kolekcja Leaderboard istnieje, pobierz zawartość i zwróć ją.
      const leaderboardData = [];
      leaderboardSnapshot.forEach((doc) => {
        leaderboardData.push(doc.data());
      });
      console.log(leaderboardData);
      return leaderboardData;
    }
  } catch (e) {
    console.log(`Wystąpił błąd podczas pobierania danych z Leaderboard: ${e}`);
    throw e;
  }
};

export const addResultToChallengeLeaderboard = async (
  challengeId,
  time,
  toastRef
) => {
  try {
    const leaderboardRef = firestore()
      .collection("Challenges")
      .doc(challengeId)
      .collection("Leaderboard");

    const userId = auth().currentUser.uid;

    const leaderboardData = {
      userId: userId,
      time: time,
    };
    await leaderboardRef.add(leaderboardData);

    toastRef.current.show({
      type: "success",
      text: "Wynik został dodany!",
      duration: 2000,
    });

    console.log("Dane zostały dodane do kolekcji Leaderboard.");
    return true;
  } catch (e) {
    console.log(`Wystąpił błąd podczas dodawania danych do Leaderboard: ${e}`);
    toastRef.current.show({
      type: "error",
      text: "Błąd podczas dodawania wyniku!",
      duration: 2000,
    });
    return false;
  }
};
