import {
  View,
  Text,
  TouchableOpacity,
  StatusBar,
  TextInput,
  ScrollView,
  Image,
} from "react-native";
import React, { useRef, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { ArrowLeftIcon, EyeIcon } from "react-native-heroicons/solid";
import { LinearGradient } from "expo-linear-gradient";
import useAuth from "../hooks/useAuth";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Toast from "../components/Shared/CustomToast";

const RegisterScreen = ({ navigation }) => {
  const { onRegisterButtonPress, onGoogleButtonPress } = useAuth();
  const [passwordVisible, setPasswordVisible] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  const toastRef = useRef();
  return (
    <GestureHandlerRootView>
      <Toast ref={toastRef} />
      <View className="w-screen h-full">
        <LinearGradient
          className="flex-1"
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          colors={["#374151", "#111827"]}
        >
          <StatusBar
            barStyle="light-content"
            translucent
            backgroundColor="transparent"
          />
          <SafeAreaView className="m-3 flex-1">
            <View className=" bg-black/50 w-10 h-10 rounded-full transition-shadow">
              <TouchableOpacity
                className="flex-1 items-center justify-center"
                onPress={() => {
                  navigation.goBack();
                }}
              >
                <ArrowLeftIcon size={20} color="#fff" />
              </TouchableOpacity>
            </View>
            <View className="flex-1 my-2 p-2 bg-black/50 rounded">
              <ScrollView scrollEnabled={false}>
                <View>
                  <Text className="text-white text-2xl">
                    Zarejestruj się do Nas
                  </Text>
                  <Text className="text-white pt-4 pb-1">Imię</Text>
                  <TextInput
                    className="bg-black px-2 py-1 rounded border border-gray-500"
                    placeholder="Jan"
                    placeholderTextColor="gray"
                    color="white"
                    onChangeText={(text) => {
                      setFirstName(text);
                    }}
                  />
                  <Text className="text-white pt-4 pb-1">Nazwisko</Text>
                  <TextInput
                    className="bg-black px-2 py-1 rounded border border-gray-500"
                    placeholder="Kowalski"
                    placeholderTextColor="gray"
                    color="white"
                    onChangeText={(text) => {
                      setLastName(text);
                    }}
                  />
                  <Text className="text-white pt-4 pb-1">Email</Text>
                  <TextInput
                    className="bg-black px-2 py-1 rounded border border-gray-500"
                    placeholder="jan@company.com"
                    placeholderTextColor="gray"
                    color="white"
                    onChangeText={(text) => {
                      setEmail(text);
                    }}
                  />
                  <Text className="pb-1 pt-2 text-white">Hasło</Text>
                  <View className="flex-row items-center justify-between bg-black px-2 py-1 rounded border border-gray-500">
                    <TextInput
                      className="flex-1"
                      placeholder="Hasło"
                      placeholderTextColor="gray"
                      secureTextEntry={passwordVisible}
                      color="white"
                      onChangeText={(text) => {
                        setPassword(text);
                      }}
                    />
                    <TouchableOpacity
                      onPress={() => {
                        setPasswordVisible(!passwordVisible);
                      }}
                    >
                      <EyeIcon size={20} color="gray" />
                    </TouchableOpacity>
                  </View>

                  <TouchableOpacity
                    onPress={() => {
                      onRegisterButtonPress(
                        firstName,
                        lastName,
                        email,
                        password,
                        toastRef
                      );
                    }}
                    className="mt-4 bg-white rounded items-center"
                  >
                    <Text className="text-black py-2 font-bold">Rejestruj</Text>
                  </TouchableOpacity>
                  <View className="flex-row justify-center items-center">
                    <Text className="py-4 text-gray-300">Masz już konto? </Text>
                    <TouchableOpacity
                      onPress={() => {
                        navigation.navigate("Login");
                      }}
                    >
                      <Text className="text-green-400">Zaloguj się</Text>
                    </TouchableOpacity>
                  </View>
                  <View className="pt-2 flex-row items-center">
                    <View className="flex-1 mr-2 border-b border-gray-500"></View>
                    <Text className="text-gray-500 font-bold">
                      Rejestracja za pomocą
                    </Text>
                    <View className="flex-1 ml-2 border-b border-gray-500"></View>
                  </View>
                  <View className="pt-4 space-y-3">
                    <TouchableOpacity
                      onPress={() => {
                        onGoogleButtonPress(toastRef);
                      }}
                      className="relative justify-center flex-row bg-black/80 rounded items-center"
                    >
                      <Image
                        className="w-9 h-9 absolute left-2"
                        source={require("../assets/myAssets/btn_google_dark_normal.png")}
                      />
                      <Text className="text-white py-2 font-bold">
                        Kontynuuj z kontem Google
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
                <View className="bg-black mt-10 px-2 py-1 rounded border border-gray-500">
                  <Text className="text-gray-500 text-center">
                    Rejestracja pozwoli na korzystanie z naszych usług,
                    interakcje ze znajomymi, używanie lokalizacji i wiele
                    innych.{" "}
                    <Text className="text-white">Dowiedz się więcej</Text>
                  </Text>
                </View>
              </ScrollView>
            </View>
          </SafeAreaView>
        </LinearGradient>
      </View>
    </GestureHandlerRootView>
  );
};

export default RegisterScreen;
