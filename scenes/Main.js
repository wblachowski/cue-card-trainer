import "react-native-gesture-handler";
import React, { useState, useEffect } from "react";
import {
  Text,
  SafeAreaView,
  Platform,
  StatusBar,
  View,
  Switch,
} from "react-native";
import Card from "../components/Card";
import BottomNav from "../components/BottomNav";
import { TimerStates, TimerTypes } from "../Constants";
import Database from "../Database";
import AsyncStorage from "@react-native-community/async-storage";
import * as SQLite from "expo-sqlite";
import * as Speech from "expo-speech";
import { Button } from "react-native-material-ui";
import BackgroundTimer from "react-native-background-timer";
import {
  DynamicStyleSheet,
  DynamicValue,
  useDynamicStyleSheet,
} from "react-native-dark-mode";

export default function Main({ navigation }) {
  const SECS = 5;
  const [card, setCard] = useState({});
  const [initialSecs, setInitialSecs] = useState(SECS);
  const [initialPrepSecs, setInitialPrepSecs] = useState(SECS);
  const [secs, setSecs] = useState(initialSecs);
  const [prepEnabled, setPrepEnabled] = useState(false);
  const [timerState, setTimerState] = useState(TimerStates.notStarted);
  const [timerType, setTimerType] = useState(TimerTypes.none);
  const [cardId, setCardId] = useState(-1);
  const [cardCount, setCardCount] = useState(-1);
  const [carModeEnabled, setCarModeEnabled] = useState(false);
  const [db, setDb] = useState();
  const styles = useDynamicStyleSheet(dynamicStyles);

  storeLastCardId = async () =>
    AsyncStorage.setItem("lastCardId", cardId.toString()).then((xd) =>
      console.log(`Saved: ${cardId}`)
    );

  retrieveLastCardId = async () => AsyncStorage.getItem("lastCardId");

  readSettings = async () => {
    const read = async () => {
      var items = await AsyncStorage.multiGet([
        "answerTime",
        "prepEnabled",
        "prepTime",
      ]);
      return Object.fromEntries(items);
    };
    read().then((settings) => {
      console.log("settings:", settings);
      settings.prepEnabled = settings.prepEnabled === "true";
      settings.answerTime = settings.answerTime ?? 120;
      settings.prepTime = settings.prepTime ?? 30;
      setPrepEnabled(settings.prepEnabled);
      if (settings.prepEnabled) {
        setTimerType(TimerTypes.prep);
        setSecs(settings.prepTime);
      } else {
        setTimerType(TimerTypes.answer);
        setSecs(settings.answerTime);
      }
      if (timerState === TimerStates.finished) {
        setTimerState(TimerStates.notStarted);
      }
      setInitialSecs(parseInt(settings.answerTime));
      setInitialPrepSecs(parseInt(settings.prepTime));
    });
  };

  useEffect(() => {
    if (timerType === TimerTypes.answer) {
      setSecs(initialSecs);
    } else {
      setSecs(initialPrepSecs);
    }
  }, [timerType]);

  useEffect(() => {
    Database.initialize().then(() => {
      sqlite = SQLite.openDatabase("cards2.db");
      setDb(new Database(sqlite));
      console.log("database initialized");
    });
    console.log("in empty use effect");
    readSettings();
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
    if (prepEnabled) {
      setSecs(initialPrepSecs);
      setTimerType(TimerTypes.prep);
    } else {
      setSecs(initialSecs);
      setTimerType(TimerTypes.answer);
    }
    setTimerState(TimerStates.notStarted);
    if (cardId >= 0) {
      fetchData(cardId);
      storeLastCardId();
    }
  }, [cardId]);

  useEffect(() => {
    if (card && carModeEnabled) {
      Speech.stop();
      Speech.speak(card.title);
      Speech.speak(card.prompt);
      Speech.speak(card.bullets?.join(",\n"));
      Speech.speak(card.ending);
      var prompt = timerType === TimerTypes.prep ? "Prepare" : "Answer";
      Speech.speak(prompt, {
        onDone: () => {
          console.log("Reading done!");
          startTimer();
        },
      });
    }
    if (!carModeEnabled) {
      Speech.stop();
    }
  }, [card, carModeEnabled]);

  useEffect(() => {
    let interval = null;
    if (timerState === TimerStates.running) {
      interval = BackgroundTimer.setInterval(() => {
        setSecs((secs) => secs - 1);
      }, 1000);
    }
    if (secs <= 0 && timerType === TimerTypes.answer) {
      setTimerState(TimerStates.finished);
    }
    if (secs < 0 && timerType === TimerTypes.prep) {
      if (carModeEnabled) {
        Speech.speak("Answer", {
          onDone: () => {
            setTimerType(TimerTypes.answer);
          },
        });
      }
      setTimerType(TimerTypes.answer);
    }
    if (timerState === TimerStates.finished && carModeEnabled) {
      Speech.speak("Time's up!", {
        onDone: () => {
          nextCard();
        },
      });
    }
    return () => BackgroundTimer.clearInterval(interval);
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
    var t = secs >= 0 ? secs : 0;
    return `${Math.floor(t / 60)}:${String(t % 60).padStart(2, "0")}`;
  };

  const startTimer = () => {
    if (prepEnabled) {
      setTimerType(TimerTypes.prep);
      setSecs(initialPrepSecs);
    } else {
      setSecs(initialSecs);
    }
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
  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      readSettings();
    });

    return unsubscribe;
  }, [navigation]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.settingsView}>
        <Button
          primary
          text=""
          icon="settings"
          onPress={() => {
            setTimerState(TimerStates.paused);
            navigation.navigate("Settings");
          }}
        ></Button>
        <View style={styles.settingRow}>
          <Text style={styles.settingsText}>Car mode</Text>
          <Switch
            trackColor={{ false: "#767577", true: "#90CAF9" }}
            thumbColor={carModeEnabled ? "#2962FF" : "#ffffff"}
            ios_backgroundColor="#3e3e3e"
            onValueChange={() => setCarModeEnabled((prev) => !prev)}
            value={carModeEnabled}
          />
        </View>
      </View>

      <View style={styles.cardView}>
        <Card card={card} />
      </View>
      <View style={styles.timerView}>
        <Text>{timerType === TimerTypes.prep ? "preparation" : "answer"}</Text>
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

const dynamicStyles = new DynamicStyleSheet({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: new DynamicValue("white", "black"),
    color: "white",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  settingsView: {
    position: "absolute",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    top: 20,
    right: 30,
    alignItems: "flex-end",
  },
  settingRow: {
    flexDirection: "row",
    marginBottom: 4,
  },
  settingsText: {
    marginRight: 8,
    marginTop: 2,
    color: new DynamicValue("black", "white"),
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
