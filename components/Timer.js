import React from "react";
import { View, StyleSheet } from "react-native";
import { Text, useTheme } from "react-native-paper";
import { secsToStr } from "../utils/TimeHelpers";
import { TimerStates, TimerTypes } from "../utils/Constants";

export default function Timer({ timerState, timerType, secs }) {
  const { colors } = useTheme();

  return (
    <View>
      <Text
        style={{
          ...styles.timeText,
          color: timerState === TimerStates.finished ? colors.red : colors.text,
        }}
      >
        {secsToStr(secs)}
      </Text>
      <Text style={{ ...styles.timerTypeText, color: colors.grey }}>
        {timerType === TimerTypes.prep ? "preparation" : "answer"}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  timeText: {
    fontSize: 64,
  },
  timerTypeText: {
    textAlign: "center",
    marginTop: -5,
  },
});
