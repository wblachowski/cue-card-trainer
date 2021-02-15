import React from "react";
import { Text, View } from "react-native";
import {
  DynamicStyleSheet,
  DynamicValue,
  useDynamicStyleSheet,
  useDarkMode,
} from "react-native-dark-mode";
import { secsToStr } from "../utils/TimeHelpers";
import { TimerStates, TimerTypes } from "../Constants";
import * as colors from "../styles/colors";

export default function Timer({ timerState, timerType, secs }) {
  const styles = useDynamicStyleSheet(dynamicStyles);
  const isDarkMode = useDarkMode();

  return (
    <View>
      <Text
        style={{
          ...styles.timeText,
          color:
            timerState === TimerStates.finished
              ? "red"
              : isDarkMode
              ? "white"
              : "black",
        }}
      >
        {secsToStr(secs)}
      </Text>
      <Text style={styles.timerTypeText}>
        {timerType === TimerTypes.prep ? "preparation" : "answer"}
      </Text>
    </View>
  );
}

const dynamicStyles = new DynamicStyleSheet({
  timeText: {
    fontSize: 64,
  },
  timerTypeText: {
    textAlign: "center",
    marginTop: -5,
    color: new DynamicValue(colors.GREY, colors.LIGHTER_GREY),
  },
});
