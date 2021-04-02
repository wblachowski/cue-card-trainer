import React from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { Text, Card as PaperCard } from "react-native-paper";

export default function Card({ card, cardsCount }) {
  return (
    <ScrollView style={styles.cardView} contentContainerStyle={{ flexGrow: 1 }}>
      <PaperCard style={styles.cardView}>
        <PaperCard.Content>
          <Text style={styles.cardNumberText}>
            {card.id + 1}/{cardsCount}
          </Text>
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
        </PaperCard.Content>
      </PaperCard>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    overflow: "scroll",
    borderRadius: 4,
  },
  cardView: {
    flex: 0.98,
  },
  cardNumberText: {
    opacity: 0.6,
    marginBottom: 4,
  },
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
