import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  SafeAreaView,
  Platform,
  Button,
  StatusBar,
  View,
} from "react-native";
import * as FileSystem from "expo-file-system";
import { Asset } from "expo-asset";
import * as SQLite from "expo-sqlite";

function openDatabase(pathToDatabaseFile) {
  // if (
  //   !FileSystem.getInfoAsync(FileSystem.documentDirectory + "SQLite").exists
  // ) {
  //   FileSystem.makeDirectoryAsync(FileSystem.documentDirectory + "SQLite");
  // }
  FileSystem.downloadAsync(
    Asset.fromModule(require("./assets/cards.db")).uri,
    FileSystem.documentDirectory + "SQLite/cards2.db"
  );
  return SQLite.openDatabase("cards2.db");
}

const db = openDatabase();

export default function App() {
  const [card, setCard] = useState({ title: "No cards" });
  const [secs, setSecs] = useState(120);
  const [timerActive, setTimerActive] = useState(false);
  const [timesUp, setTimesUp] = useState(false);
  const [cardId, setCardId] = useState(0);
  const [cardCount, setCardCount] = useState(-1);

  useEffect(() => {
    setSecs(120);
    setTimesUp(false);
    setTimerActive(false);
    if (cardCount < 0) {
      getCardsCount();
    } else {
      fetchData(cardId);
    }
  }, [cardId]);

  useEffect(() => {
    if (cardCount > 0) {
      fetchData(cardId);
    }
  }, [cardCount]);

  useEffect(() => {
    let interval = null;
    if (timerActive) {
      setTimesUp(false);
      interval = setInterval(() => {
        setSecs((secs) => secs - 1);
      }, 1000);
    } else if (!timerActive && secs !== 0) {
      clearInterval(interval);
    }
    if (timerActive && secs <= 0) {
      setTimerActive(false);
      setTimesUp(true);
    }
    return () => clearInterval(interval);
  }, [timerActive, secs]);

  const timeStr = () => {
    return `${Math.floor(secs / 60)}:${String(secs % 60).padStart(2, "0")}`;
  };

  const startTimer = () => {
    setSecs(120);
    setTimerActive(true);
  };

  const nextCard = () => {
    setCardId((prev) => {
      if (prev + 1 >= cardCount) {
        return 0;
      }
      return prev + 1;
    });
  };

  const prevCard = () => {
    setCardId((prev) => {
      if (prev - 1 < 0) {
        return cardCount - 1;
      }
      return prev - 1;
    });
  };

  const getCardsCount = () =>
    db.transaction((tx) =>
      tx.executeSql(
        "SELECT COUNT(*) AS count FROM cards",
        null,
        // success
        (
          txObj,
          {
            rows: {
              _array: [{ count }],
            },
          }
        ) => {
          setCardCount(count);
          console.log("COUNT:", count);
        }
      )
    );

  const fetchData = (id = 0) => {
    console.log(id);
    db.transaction((tx) => {
      tx.executeSql(
        "SELECT * FROM cards LIMIT 1 OFFSET ?",
        [id],
        // success
        (
          txObj,
          {
            rows: {
              _array: [fetchedCard],
            },
          }
        ) => {
          if (fetchedCard) {
            fetchedCard.bullets = fetchedCard.bullets?.split("\n") || [];
            setCard(fetchedCard);
          }
        },
        // failure
        (txObj, error) => console.log("Error ", error)
      );
    });
  };

  return (
    <SafeAreaView style={styles.container}>
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
      <View style={styles.timerView}>
        <Text style={{ color: timesUp ? "red" : "black", fontSize: 64 }}>
          {timeStr()}
        </Text>
      </View>
      <View style={styles.bottomNav}>
        <View style={styles.buttonView}>
          <Button title="Prev" onPress={prevCard}></Button>
        </View>
        <View style={styles.buttonView}>
          <Button title="Start" onPress={startTimer}></Button>
        </View>
        <View style={styles.buttonView}>
          <Button title="Next" onPress={nextCard}></Button>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  mainView: {
    position: "absolute",
    top: 200,
    marginLeft: 30,
    marginRight: 30,
  },
  timerView: {
    position: "absolute",
    bottom: 150,
  },
  bottomNav: {
    flexDirection: "row",
    position: "absolute",
    bottom: 20,
    width: "100%",
    paddingLeft: 30,
    paddingRight: 30,
  },
  buttonView: {
    justifyContent: "space-between",
    flex: 1,
    backgroundColor: "green",
  },
});
