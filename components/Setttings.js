import React, { useState } from "react";
import { Text, View, TextInput, StyleSheet } from "react-native";
import SettingsEdit from "./SettingsEdit";
import Dialog from "react-native-dialog";
import AsyncStorage from "@react-native-community/async-storage";
import { useEffect } from "react/cjs/react.development";
import { SettingsSwitch } from "react-native-settings-components";

export default function Settings({ onUpdate }) {
  const [timeDialogVisible, setTimeDialogVisible] = useState(false);
  const [minutes, setMinutes] = useState("");
  const [seconds, setSeconds] = useState("");
  const [minutesPlaceholder, setMinutesPlaceholder] = useState(minutes);
  const [secondsPlaceholder, setSecondsPlaceholder] = useState(seconds);
  const [preparationTimeEnabled, setPreparationTimeEnabled] = useState(false);
  const [answerTime, setAnswerTime] = useState(120);

  const readSettings = async () => {
    var items = await AsyncStorage.multiGet([
      "answerTime",
      "preparationTimeEnabled",
    ]);
    return Object.fromEntries(items);
  };

  useEffect(() => {
    const readData = async () =>
      readSettings().then((settings) => {
        console.log(settings);
        setAnswerTime(settings.answerTime || 120);
        setPreparationTimeEnabled(settings.preparationTimeEnabled === "true");
      });
    readData();
  }, []);

  useEffect(() => {
    setMinutes(String(Math.floor(answerTime / 60)));
    setSeconds(String(answerTime % 60));
    setMinutesPlaceholder(String(Math.floor(answerTime / 60)));
    setSecondsPlaceholder(String(answerTime % 60).padStart(2, "0"));
  }, [answerTime]);

  const savePreparationTime = async (value) => {
    AsyncStorage.setItem("preparationTimeEnabled", value.toString());
  };

  const saveSettings = () => {
    console.log(preparationTimeEnabled);
    setTimeDialogVisible(false);
    const time = parseInt(minutes) * 60 + parseInt(seconds);
    setAnswerTime(time);
    AsyncStorage.multiSet([
      ["answerTime", time.toString()],
      ["preparationTimeEnabled", preparationTimeEnabled.toString()],
    ]).then(onUpdate);
  };

  return (
    <View>
      <Dialog.Container
        visible={timeDialogVisible}
        onBackdropPress={() => setTimeDialogVisible(false)}
      >
        <Dialog.Title>Answer time</Dialog.Title>
        <Dialog.Description>
          Set the time for answering questions.
        </Dialog.Description>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
          }}
        >
          <Dialog.Input
            underlineColorAndroid="blue"
            style={styles.timeInputStyle}
            textAlign="center"
            keyboardType="numeric"
            maxLength={2}
            placeholder={minutesPlaceholder}
            onChangeText={(text) => setMinutes(text)}
          />
          <Text style={{ position: "absolute", bottom: 30 }}>:</Text>
          <Dialog.Input
            underlineColorAndroid="blue"
            style={styles.timeInputStyle}
            textAlign="center"
            keyboardType="numeric"
            maxLength={2}
            placeholder={secondsPlaceholder}
            onChangeText={(text) => setSeconds(text)}
          />
        </View>
        <Dialog.Button
          label="Cancel"
          onPress={() => setTimeDialogVisible(false)}
        />
        <Dialog.Button label="Save" onPress={() => saveSettings()} />
      </Dialog.Container>
      <SettingsEdit
        title="Answer time"
        valuePlaceholder="..."
        onPress={() => {
          setTimeDialogVisible(true);
        }}
        value={`${minutesPlaceholder}:${secondsPlaceholder}`}
      />
      <SettingsSwitch
        title={"Enable time for preparation"}
        onValueChange={(value) => {
          setPreparationTimeEnabled(value);
          savePreparationTime(value);
        }}
        value={preparationTimeEnabled}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  timeInputStyle: {
    width: 40,
  },
});
