import {View, Text, TouchableOpacity, Image} from "react-native";
import React from "react";
import {WrenchScrewdriverIcon} from "react-native-heroicons/outline";

const PermissionRequestView = ({requestLocationPermissions}) => {
  return (
    <View className="w-full h-full">
      <View className="mt-20 items-center">
        <Image
          className="w-24 h-24"
          source={require("../../assets/myAssets/tourist_female.png")}
        />
      </View>
      <View className="m-3 bg-black/50 rounded-3xl overflow-hidden">
        <Text className="text-lg text-white leading-5 p-4">
          Branie udziału w wyzwaniach z ciągle otwartą aplikacją nie ma sensu.
        </Text>
        <Text className="text-white text-base leading-5 p-3 rounded-t-3xl bg-black/75">
          Aby brać udział w wyzwaniach z zablokowanym telefonem lub
          zminimalizowaną aplikacją musisz nam nadać{" "}
          <Text className="font-bold text-orange-500">
            Stały dostęp do lokalizacji
          </Text>
          .
        </Text>
        <View className="mt-10 bg-black/75 p-4 items-center rounded-t-3xl">
          <TouchableOpacity
            className="bg-white px-3 h-12 justify-center items-center space-x-2 rounded-xl flex-row"
            onPress={() => {
              requestLocationPermissions();
            }}
          >
            <Text className="text-orange-500 text-center font-bold text-lg">
              Nadaj uprawnienia
            </Text>
            <WrenchScrewdriverIcon size={30} color="orange" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default PermissionRequestView;
