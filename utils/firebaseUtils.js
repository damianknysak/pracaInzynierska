import auth from "@react-native-firebase/auth";
import { firebase } from "@react-native-firebase/app";
import firestore from "@react-native-firebase/firestore";

export function subscribeToFriendRequests(callback) {
  const unsubscribe = firestore()
    .collection("Users")
    .doc(auth().currentUser.uid)
    .collection("friendRequests")
    .onSnapshot((querySnapshot) => {
      const friendRequests = [];
      querySnapshot.forEach((doc) => {
        friendRequests.push(doc.data());
      });
      callback(friendRequests);
    });

  // Return the unsubscribe function for cleaning up the subscription
  return () => unsubscribe();
}

const checkIfFriendIsAlreadyInFriendsList = async (getterUserId, friendId) => {
  try {
    const db = firebase.firestore();
    const usersRef = db.collection("Users");
    const docRef = usersRef.doc(getterUserId);
    const friendsCollectionRef = docRef.collection("Friends");
    const existingDocs = await friendsCollectionRef
      .where("friendId", "==", friendId)
      .get();

    return !existingDocs.empty;
  } catch (error) {
    console.error("Error while checking the existence of the document:", error);
    return false;
  }
};

const checkIfFriendAlreadyHasRequest = async (friendId) => {
  try {
    const db = firebase.firestore();
    const usersRef = db.collection("Users");
    const docRef = usersRef.doc(friendId);
    const friendsCollectionRef = docRef.collection("friendRequests");
    const existingDocs = await friendsCollectionRef
      .where("user_requested_email", "==", auth().currentUser.email)
      .get();
    return !existingDocs.empty;
  } catch (error) {
    console.error("Error while checking the existence of the document:", error);
    return false;
  }
};

async function deleteFriendRequest(friendRequestId) {
  try {
    const currentUserUid = auth().currentUser.uid;

    await firestore()
      .collection("Users")
      .doc(currentUserUid)
      .collection("friendRequests")
      .doc(friendRequestId)
      .delete();

    console.log(
      "Successfully deleted friend request with ID:",
      friendRequestId
    );
  } catch (error) {
    console.log("Error while deleting friend request:", error);
    throw error;
  }
}

export async function addUserToFriends(friendEmail) {
  try {
    const currentUserUid = auth().currentUser.uid;

    const querySnapshot = await firestore()
      .collection("Users")
      .where("email", "==", friendEmail)
      .limit(1)
      .get();
    if (querySnapshot.size === 0) {
      throw new Error("Friend with the provided email address not found");
    }

    const friendId = querySnapshot.docs[0].ref.id;

    const friendRequestCollectionDocs = await firestore()
      .collection("Users")
      .doc(currentUserUid)
      .collection("friendRequests")
      .get();

    const friendRequestId = friendRequestCollectionDocs._docs[0].ref.id;

    const updatedFriendRequest = await firestore()
      .collection("Users")
      .doc(currentUserUid)
      .collection("friendRequests")
      .doc(friendRequestId)
      .update({
        isConfirmed: true,
      });

    console.log("Successfully updated isConfirmed to true in the database");

    //checking if users may be already added to their friendsList
    const checkCurrentUser = await checkIfFriendIsAlreadyInFriendsList(
      currentUserUid,
      friendId
    );
    if (!checkCurrentUser) {
      const updatedUsersFriendList = await firestore()
        .collection("Users")
        .doc(currentUserUid)
        .collection("Friends")
        .add({
          friendId: friendId,
        });
    } else {
      console.log("Current user already has this friend in their friendsList");
    }

    const checkFriend = await checkIfFriendIsAlreadyInFriendsList(
      friendId,
      currentUserUid
    );

    if (!checkFriend) {
      const updatedFriendsFriendList = await firestore()
        .collection("Users")
        .doc(friendId)
        .collection("Friends")
        .add({
          friendId: currentUserUid,
        });
    } else {
      console.log(
        "This friend already has the current user in their friendsList"
      );
    }

    console.log("Successfully updated the friends list");

    //delete the friend request
    deleteFriendRequest(friendRequestId);
  } catch (error) {
    console.log(`Error while updating friends: ${error}`);
    throw error;
  }
}

export async function sendFriendRequest(email) {
  try {
    const currentUserUid = auth().currentUser.uid;

    const querySnapshot = await firestore()
      .collection("Users")
      .where("email", "==", email)
      .limit(1)
      .get();
    if (querySnapshot.size === 0) {
      throw new Error("Friend with the provided email address not found");
    }
    const friendId = querySnapshot.docs[0].ref.id;

    //check if he already is in friends list
    const checkCurrentUser = await checkIfFriendIsAlreadyInFriendsList(
      currentUserUid,
      friendId
    );
    if (!checkCurrentUser) {
      //check if he already has invitation
      const checkCurrentUserRequest = await checkIfFriendAlreadyHasRequest(
        friendId
      );

      if (!checkCurrentUserRequest) {
        await firestore()
          .collection("Users")
          .doc(friendId)
          .collection("friendRequests")
          .add({
            isConfirmed: false,
            user_requested_email: auth().currentUser.email,
          });
      } else {
        console.log("Already has invitation");
      }
    } else {
      console.log("Already in friends list");
    }
  } catch (error) {
    console.log(error);
  }
}
