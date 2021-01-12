import React, { useState } from "react";
import { Text, View, TextInput, StyleSheet } from "react-native";
import Dialog from "react-native-dialog";
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
    <Dialog.Container visible={visible} onBackdropPress={onClose}>
      <Dialog.Title>{title}</Dialog.Title>
      <Dialog.Description>{description}</Dialog.Description>
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
          placeholder={initMinutes}
          onChangeText={(text) => setMinutes(text)}
        />
        <Text style={{ position: "absolute", bottom: 30 }}>:</Text>
        <Dialog.Input
          underlineColorAndroid="blue"
          style={styles.timeInputStyle}
          textAlign="center"
          keyboardType="numeric"
          maxLength={2}
          placeholder={initSeconds}
          onChangeText={(text) => setSeconds(text)}
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
