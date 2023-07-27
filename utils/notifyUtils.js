import auth from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";

export async function notifyFriends(notificationType, actionId) {
  try {
    const friendListSnapshot = await firestore()
      .collection("Users")
      .doc(auth().currentUser.uid)
      .collection("Friends")
      .get();

    const friendIds = friendListSnapshot.docs.map((doc) => doc.data().friendId);

    friendIds.forEach(async (friendId) => {
      await firestore()
        .collection("Users")
        .doc(friendId)
        .collection("Notifications")
        .add({
          notificationType: notificationType,
          actionId: actionId,
          date: firestore.FieldValue.serverTimestamp(),
          creatorId: auth().currentUser.uid,
        });
    });
    console.log("Notifications sent to friends");
  } catch (e) {
    console.log(e);
  }
}

export function subscribeToNotifications(callback) {
  const currentUserUid = auth().currentUser.uid;

  const unsubscribe = firestore()
    .collection("Users")
    .doc(currentUserUid)
    .collection("Notifications")
    .orderBy("date", "desc")
    .onSnapshot((querySnapshot) => {
      const notificationsList = [];
      querySnapshot.forEach((doc) => {
        notificationsList.push(doc.data());
      });
      callback(notificationsList);
    });

  return unsubscribe;
}

export async function deleteNotification(notification) {
  try {
    const docRef = await firestore()
      .collection("Users")
      .doc(auth().currentUser.uid)
      .collection("Notifications")
      .where("creatorId", "==", notification.creatorId)
      .where("actionId", "==", notification.actionId)
      .limit(1)
      .get();

    if (!docRef.empty) {
      await docRef.docs[0].ref.delete();
    }
  } catch (e) {
    console.log(`Error while deleting notification ${e}`);
  }
}
