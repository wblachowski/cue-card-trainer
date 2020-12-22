import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  SafeAreaView,
  Platform,
  StatusBar,
  View,
} from "react-native";
import { Button } from "react-native-material-ui";
import * as FileSystem from "expo-file-system";
import { Asset } from "expo-asset";
import * as SQLite from "expo-sqlite";
import Card from "./components/Card";

const TimerStates = Object.freeze({
  notStarted: {},
  running: {},
  paused: {},
  finished: {},
});

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
  const SECS = 5;
  const [card, setCard] = useState({ title: "No cards" });
  const [secs, setSecs] = useState(SECS);
  const [timerState, setTimerState] = useState(TimerStates.notStarted);
  const [cardId, setCardId] = useState(0);
  const [cardCount, setCardCount] = useState(-1);

  useEffect(() => {
    setSecs(SECS);
    setTimerState(TimerStates.notStarted);
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
    if (timerState === TimerStates.running) {
      interval = setInterval(() => {
        setSecs((secs) => secs - 1);
      }, 1000);
    }
    if (secs <= 0) {
      setTimerState(TimerStates.finished);
    }
    return () => clearInterval(interval);
  }, [timerState, secs]);

  const timeStr = () => {
    return `${Math.floor(secs / 60)}:${String(secs % 60).padStart(2, "0")}`;
  };

  const startTimer = () => {
    setSecs(SECS);
    setTimerState(TimerStates.running);
  };

  const mainButtonText = () => {
    if (timerState === TimerStates.running) {
      return "pause";
    } else if (timerState === TimerStates.notStarted) {
      return "start";
    } else if (timerState === TimerStates.finished) {
      return "restart";
    } else if (timerState === TimerStates.paused) {
      return "resume";
    }
    return "";
  };

  const mainButtonIcon = () => {
    if (timerState === TimerStates.running) {
      return "pause";
    } else if (timerState === TimerStates.finished) {
      return "replay";
    }
    return "play-arrow";
  };

  const mainButtonAction = () => {
    if (timerState === TimerStates.running) {
      setTimerState(TimerStates.paused);
    } else if (
      timerState === TimerStates.notStarted ||
      timerState === TimerStates.finished
    ) {
      startTimer();
    } else if (timerState === TimerStates.paused) {
      setTimerState(TimerStates.running);
    }
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
      <View style={styles.cardView}>
        <Card card={card} />
      </View>
      <View style={styles.timerView}>
        <Text
          style={{
            color: timerState === TimerStates.finished ? "red" : "black",
            fontSize: 64,
          }}
        >
          {timeStr()}
        </Text>
      </View>
      <View style={styles.bottomNav}>
        <View style={styles.buttonView}>
          <Button primary text="Prev" onPress={prevCard}></Button>
        </View>
        <View style={styles.buttonView}>
          <Button
            primary
            text={mainButtonText()}
            onPress={mainButtonAction}
            icon={mainButtonIcon()}
          ></Button>
        </View>
        <View style={styles.buttonView}>
          <Button primary text="Next" onPress={nextCard}></Button>
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
  cardView: {
    position: "absolute",
    left: 0,
    top: 200,
    paddingLeft: 30,
    marginRight: 30,
  },
  timerView: {
    position: "absolute",
    bottom: 165,
  },
  bottomNav: {
    flexDirection: "row",
    position: "absolute",
    bottom: 20,
    width: "100%",
    paddingLeft: 22,
    paddingRight: 22,
  },
  buttonView: {
    justifyContent: "space-between",
    flex: 1,
    marginLeft: 8,
    marginRight: 8,
  },
});
