import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { Dialog, Paragraph, TextInput, Button, Text } from "react-native-paper";
import { useEffect } from "react/cjs/react.development";

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

  useEffect(() => setMinutes(initMinutes), [initMinutes]);
  useEffect(() => setSeconds(initSeconds), [initSeconds]);

  const saveTime = () => {
    const time =
      parseInt(minutes ?? initMinutes) * 60 + parseInt(seconds ?? initSeconds);
    onSave(time);
  };

  return (
    <Dialog visible={visible} onDismiss={onClose}>
      <Dialog.Title>{title}</Dialog.Title>
      <Dialog.Content>
        <Paragraph> {description}</Paragraph>
        <View style={styles.timeView}>
          <TextInput
            style={styles.timeInputStyle}
            textAlign="center"
            keyboardType="numeric"
            maxLength={2}
            placeholder={initMinutes}
            onChangeText={setMinutes}
          />
          <Text style={styles.separator}>:</Text>
          <TextInput
            style={styles.timeInputStyle}
            textAlign="center"
            keyboardType="numeric"
            maxLength={2}
            placeholder={initSeconds}
            onChangeText={setSeconds}
          />
        </View>
      </Dialog.Content>
      <Dialog.Actions style={styles.actions}>
        <Button onPress={onClose}>Cancel</Button>
        <Button onPress={saveTime}>Save</Button>
      </Dialog.Actions>
    </Dialog>
  );
}

const styles = StyleSheet.create({
  timeView: {
    marginTop: 10,
    flexDirection: "row",
    justifyContent: "center",
  },
  timeInputStyle: {
    backgroundColor: "transparent",
    height: 35,
    margin: 5,
  },
  separator: {
    position: "absolute",
    bottom: 15,
  },
  actions: {
    margin: 10,
  },
});
