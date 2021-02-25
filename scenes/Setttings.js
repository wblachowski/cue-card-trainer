import React, { useState } from "react";
import { View } from "react-native";
import SettingsEdit from "../components/SettingsEdit";
import { useEffect } from "react/cjs/react.development";
import { SettingsSwitch } from "react-native-settings-components";
import { useTheme } from "react-native-paper";
import TimeDialog from "../components/TimeDialog";
import {
  readSettings as readSettingsFromStorage,
  saveSetting,
} from "../utils/Storage";
import { secsToMinSecStr } from "../utils/TimeHelpers";
import * as colors from "../styles/colors";

export default function Settings() {
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
    saveSetting("answerTime", secs.toString());
  };

  const savePrepTime = (secs) => {
    setPrepTimeDialogVisible(false);
    setPrepTime(secs);
    saveSetting("prepTime", secs.toString());
  };

  const savePrepEnabled = (value) => {
    setPrepEnabled(value);
    saveSetting("prepEnabled", value.toString());
  };

  return (
    <View>
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
            switchProps={{
              thumbColor: prepEnabled ? colors.PRIMARY : colors.WHITE,
            }}
            trackColor={{ true: colors.LIGHT, false: colors.GREY }}
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
