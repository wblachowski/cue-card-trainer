import React from "react";
import { Text, View } from "react-native";
import { Switch } from "react-native-paper";
import {
  DynamicStyleSheet,
  useDynamicStyleSheet,
  DynamicValue,
} from "react-native-dark-mode";
import { useTheme } from "react-native-paper";
import { IconButton } from "react-native-paper";

export default function TopPanel({
  settingsOnClick,
  carModeOnClick,
  carModeEnabled,
}) {
  const styles = useDynamicStyleSheet(dynamicStyles);
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

const dynamicStyles = new DynamicStyleSheet({
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
    color: new DynamicValue("black", "white"),
  },
});
