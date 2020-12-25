import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  SafeAreaView,
  Platform,
  StatusBar,
  View,
  Switch,
} from "react-native";
import Card from "./components/Card";
import BottomNav from "./components/BottomNav";
import { TimerStates } from "./Constants";
import Database from "./Database";
import AsyncStorage from "@react-native-community/async-storage";
import * as SQLite from "expo-sqlite";
import * as Speech from "expo-speech";

export default function App() {
  const SECS = 5;
  const [card, setCard] = useState({});
  const [secs, setSecs] = useState(SECS);
  const [timerState, setTimerState] = useState(TimerStates.notStarted);
  const [cardId, setCardId] = useState(-1);
  const [cardCount, setCardCount] = useState(-1);
  const [ttsEnabled, setTtsEnabled] = useState(false);
  const [db, setDb] = useState();

  storeLastCardId = async () =>
    AsyncStorage.setItem("lastCardId", cardId.toString()).then((xd) =>
      console.log(`Saved: ${cardId}`)
    );

  retrieveLastCardId = async () => AsyncStorage.getItem("lastCardId");

  useEffect(() => {
    Database.initialize().then(() => {
      sqlite = SQLite.openDatabase("cards2.db");
      setDb(new Database(sqlite));
      console.log("database initialized");
    });
  }, []);

  useEffect(() => {
    if (db) {
      getCardsCount()
        .then(retrieveLastCardId)
        .then((lastCardId) => {
          if (lastCardId != null) {
            console.log(`Retrieved: ${lastCardId}`);
            setCardId(parseInt(lastCardId));
          }
        });
    }
  }, [db]);

  useEffect(() => {
    setSecs(SECS);
    setTimerState(TimerStates.notStarted);
    if (cardId >= 0) {
      fetchData(cardId);
      storeLastCardId();
    }
  }, [cardId]);

  useEffect(() => {
    if (card && ttsEnabled) {
      Speech.stop();
      Speech.speak(card.title);
      Speech.speak(card.prompt);
      Speech.speak(card.bullets?.join(",\n"));
      Speech.speak(card.ending);
    }
    if (!ttsEnabled) {
      Speech.stop();
    }
  }, [card, ttsEnabled]);

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

  const getCardsCount = () =>
    db.getCardsCount().then((cardCount) => {
      console.log(`Card count: ${cardCount}`);
      setCardCount(cardCount);
    });

  const fetchData = (cardId) =>
    db.fetchData(cardId).then((card) => {
      console.log(`Displaying: ${cardId}`);
      setCard(card);
    });

  const nextCard = () =>
    setCardId((prev) => (prev + 1 >= cardCount ? 0 : prev + 1));

  const prevCard = () =>
    setCardId((prev) => (prev - 1 < 0 ? cardCount - 1 : prev - 1));

  const timeStr = () => {
    return `${Math.floor(secs / 60)}:${String(secs % 60).padStart(2, "0")}`;
  };

  const startTimer = () => {
    setSecs(SECS);
    setTimerState(TimerStates.running);
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

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.settingsView}>
        <Text style={styles.settingsText}>Text To Speach</Text>
        <Switch
          trackColor={{ false: "#767577", true: "#90CAF9" }}
          thumbColor={ttsEnabled ? "#2962FF" : "#ffffff"}
          ios_backgroundColor="#3e3e3e"
          onValueChange={() => setTtsEnabled((prev) => !prev)}
          value={ttsEnabled}
        />
      </View>
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
        <BottomNav
          prevClicked={prevCard}
          playClicked={mainButtonAction}
          nextClicked={nextCard}
          timerState={timerState}
        />
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
  settingsView: {
    flexDirection: "row",
    position: "absolute",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    right: 30,
    top: 20,
  },
  settingsText: {
    marginRight: 8,
    marginTop: 2,
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
    bottom: 190,
  },
  bottomNav: {
    flexDirection: "row",
    position: "absolute",
    bottom: 28,
    width: "100%",
    paddingLeft: 22,
    paddingRight: 22,
  },
});
