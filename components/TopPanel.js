import React from "react";
import { View, StyleSheet } from "react-native";
import { Switch, Text } from "react-native-paper";
import { useTheme } from "react-native-paper";
import { IconButton } from "react-native-paper";

export default function TopPanel({
  settingsOnClick,
  carModeOnClick,
  carModeEnabled,
}) {
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      <View style={{ ...styles.row, ...styles.carMode }}>
        <Switch
          onValueChange={carModeOnClick}
          value={carModeEnabled}
          color={colors.primary}
        />
        <Text style={styles.text}>Car mode</Text>
      </View>
      <IconButton
        icon="settings"
        size={24}
        onPress={settingsOnClick}
        color={colors.primary}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  row: {
    flexDirection: "row",
    marginBottom: 4,
  },
  carMode: {
    marginTop: 4,
  },
  text: {
    marginLeft: 5,
    marginTop: 10,
  },
});
