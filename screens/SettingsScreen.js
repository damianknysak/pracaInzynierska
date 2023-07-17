import { View, Text } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";

const SettingsScreen = () => {
  return (
    <View className="h-full w-screen bg-red-100">
      <SafeAreaView className="flex-1">
        <Text>SettingsScreen</Text>
      </SafeAreaView>
    </View>
  );
};

export default SettingsScreen;
