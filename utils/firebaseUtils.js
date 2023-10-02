import auth from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";
import storage from "@react-native-firebase/storage";

const checkIfFriendIsAlreadyInFriendsList = async (getterUserId, friendId) => {
  try {
    const existingDocs = await firestore()
      .collection("Users")
      .doc(getterUserId)
      .collection("Friends")
      .where("friendId", "==", friendId)
      .get();

    return !existingDocs.empty;
  } catch (error) {
    console.error("Error checkIfFriendIsAlreadyInFriendsList:", error);
    return false;
  }
};

const checkIfFriendAlreadyHasRequest = async (friendId) => {
  try {
    const notificationType = "friendRequest";
    const friendRequests = await firestore()
      .collection("Users")
      .doc(friendId)
      .collection("Notifications")
      .where("notificationType", "==", notificationType)
      .where("creatorId", "==", auth().currentUser.uid)
      .get();

    return !friendRequests.empty;
  } catch (error) {
    console.error("Error checkIfFriendAlreadyHasRequest:", error);
    return false;
  }
};

async function deleteFriendRequest(friendRequestId) {
  try {
    const currentUserUid = auth().currentUser.uid;

    await firestore()
      .collection("Users")
      .doc(currentUserUid)
      .collection("Notifications")
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

export async function addUserToFriends(creatorId) {
  try {
    const currentUserUid = auth().currentUser.uid;

    const querySnapshot = await firestore()
      .collection("Users")
      .doc(creatorId)
      .get();
    if (!querySnapshot.exists) {
      throw new Error("Friend with the provided email address not found");
    }

    console.log("Znaleziono frienda");

    const FriendRequestQuerySnapshot = await firestore()
      .collection("Users")
      .doc(currentUserUid)
      .collection("Notifications")
      .where("creatorId", "==", creatorId)
      .where("notificationType", "==", "friendRequest")
      .limit(1)
      .get();

    if (!FriendRequestQuerySnapshot.empty) {
      // If the query returned any documents
      const friendRequestDocRef = FriendRequestQuerySnapshot.docs[0].ref;

      // Now update the document using the reference
      await friendRequestDocRef.update({
        isConfirmed: true,
      });

      console.log("Friend request confirmed.");
    } else {
      console.log("Friend request not found.");
    }

    //checking if users may be already added to their friendsList
    const checkCurrentUser = await checkIfFriendIsAlreadyInFriendsList(
      currentUserUid,
      creatorId
    );
    if (!checkCurrentUser) {
      const updatedUsersFriendList = await firestore()
        .collection("Users")
        .doc(currentUserUid)
        .collection("Friends")
        .add({
          friendId: creatorId,
        });
    } else {
      console.log("Current user already has this friend in their friendsList");
    }

    const checkFriend = await checkIfFriendIsAlreadyInFriendsList(
      creatorId,
      currentUserUid
    );

    if (!checkFriend) {
      const updatedFriendsFriendList = await firestore()
        .collection("Users")
        .doc(creatorId)
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
    deleteFriendRequest(FriendRequestQuerySnapshot.docs[0].ref.id);
  } catch (error) {
    console.log(`Error while updating friends: ${error}`);
    throw error;
  }
}

export async function sendFriendRequest(email, toastRef) {
  try {
    const currentUserUid = auth().currentUser.uid;

    const querySnapshot = await firestore()
      .collection("Users")
      .where("email", "==", email)
      .limit(1)
      .get();
    if (querySnapshot.size === 0) {
      toastRef.current.show({
        type: "warning",
        text: "Błędny e-mail",
        duration: 2000,
      });
      console.log("Friend with the provided email address not found");
      return;
    }
    const friendId = querySnapshot.docs[0].ref.id;
    console.log(`Id frienda: ${friendId}`);
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
          .collection("Notifications")
          .add({
            notificationType: "friendRequest",
            isConfirmed: false,
            creatorId: auth().currentUser.uid,
            date: firestore.FieldValue.serverTimestamp(),
          });
        toastRef.current.show({
          type: "success",
          text: "Zaproszenie wysłane",
          duration: 2000,
        });
        return true;
      } else {
        toastRef.current.show({
          type: "warning",
          text: "Znajomy już zaproszony",
          duration: 2000,
        });
        console.log("Already has invitation");
      }
    } else {
      toastRef.current.show({
        type: "error",
        text: "To jest już twój znajomy",
        duration: 2000,
      });

      console.log("Already in friends list");
    }
  } catch (error) {
    console.log(error);
  }
}

const getProfilePicture = async (userId) => {
  try {
    const profilePictureRef = storage().ref(
      `UsersStorage/${userId}/profilePicture`
    );
    const {items} = await profilePictureRef.list({maxResults: 1});
    if (items.length > 0) {
      const profileImageRef = items[0];
      return await profileImageRef.getDownloadURL();
    } else {
      const defaultImageRef = storage().ref(`DefaultMedia/default_user.png`);
      return await defaultImageRef.getDownloadURL();
    }
  } catch (error) {
    console.log(error);
  }
};

export async function getInfoAboutUser(userId) {
  try {
    const userRef = await firestore().collection("Users").doc(userId).get();
    const userData = userRef.data();
    userData.profileImgUrl = await getProfilePicture(userId);
    userData.id = userId;
    return userData;
  } catch (e) {
    console.error(`error getInfoAboutUser: ${e}`);
  }
}

export async function getInfoAboutUserFromEmail(email) {
  const userRef = await firestore()
    .collection("Users")
    .where("email", "==", email)
    .limit(1)
    .get();
  if (!userRef.empty) {
    const userData = userRef.docs[0].data();
    userData.profileImgUrl = await getProfilePicture(userRef.docs[0].id);
    userData.id = userRef.docs[0].id;
    return userData;
  } else {
    return null;
  }
}

export async function declineInvitation(creatorId) {
  try {
    const colRef = await firestore()
      .collection("Users")
      .doc(auth().currentUser.uid)
      .collection("Notifications")
      .where("creatorId", "==", creatorId)
      .where("notificationType", "==", "friendRequest")
      .limit(1)
      .get();
    await colRef.docs[0].ref.delete();
  } catch (e) {
    console.log(`Error while declining invitation ${e}`);
  }
}

export async function getFriendsList() {
  try {
    const colRef = await firestore()
      .collection("Users")
      .doc(auth().currentUser.uid)
      .collection("Friends")
      .get();
    const friendsIds = colRef.docs.map((doc) => doc.data().friendId);
    let friendsList = [];
    await Promise.all(
      friendsIds.map(async (id) => {
        const user = await getInfoAboutUser(id);
        friendsList.push(user);
      })
    );
    return friendsList;
  } catch (e) {
    console.log(`Error while getFriendsList ${e}`);
  }
}
