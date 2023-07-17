import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import React from "react";
import {
  ArrowDownTrayIcon,
  ArrowPathIcon,
  CloudArrowDownIcon,
  PaperAirplaneIcon,
} from "react-native-heroicons/outline";

const BottomPanel = ({
  uploading,
  downloading,
  onSavePress,
  onSaveCloudPress,
}) => {
  return (
    <View className="flex-row z-10 absolute w-full h-20 bottom-0 bg-gray-800 rounded-2xl items-center justify-around">
      <TouchableOpacity
        onPress={onSavePress}
        className="bg-black/50 p-4 px-5 flex-row items-center space-x-1 rounded-full"
      >
        {downloading ? (
          <ActivityIndicator size={25} color="white" />
        ) : (
          <ArrowDownTrayIcon size={25} color="white" />
        )}

        <Text className="text-white font-semibold">Pobierz</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={onSaveCloudPress}
        className="bg-black/50 p-4 px-5 flex-row items-center space-x-1 rounded-full"
      >
        {uploading ? (
          <ActivityIndicator size={25} color="white" />
        ) : (
          <CloudArrowDownIcon size={30} color="white" />
        )}

        <Text className="text-white font-semibold">Zapisz</Text>
      </TouchableOpacity>
      <TouchableOpacity className="bg-blue-500 p-4 px-5 flex-row items-center space-x-1 rounded-full">
        <Text className="text-white font-semibold">Dalej</Text>
        <PaperAirplaneIcon size={25} color="white" />
      </TouchableOpacity>
    </View>
  );
};

export default BottomPanel;
