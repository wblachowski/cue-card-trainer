import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  Platform,
  StatusBar,
  View,
  ScrollView,
} from "react-native";
import BackgroundTimer from "react-native-background-timer";
import {
  DynamicStyleSheet,
  DynamicValue,
  useDynamicStyleSheet,
} from "react-native-dark-mode";
import TopPanel from "../components/TopPanel";
import Card from "../components/Card";
import Timer from "../components/Timer";
import BottomNav from "../components/BottomNav";
import { TimerStates, TimerTypes } from "../Constants";
import Database from "../Database";
import * as Storage from "../utils/Storage";
import * as Speech from "../utils/Speech";
import * as colors from "../styles/colors";

export default function Main({ navigation }) {
  const [card, setCard] = useState();
  const [settings, setSettings] = useState({});
  const [secs, setSecs] = useState();
  const [timerState, setTimerState] = useState(TimerStates.notStarted);
  const [timerType, setTimerType] = useState(TimerTypes.none);
  const [cardId, setCardId] = useState(-1);
  const [cardCount, setCardCount] = useState(-1);
  const [carModeEnabled, setCarModeEnabled] = useState(false);
  const [db, setDb] = useState();
  const [initilized, setInitialized] = useState(false);
  const styles = useDynamicStyleSheet(dynamicStyles);

  useEffect(() => {
    Database.initialize().then(setDb);
    readSettings();
  }, []);

  useEffect(() => {
    if (timerType === TimerTypes.answer) {
      setSecs(settings.answerTime);
    } else {
      setSecs(settings.prepTime);
    }
  }, [timerType]);

  useEffect(() => navigation.addListener("focus", readSettings), [navigation]);

  useEffect(() => {
    db?.getCardsCount()
      .then(setCardCount)
      .then(Storage.retrieveLastCardId)
      .then(parseInt)
      .then(setCardId);
  }, [db]);

  useEffect(() => {
    if (cardId >= 0) {
      if (settings.prepEnabled) {
        setSecs(settings.prepTime);
        setTimerType(TimerTypes.prep);
      } else {
        setSecs(settings.answerTime);
        setTimerType(TimerTypes.answer);
      }
      setTimerState(TimerStates.notStarted);
      fetchData(cardId);
      Storage.storeLastCardId(cardId);
    }
  }, [cardId]);

  useEffect(() => {
    if (card && carModeEnabled) {
      Speech.readCard(card, timerType, startTimer);
    }
    if (!carModeEnabled) {
      Speech.stop();
    }
  }, [card, carModeEnabled]);

  useEffect(() => {
    let interval = null;
    if (timerState === TimerStates.running) {
      interval = BackgroundTimer.setInterval(
        () => setSecs((secs) => secs - 1),
        1000
      );
    }
    if (secs <= 0 && timerType === TimerTypes.answer) {
      setTimerState(TimerStates.finished);
    }
    if (secs < 0 && timerType === TimerTypes.prep) {
      if (carModeEnabled) {
        Speech.speak("Answer", () => setTimerType(TimerTypes.answer));
      }
      setTimerType(TimerTypes.answer);
    }
    if (timerState === TimerStates.finished && carModeEnabled) {
      Speech.speak("Time's up!", nextCard);
    }
    return () => BackgroundTimer.clearInterval(interval);
  }, [timerState, secs]);

  const readSettings = () => {
    setInitialized(false);
    Storage.readSettings()
      .then((settings) => {
        setSettings(settings);
        console.log("settings:", settings);
        if (settings.prepEnabled) {
          setTimerType(TimerTypes.prep);
          setSecs(settings.prepTime);
        } else {
          setTimerType(TimerTypes.answer);
          setSecs(settings.answerTime);
        }
        setTimerState(TimerStates.notStarted);
      })
      .then(() => setInitialized(true));
  };

  const fetchData = (cardId) => db.fetchData(cardId).then(setCard);

  const nextCard = () =>
    setCardId((prev) => (prev + 1 >= cardCount ? 0 : prev + 1));

  const prevCard = () =>
    setCardId((prev) => (prev - 1 < 0 ? cardCount - 1 : prev - 1));

  const startTimer = () => {
    if (settings.prepEnabled) {
      setTimerType(TimerTypes.prep);
      setSecs(settings.prepTime);
    } else {
      setSecs(settings.answerTime);
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

  const settingsOnClick = () => {
    setTimerState(TimerStates.paused);
    navigation.navigate("Settings");
  };

  const carModeOnClick = () => setCarModeEnabled((prev) => !prev);

  return (
    (initilized && card && (
      <SafeAreaView style={styles.container}>
        <View style={styles.topPanelView}>
          <TopPanel
            settingsOnClick={settingsOnClick}
            carModeOnClick={carModeOnClick}
            carModeEnabled={carModeEnabled}
          />
        </View>
        <ScrollView style={styles.cardView}>
          <Card card={card} />
        </ScrollView>
        <View style={styles.timerView}>
          <Timer timerState={timerState} timerType={timerType} secs={secs} />
        </View>
        <View style={styles.bottomNavView}>
          <BottomNav
            prevClicked={prevCard}
            playClicked={mainButtonAction}
            nextClicked={nextCard}
            timerState={timerState}
          />
        </View>
      </SafeAreaView>
    )) ||
    null
  );
}

const dynamicStyles = new DynamicStyleSheet({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: new DynamicValue(colors.WHITE, colors.DARK_GREY),
    color: colors.WHITE,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  topPanelView: {
    position: "absolute",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    top: 20,
    right: 30,
  },
  cardView: {
    position: "absolute",
    height: 280,
    overflow: "scroll",
    left: 0,
    top: 200,
    paddingLeft: 30,
    paddingRight: 30,
  },
  timerView: {
    position: "absolute",
    bottom: 150,
  },
  bottomNavView: {
    flexDirection: "row",
    position: "absolute",
    bottom: 28,
    width: "100%",
    paddingLeft: 22,
    paddingRight: 22,
  },
});
