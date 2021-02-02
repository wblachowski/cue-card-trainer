import React, { useState } from "react";
import { Text, View, TextInput, StyleSheet } from "react-native";
import Dialog from "react-native-dialog";
import { useEffect } from "react/cjs/react.development";
import { useDarkMode } from "react-native-dark-mode";
import * as colors from "../styles/colors";

export default function TimeDialog({
  title,
  description,
  initMinutes,
  initSeconds,
  visible,
  onClose,
  onSave,
}) {
  const [minutes, setMinutes] = useState(initMinutes);
  const [seconds, setSeconds] = useState(initSeconds);
  const isDarkMode = useDarkMode();

  useEffect(() => setMinutes(initMinutes), [initMinutes]);
  useEffect(() => setSeconds(initSeconds), [initSeconds]);

  const saveTime = () => {
    const time =
      parseInt(minutes ?? initMinutes) * 60 + parseInt(seconds ?? initSeconds);
    onSave(time);
  };

  return (
    <Dialog.Container
      visible={visible}
      onBackdropPress={onClose}
      contentStyle={{
        backgroundColor: isDarkMode ? "black" : "white",
      }}
    >
      <Dialog.Title style={{ color: isDarkMode ? "white" : "black" }}>
        {title}
      </Dialog.Title>
      <Dialog.Description style={{ color: isDarkMode ? "white" : "black" }}>
        {description}
      </Dialog.Description>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "center",
        }}
      >
        <Dialog.Input
          underlineColorAndroid={colors.DARK}
          style={styles.timeInputStyle}
          textAlign="center"
          keyboardType="numeric"
          maxLength={2}
          placeholder={initMinutes}
          onChangeText={(text) => setMinutes(text)}
          placeholderTextColor={
            isDarkMode ? "rgba(255,255,255,0.6)" : "rgba(0,0,0,0.6)"
          }
          style={{ color: isDarkMode ? "white" : "black" }}
        />
        <Text
          style={{
            position: "absolute",
            bottom: 30,
            color: isDarkMode ? "white" : "black",
          }}
        >
          :
        </Text>
        <Dialog.Input
          underlineColorAndroid={colors.DARK}
          style={styles.timeInputStyle}
          textAlign="center"
          keyboardType="numeric"
          maxLength={2}
          placeholder={initSeconds}
          onChangeText={(text) => setSeconds(text)}
          placeholderTextColor={
            isDarkMode ? "rgba(255,255,255,0.6)" : "rgba(0,0,0,0.6)"
          }
          style={{ color: isDarkMode ? "white" : "black" }}
        />
      </View>
      <Dialog.Button label="Cancel" onPress={onClose} />
      <Dialog.Button label="Save" onPress={saveTime} />
    </Dialog.Container>
  );
}

const styles = StyleSheet.create({
  timeInputStyle: {
    width: 40,
  },
});
