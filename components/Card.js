import React from "react";
import { View, StyleSheet } from "react-native";
import { Text } from "react-native-paper";

export default function Card({ card }) {
  return (
    <View>
      <Text style={styles.titleText}>{card.title}</Text>
      <Text style={styles.promptText}>{card.prompt}</Text>
      {(card.bullets || []).map((bullet, i) => (
        <Text key={i} style={styles.bulletText}>
          • {bullet}
        </Text>
      ))}
      <Text style={styles.endingText}>{card.ending}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  titleText: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
  },
  promptText: {
    fontSize: 14,
    marginTop: 2,
    marginBottom: 2,
  },
  bulletText: {
    fontSize: 14,
    marginLeft: 20,
    marginTop: 2,
    marginBottom: 2,
  },
  endingText: {
    fontSize: 14,
    marginTop: 2,
    marginBottom: 2,
  },
});
