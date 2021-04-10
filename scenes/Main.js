import React, { useState, useEffect, useRef } from "react";
import {
  SafeAreaView,
  Platform,
  StatusBar,
  View,
  StyleSheet,
  useWindowDimensions,
} from "react-native";
import BackgroundTimer from "react-native-background-timer";
import Carousel from "react-native-snap-carousel";
import TopPanel from "../components/TopPanel";
import Card from "../components/Card";
import Timer from "../components/Timer";
import BottomNav from "../components/BottomNav";
import { TimerStates, TimerTypes } from "../utils/Constants";
import Database from "../utils/Database";
import * as Storage from "../utils/Storage";
import * as Speech from "../utils/Speech";

export default function Main({ navigation }) {
  const [cards, setCards] = useState([]);
  const [cardId, setCardId] = useState();
  const [settings, setSettings] = useState({});
  const [secs, setSecs] = useState();
  const [timerState, setTimerState] = useState(TimerStates.notStarted);
  const [timerType, setTimerType] = useState(TimerTypes.none);
  const [carModeEnabled, setCarModeEnabled] = useState(false);
  const [db, setDb] = useState();
  const [settingsInitilized, setSettingsInitialized] = useState(false);
  const [cardsInitilized, setCardsInitialized] = useState(false);
  const [lastSaved, setLastSaved] = useState();

  const carousel = useRef();
  const sliderWidth = useWindowDimensions().width;

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

  useEffect(() => {
    db?.fetchCards()
      .then(setCards)
      .then(Storage.retrieveLastCardId)
      .then((val) => (val ? parseInt(val) : 0))
      .then(setLastSaved);
  }, [db]);

  useEffect(() => setupCards(lastSaved), [lastSaved]);

  useEffect(() => {
    console.log("card id:", cardId);
    if (cardId !== undefined) {
      if (settings.prepEnabled) {
        setSecs(settings.prepTime);
        setTimerType(TimerTypes.prep);
      } else {
        setSecs(settings.answerTime);
        setTimerType(TimerTypes.answer);
      }
      setTimerState(TimerStates.notStarted);
      Storage.storeLastCardId(cardId);
    }
  }, [cardId]);

  useEffect(() => {
    if (carModeEnabled) {
      Speech.readCard(cards[cardId], timerType, startTimer);
    }
    if (!carModeEnabled) {
      Speech.stop();
    }
  }, [cardId, carModeEnabled]);

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
    setSettingsInitialized(false);
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
      .then(() => setSettingsInitialized(true));
  };

  const setupCards = (firstCardId) => {
    if (!cards.length) return;
    setCardsInitialized(false);
    const offset = cards.findIndex((card) => card.id === firstCardId);
    offset > 0 && setCards(cards.slice(offset).concat(cards.slice(0, offset)));
    setCardsInitialized(true);
  };

  const nextCard = () => carousel?.current.snapToNext();

  const prevCard = () => carousel?.current.snapToPrev();

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

  const onSettingsChanged = () => {
    readSettings();
    Storage.retrieveLastCardId()
      .then((val) => (val ? parseInt(val) : 0))
      .then(setLastSaved);
  };

  const settingsOnClick = () => {
    setTimerState(TimerStates.paused);
    navigation.navigate("Settings", { onSettingsChanged: onSettingsChanged });
  };

  const carModeOnClick = () => setCarModeEnabled((prev) => !prev);

  const renderItem = ({ item }) => (
    <Card card={item} cardsCount={cards.length} />
  );

  return (
    (settingsInitilized && cardsInitilized && (
      <SafeAreaView style={styles.container}>
        <View style={styles.topPanelView}>
          <TopPanel
            settingsOnClick={settingsOnClick}
            carModeOnClick={carModeOnClick}
            carModeEnabled={carModeEnabled}
          />
        </View>
        <View style={styles.carouselView}>
          <Carousel
            ref={carousel}
            data={cards}
            loop={true}
            loopClonesPerSide={30}
            renderItem={renderItem}
            onSnapToItem={(id) => setCardId(cards[id].id)}
            sliderWidth={sliderWidth}
            itemWidth={sliderWidth - 60}
          />
        </View>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  topPanelView: {
    position: "absolute",
    top: 20,
    paddingRight: 30,
    paddingLeft: 30,
    width: "100%",
  },
  carouselView: {
    position: "absolute",
    top: 175,
    height: 325,
  },
  timerView: {
    position: "absolute",
    bottom: 125,
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
