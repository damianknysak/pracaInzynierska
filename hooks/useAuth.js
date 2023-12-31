import React, {createContext, useContext} from "react";
import "expo-dev-client";
import {GoogleSignin} from "@react-native-google-signin/google-signin";
import auth from "@react-native-firebase/auth";
import {firebase} from "@react-native-firebase/app";
import {useEffect, useState} from "react";
import firestore from "@react-native-firebase/firestore";
const AuthContext = createContext({});
export const AuthProvider = ({children}) => {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState();

  GoogleSignin.configure({
    webClientId:
      "861452381265-58e2nia5a23q2e8fgr1phh3qbshc14qh.apps.googleusercontent.com",
  });

  function onAuthStateChanged(user) {
    setUser(user);
    if (initializing) setInitializing(false);
  }

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber;
  }, []);

  async function onGoogleButtonPress(toastRef) {
    try {
      const {idToken} = await GoogleSignin.signIn();

      const googleCredential = auth.GoogleAuthProvider.credential(idToken);

      const user_sign_in = auth().signInWithCredential(googleCredential);
    } catch (e) {
      console.log(e);
      toastRef.current.show({
        type: "error",
        text: "Błąd przy logowaniu przez Google",
        duration: 2000,
      });
    }
  }

  //check if google authenticated user is in db
  //had to do that way bc couldnt get access to user.providerData.providerId
  useEffect(() => {
    if (user && user.email.includes("@gmail.com")) {
      const email = user.email;
      const firstName = user.displayName.split(" ")[0];
      const lastName = user.displayName.split(" ")[1];
      // check if user is in DB, if not add him
      function checkIfExistsGoogleInDb() {
        return new Promise((resolve, reject) => {
          firebase
            .firestore()
            .collection("Users")
            .get()
            .then((tego) => {
              let exists = false;
              tego._docs.forEach((element) => {
                if (element._data.email == email) {
                  exists = true;
                }
              });
              resolve(exists);
            })
            .catch(reject);
        });
      }
      checkIfExistsGoogleInDb()
        .then((exists) => {
          if (!exists) {
            firestore()
              .collection("Users")
              .doc(firebase.auth().currentUser.uid)
              .set({
                firstName,
                lastName,
                email,
              });
          }
        })
        .catch((error) => {
          console.log("Wystąpił błąd:", error);
        });
    }
  }, [user]);

  const signOut = async () => {
    try {
      if (user.providerId == "firebase") {
        await firebase.auth().signOut();
        setUser(null);
      } else {
        await GoogleSignin.revokeAccess();
        await auth().signOut();
        setUser(null);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const onLoginButtonPress = async (email, password, toastRef) => {
    try {
      if (!email || !password) {
        toastRef.current.show({
          type: "warning",
          text: "Wypełnij pola by się zalogować",
          duration: 2000,
        });
        return;
      }
      await firebase.auth().signInWithEmailAndPassword(email, password);
    } catch (error) {
      console.log(error);
      toastRef.current.show({
        type: "warning",
        text: error.message.includes("[auth/invalid-email]")
          ? "Błędny format e-mail"
          : error.message.includes("[auth/user-not-found]")
          ? "Użytkownik z takim e-mailem nie istnieje"
          : error.message.includes("[auth/wrong-password]")
          ? "Błędne hasło"
          : "",
        duration: 2000,
      });
    }
  };

  const onRegisterButtonPress = async (
    firstName,
    lastName,
    email,
    password,
    toastRef
  ) => {
    try {
      if (firstName && lastName && email && password) {
        await firebase
          .auth()
          .createUserWithEmailAndPassword(email, password)
          .then(() => {
            firebase
              .auth()
              .currentUser.sendEmailVerification({
                handleCodeInApp: true,
                url: "https://damianinzynierka.firebaseapp.com",
              })
              .then(() => {
                firestore()
                  .collection("Users")
                  .doc(firebase.auth().currentUser.uid)
                  .set({
                    firstName,
                    lastName,
                    email,
                  });
              })
              .catch((error) => {
                alert(`${error.message}`);
              });
          });
      } else {
        toastRef.current.show({
          type: "warning",
          text: "Wszystkie pola muszą być wypełnione",
          duration: 2000,
        });
      }
    } catch (error) {
      toastRef.current.show({
        type: "warning",
        text: error.message.includes("[auth/invalid-email]")
          ? "Błędny format e-mail"
          : error.message.includes("[auth/weak-password]")
          ? "Hasło musi mieć conajmniej 6 znaków"
          : error.message,
        duration: 2000,
      });
    }
  };

  async function getCurrentUserInfoDB() {
    try {
      const userDocument = await firestore()
        .collection("Users")
        .doc(firebase.auth().currentUser.uid)
        .get();
      return userDocument._data;
    } catch (error) {
      console.log(`Cant connect to db ${error}`);
    }
  }

  if (initializing) return null;

  return (
    <AuthContext.Provider
      value={{
        user: user,
        onGoogleButtonPress,
        signOut,
        onLoginButtonPress,
        onRegisterButtonPress,
        getCurrentUserInfoDB,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default function useAuth() {
  return useContext(AuthContext);
}
