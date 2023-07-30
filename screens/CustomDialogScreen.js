import React, { useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import {
  GestureHandlerRootView,
  PanGestureHandler,
  State,
} from "react-native-gesture-handler";
import { QuestionMarkCircleIcon } from "react-native-heroicons/outline";

const CustomDialogScreen = () => {
  const navigation = useNavigation();
  const translateY = useRef(new Animated.Value(300)).current;
  const route = useRoute();
  const { handleDelete, topic, description } = route.params;
  useEffect(() => {
    // Animacja pojawiania się ekranu na środku
    Animated.spring(translateY, {
      toValue: 0,
      useNativeDriver: true,
    }).start();
  }, [translateY]);

  const onDismiss = () => {
    // Animacja zamykania ekranu
    Animated.timing(translateY, {
      toValue: 600,
      duration: 300,
      useNativeDriver: true,
    }).start(() => navigation.goBack());
  };

  const onGestureEvent = Animated.event(
    [{ nativeEvent: { translationY: translateY } }],
    {
      useNativeDriver: true,
    }
  );

  const onHandlerStateChange = ({ nativeEvent }) => {
    if (nativeEvent.state === State.END) {
      // Zamykanie ekranu po przeciągnięciu w dół
      if (nativeEvent.translationY > 50) {
        onDismiss();
      }
    }
  };

  return (
    <View className="flex-1 justify-center items-center">
      <GestureHandlerRootView>
        <PanGestureHandler
          onGestureEvent={onGestureEvent}
          onHandlerStateChange={onHandlerStateChange}
        >
          <Animated.View
            style={[{ transform: [{ translateY }], elevation: 60 }]}
            className=" w-64 h-72 bg-white rounded-xl"
          >
            <View className="relative bg-gray-200 w-full h-full rounded-xl">
              <View className=" items-center h-4/5 space-y-5 mt-4">
                <QuestionMarkCircleIcon size={60} color="gray" />
                <Text className="text-xl font-semibold">{topic}</Text>
                <Text className="w-2/3 text-center text-gray-600">
                  {description}
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => {
                  handleDelete();
                  onDismiss();
                }}
                className="absolute items-center justify-center bg-white bottom-0 left-0 w-1/2 h-1/5 rounded-bl-xl border-r border-gray-200"
              >
                <Text className="text-xl font-semibold">Tak</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={onDismiss}
                className="absolute items-center justify-center bg-white bottom-0 right-0 w-1/2 h-1/5 rounded-br-xl border-l border-gray-200"
              >
                <Text className="text-gray-500 text-xl">Nie</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </PanGestureHandler>
      </GestureHandlerRootView>
    </View>
  );
};

export default CustomDialogScreen;
