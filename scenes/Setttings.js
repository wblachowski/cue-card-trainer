import React, { useState } from "react";
import { View } from "react-native";
import SettingsEdit from "../components/SettingsEdit";
import AsyncStorage from "@react-native-community/async-storage";
import { useEffect } from "react/cjs/react.development";
import { SettingsSwitch } from "react-native-settings-components";
import TimeDialog from "../components/TimeDialog";
import { useDarkMode } from "react-native-dark-mode";

export default function Settings() {
  const isDarkMode = useDarkMode();

  const [answerTimeDialogVisible, setAnswerTimeDialogVisible] = useState(false);
  const [prepTimeDialogVisible, setPrepTimeDialogVisible] = useState(false);
  const [answerPlaceholder, setAnswerPlaceholder] = useState(["", ""]);
  const [prepPlaceholder, setPrepPlaceholder] = useState(["", ""]);
  const [prepEnabled, setPrepEnabled] = useState(false);
  const [answerTime, setAnswerTime] = useState(0);
  const [prepTime, setPrepTime] = useState(0);
  const [initialized, setInitialized] = useState(false);

  const readSettings = async () => {
    var items = await AsyncStorage.multiGet([
      "answerTime",
      "prepEnabled",
      "prepTime",
    ]);
    return Object.fromEntries(items);
  };

  useEffect(() => {
    readSettings().then((settings) => {
      console.log(settings);
      setAnswerTime(settings.answerTime ?? 120);
      setPrepEnabled(settings.prepEnabled === "true");
      setPrepTime(settings.prepTime ?? 30);
      setInitialized(true);
    });
    console.log("INIT SETTINGS COMPONENT!");
  }, []);

  useEffect(() => {
    var minutes = String(Math.floor(answerTime / 60));
    var secs = String(answerTime % 60).padStart(2, "0");
    setAnswerPlaceholder([minutes, secs]);
  }, [answerTime]);

  useEffect(() => {
    var minutes = String(Math.floor(prepTime / 60));
    var secs = String(prepTime % 60).padStart(2, "0");
    setPrepPlaceholder([minutes, secs]);
  }, [prepTime]);

  const saveAnswerTime = (secs) => {
    setAnswerTimeDialogVisible(false);
    setAnswerTime(secs);
    AsyncStorage.setItem("answerTime", secs.toString());
  };

  const savePrepTime = (secs) => {
    setPrepTimeDialogVisible(false);
    setPrepTime(secs);
    AsyncStorage.setItem("prepTime", secs.toString());
  };

  const savePrepEnabled = (value) => {
    setPrepEnabled(value);
    AsyncStorage.setItem("prepEnabled", value.toString());
  };

  return (
    <View
      style={{
        backgroundColor: isDarkMode ? "black" : "white",
        height: "100%",
      }}
    >
      {initialized && (
        <>
          <TimeDialog
            title="Answer time"
            description="Set the time for answering questions."
            visible={answerTimeDialogVisible}
            initMinutes={answerPlaceholder[0]}
            initSeconds={answerPlaceholder[1]}
            onClose={() => setAnswerTimeDialogVisible(false)}
            onSave={(secs) => saveAnswerTime(secs)}
          />
          <TimeDialog
            title="Preparation time"
            description="Set the time for preparing before answering questions."
            visible={prepTimeDialogVisible}
            initMinutes={prepPlaceholder[0]}
            initSeconds={prepPlaceholder[1]}
            onClose={() => setPrepTimeDialogVisible(false)}
            onSave={(secs) => savePrepTime(secs)}
          />
          <SettingsEdit
            title="Answer time"
            valuePlaceholder="..."
            onPress={() => {
              setAnswerTimeDialogVisible(true);
            }}
            value={`${answerPlaceholder[0]}:${answerPlaceholder[1]}`}
          />
          <SettingsSwitch
            title={"Enable time for preparation"}
            onValueChange={(value) => {
              savePrepEnabled(value);
            }}
            value={prepEnabled}
            containerStyle={{ backgroundColor: isDarkMode ? "black" : "white" }}
            titleStyle={{ color: isDarkMode ? "white" : "black" }}
          />
        </>
      )}
      {initialized && prepEnabled && (
        <SettingsEdit
          title="Preparation Time"
          valuePlaceholder="..."
          onPress={() => {
            setPrepTimeDialogVisible(true);
          }}
          value={`${prepPlaceholder[0]}:${prepPlaceholder[1]}`}
        />
      )}
    </View>
  );
}