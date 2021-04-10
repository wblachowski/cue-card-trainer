import React from "react";
import { View, StyleSheet } from "react-native";
import { Switch, Text, IconButton, useTheme } from "react-native-paper";
import * as colors from "../styles/colors";

export default function TopPanel({
  settingsOnClick,
  autoModeOnClick,
  autoModeEnabled,
}) {
  const themeColors = useTheme().colors;

  return (
    <View style={styles.container}>
      <View style={{ ...styles.row, ...styles.autoMode }}>
        <Switch
          onValueChange={autoModeOnClick}
          value={autoModeEnabled}
          color={themeColors.primary}
          trackColor={{
            false: colors.GREY,
            true: themeColors.switchBackground,
          }}
        />
        <Text style={styles.text}>Auto mode</Text>
      </View>
      <IconButton icon="settings" size={24} onPress={settingsOnClick} />
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
  autoMode: {
    marginTop: 4,
  },
  text: {
    marginLeft: 5,
    marginTop: 10,
  },
});
