import React from "react";
import { View, StyleSheet } from "react-native";
import { TimerStates } from "../utils/Constants";
import { Button } from "react-native-paper";
import * as colors from "../styles/colors";

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
      case TimerStates.running:
        return "pause";
      case TimerStates.finished:
        return "replay";
    }
    return "play";
  };

  return (
    <>
      <View style={styles.buttonView}>
        <Button mode="text" onPress={prevClicked} color={colors.PRIMARY}>
          Prev
        </Button>
      </View>
      <View style={styles.buttonView}>
        <Button
          mode="text"
          onPress={playClicked}
          icon={mainButtonIcon()}
          color={colors.PRIMARY}
        >
          {mainButtonText()}
        </Button>
      </View>
      <View style={styles.buttonView}>
        <Button mode="text" onPress={nextClicked} color={colors.PRIMARY}>
          Next
        </Button>
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
