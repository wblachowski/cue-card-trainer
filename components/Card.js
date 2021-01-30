import React from "react";
import { Text, View } from "react-native";
import { useDarkMode } from "react-native-dark-mode";

export default function Card({ card }) {
  const isDarkMode = useDarkMode();

  return (
    <View>
      <Text
        style={{
          fontSize: 18,
          fontWeight: "bold",
          marginBottom: 16,
          color: isDarkMode ? "white" : "black",
        }}
      >
        {card.title}
      </Text>
      <Text
        style={{
          fontSize: 14,
          marginTop: 2,
          marginBottom: 2,
          color: isDarkMode ? "white" : "black",
        }}
      >
        {card.prompt}
      </Text>
      {(card.bullets || []).map((bullet, i) => (
        <Text
          key={i}
          style={{
            fontSize: 14,
            marginLeft: 20,
            marginTop: 2,
            marginBottom: 2,
            color: isDarkMode ? "white" : "black",
          }}
        >
          • {bullet}
        </Text>
      ))}
      <Text
        style={{
          fontSize: 14,
          marginTop: 2,
          marginBottom: 2,
          color: isDarkMode ? "white" : "black",
        }}
      >
        {card.ending}
      </Text>
    </View>
  );
}
