import React from "react";
import { View, StyleSheet, StatusBar } from "react-native";
import { Button } from "react-native-material-ui";
import { TimerStates } from "../Constants";

export default function BottomNav({
  timerState,
  prevClicked,
  playClicked,
  nextClicked,
}) {
  const mainButtonText = () => {
    switch (timerState) {
      case TimerStates.notStarted:
        return "start";
      case TimerStates.running:
        return "pause";
      case TimerStates.paused:
        return "resume";
      case TimerStates.finished:
        return "restart";
    }
    return "";
  };

  const mainButtonIcon = () => {
    switch (timerState) {
      case TimerStates.notStarted:
        return "play-arrow";
      case TimerStates.running:
        return "pause";
      case TimerStates.paused:
        return "play-arrow";
      case TimerStates.finished:
        return "replay";
    }
    return "play-arrow";
  };

  return (
    <>
      <View style={styles.buttonView}>
        <Button primary text="Prev" onPress={prevClicked}></Button>
      </View>
      <View style={styles.buttonView}>
        <Button
          primary
          text={mainButtonText()}
          onPress={playClicked}
          icon={mainButtonIcon()}
        ></Button>
      </View>
      <View style={styles.buttonView}>
        <Button primary text="Next" onPress={nextClicked}></Button>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  buttonView: {
    justifyContent: "space-between",
    flex: 1,
    marginLeft: 4,
    marginRight: 4,
  },
});
