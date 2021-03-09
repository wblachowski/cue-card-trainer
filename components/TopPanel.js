import React from "react";
import { View, StyleSheet } from "react-native";
import { Switch, Text, IconButton, useTheme } from "react-native-paper";
import * as colors from "../styles/colors";

export default function TopPanel({
  settingsOnClick,
  carModeOnClick,
  carModeEnabled,
}) {
  const themeColors = useTheme().colors;

  return (
    <View style={styles.container}>
      <View style={{ ...styles.row, ...styles.carMode }}>
        <Switch
          onValueChange={carModeOnClick}
          value={carModeEnabled}
          color={themeColors.primary}
          trackColor={{
            false: colors.GREY,
            true: themeColors.switchBackground,
          }}
        />
        <Text style={styles.text}>Car mode</Text>
      </View>
      <IconButton
        icon="settings"
        size={24}
        onPress={settingsOnClick}
        color={themeColors.primary}
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
