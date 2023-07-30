import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TouchableWithoutFeedback,
} from "react-native";
import React, { useRef } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Toast from "../components/Shared/CustomToast";
import { useState } from "react";

const SettingsScreen = () => {
  const toastRef = useRef();

  return (
    <GestureHandlerRootView className="flex-1">
      <SafeAreaView style={styles.container}>
        <Toast ref={toastRef} />

        <TouchableWithoutFeedback>
          <View style={styles.button}>
            <Text style={styles.buttonText}>TestModal</Text>
          </View>
        </TouchableWithoutFeedback>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
};

export default SettingsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
  },
  button: {
    width: 300,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FEC520",
    padding: 20,
    borderRadius: 15,
    marginTop: 20,
  },
  buttonText: { fontSize: 16, fontWeight: "600", color: "black" },
});
