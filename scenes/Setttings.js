import React, { useState, useEffect } from "react";
import { View } from "react-native";
import { SettingsSwitch } from "react-native-settings-components";
import { useTheme, Portal } from "react-native-paper";
import SettingsEdit from "../components/SettingsEdit";
import TimeDialog from "../components/TimeDialog";
import {
  readSettings as readSettingsFromStorage,
  saveSetting,
} from "../utils/Storage";
import { secsToMinSecStr } from "../utils/TimeHelpers";
import * as colors from "../styles/colors";

export default function Settings({ route }) {
  const themeColors = useTheme().colors;

  const [answerTimeDialogVisible, setAnswerTimeDialogVisible] = useState(false);
  const [prepTimeDialogVisible, setPrepTimeDialogVisible] = useState(false);
  const [answerPlaceholder, setAnswerPlaceholder] = useState(["", ""]);
  const [prepPlaceholder, setPrepPlaceholder] = useState(["", ""]);
  const [prepEnabled, setPrepEnabled] = useState(false);
  const [answerTime, setAnswerTime] = useState(0);
  const [prepTime, setPrepTime] = useState(0);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    readSettingsFromStorage().then((settings) => {
      console.log(settings);
      setAnswerTime(settings.answerTime);
      setPrepEnabled(settings.prepEnabled);
      setPrepTime(settings.prepTime);
      setInitialized(true);
    });
  }, []);

  useEffect(() => {
    setAnswerPlaceholder(secsToMinSecStr(answerTime));
  }, [answerTime]);

  useEffect(() => {
    setPrepPlaceholder(secsToMinSecStr(prepTime));
  }, [prepTime]);

  const saveAnswerTime = (secs) => {
    setAnswerTimeDialogVisible(false);
    setAnswerTime(secs);
    saveSetting("answerTime", secs.toString()).then(
      route.params.onSettingsChanged
    );
  };

  const savePrepTime = (secs) => {
    setPrepTimeDialogVisible(false);
    setPrepTime(secs);
    saveSetting("prepTime", secs.toString()).then(
      route.params.onSettingsChanged
    );
  };

  const savePrepEnabled = (value) => {
    setPrepEnabled(value);
    saveSetting("prepEnabled", value.toString()).then(
      route.params.onSettingsChanged
    );
  };

  return (
    <View>
      {initialized && (
        <>
          <Portal>
            <TimeDialog
              title="Answer time"
              description="Set the time for answering questions."
              visible={answerTimeDialogVisible}
              initMinutes={answerPlaceholder[0]}
              initSeconds={answerPlaceholder[1]}
              onClose={() => setAnswerTimeDialogVisible(false)}
              onSave={saveAnswerTime}
            />
            <TimeDialog
              title="Preparation time"
              description="Set the time for preparing before answering questions."
              visible={prepTimeDialogVisible}
              initMinutes={prepPlaceholder[0]}
              initSeconds={prepPlaceholder[1]}
              onClose={() => setPrepTimeDialogVisible(false)}
              onSave={savePrepTime}
            />
          </Portal>
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
            onValueChange={savePrepEnabled}
            switchProps={{
              thumbColor: prepEnabled ? themeColors.primary : colors.WHITE,
            }}
            trackColor={{
              true: themeColors.switchBackground,
              false: colors.GREY,
            }}
            value={prepEnabled}
            containerStyle={{
              backgroundColor: themeColors.background,
            }}
            titleStyle={{ color: themeColors.text }}
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
