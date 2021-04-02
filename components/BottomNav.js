import React from "react";
import { View, StyleSheet } from "react-native";
import { TimerStates } from "../utils/Constants";
import { Button } from "react-native-paper";

export default function BottomNav({ timerState, playClicked }) {
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
      case TimerStates.running:
        return "pause";
      case TimerStates.finished:
        return "replay";
    }
    return "play";
  };

  return (
    <View style={styles.buttonView}>
      <Button mode="text" onPress={playClicked} icon={mainButtonIcon()}>
        {mainButtonText()}
      </Button>
    </View>
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
