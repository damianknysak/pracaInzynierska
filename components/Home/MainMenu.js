import { View, Text, ScrollView, Image, Animated } from "react-native";
import React, { useRef } from "react";
import MainMenuElement from "./MainMenuElement";
import { Dimensions } from "react-native";
import { useNavigation } from "@react-navigation/native";

const MainMenu = () => {
  const scrollX = useRef(new Animated.Value(0)).current;
  const navigation = useNavigation();
  const width = Dimensions.get("window").width;
  const SPACER_ITEM_SIZE = (width - 264) / 2;

  return (
    <Animated.ScrollView
      showsHorizontalScrollIndicator={false}
      onScroll={Animated.event(
        [{ nativeEvent: { contentOffset: { x: scrollX } } }],
        { useNativeDriver: true }
      )}
      scrollEventThrottle={16}
      snapToInterval={264}
      decelerationRate={20}
      horizontal
      contentContainerStyle={{ alignItems: "center" }}
    >
      <View style={{ width: SPACER_ITEM_SIZE }} />
      <MainMenuElement
        scrollX={scrollX}
        index={0}
        imgURL="https://cdn.pixabay.com/photo/2015/06/25/17/56/people-821624_1280.jpg"
        smallDesc="Dodaj do znajomych"
        desc="Chcesz się połączyć ze swoimi znajomymi?"
        buttonDesc="Dodaj"
        onButtonPress={() => {
          navigation.navigate("AddFriend");
        }}
      />
      <MainMenuElement
        scrollX={scrollX}
        index={1}
        imgURL="https://shorturl.at/lox27"
        smallDesc="Stwórz wyzwanie"
        desc="Rozpocznij ryzwalizacje i podejmij wyzwanie ..."
        buttonDesc="Stwórz"
        onButtonPress={() => {
          console.log("click");
        }}
      />
      <MainMenuElement
        scrollX={scrollX}
        index={2}
        imgURL="https://shorturl.at/ABEH9"
        smallDesc="Otwórz mape"
        desc="Szukaj ciekawych lokalizacji na mapie ..."
        buttonDesc="Szukaj"
        onButtonPress={() => {
          console.log("click");
        }}
      />
      <MainMenuElement
        scrollX={scrollX}
        index={3}
        imgURL="https://shorturl.at/GKTY7"
        smallDesc="Przejdź do strony"
        desc="Przejdź do polecanego przez nas artykułu ..."
        buttonDesc="Idź"
        onButtonPress={() => {
          console.log("click");
        }}
      />
      <MainMenuElement
        scrollX={scrollX}
        index={4}
        imgURL="https://shorturl.at/ABEH9"
        smallDesc="Otwórz mape"
        desc="Szukaj ciekawych lokalizacji na mapie ..."
        buttonDesc="Szukaj"
        onButtonPress={() => {
          console.log("click");
        }}
      />
      <MainMenuElement
        scrollX={scrollX}
        index={5}
        imgURL="https://shorturl.at/ABEH9"
        smallDesc="Otwórz mape"
        desc="Szukaj ciekawych lokalizacji na mapie ..."
        buttonDesc="Szukaj"
        onButtonPress={() => {
          console.log("click");
        }}
      />
      <MainMenuElement
        scrollX={scrollX}
        index={6}
        imgURL="https://shorturl.at/ABEH9"
        smallDesc="Otwórz mape"
        desc="Szukaj ciekawych lokalizacji na mapie ..."
        buttonDesc="Szukaj"
        onButtonPress={() => {
          console.log("click");
        }}
      />
      <MainMenuElement
        scrollX={scrollX}
        index={7}
        imgURL="https://shorturl.at/ABEH9"
        smallDesc="Otwórz mape"
        desc="Szukaj ciekawych lokalizacji na mapie ..."
        buttonDesc="Szukaj"
        onButtonPress={() => {
          console.log("click");
        }}
      />
      <View style={{ width: SPACER_ITEM_SIZE }} />
    </Animated.ScrollView>
  );
};

export default MainMenu;
