import React from "react";
import { StyleSheet, Text, View } from "react-native";

export default function Card({ card }) {
  return (
    <View style={styles.mainView}>
      <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 16 }}>
        {card.title}
      </Text>
      <Text style={{ fontSize: 14, marginTop: 2, marginBottom: 2 }}>
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
          }}
        >
          • {bullet}
        </Text>
      ))}
      <Text style={{ fontSize: 14, marginTop: 2, marginBottom: 2 }}>
        {card.ending}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  mainView: {
    position: "absolute",
    left: 0,
    top: 200,
    marginLeft: 30,
    marginRight: 30,
  },
});
