import React from "react";
import { Text, View } from "react-native";
import {
  DynamicStyleSheet,
  useDynamicStyleSheet,
} from "react-native-dark-mode";
import { secsToStr } from "../utils/TimeHelpers";
import { TimerStates, TimerTypes } from "../Constants";

export default function Timer({ timerState, timerType, secs }) {
  const styles = useDynamicStyleSheet(dynamicStyles);

  return (
    <View>
      <Text
        style={{
          ...styles.timeText,
          color: timerState === TimerStates.finished ? "red" : "black",
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
  },
});
