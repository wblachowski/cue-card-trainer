import React from "react";
import { Text, View, Switch } from "react-native";
import { Button } from "react-native-material-ui";
import {
  DynamicStyleSheet,
  useDynamicStyleSheet,
  DynamicValue,
} from "react-native-dark-mode";
import * as colors from "../styles/colors";
import { IconButton } from "react-native-paper";

export default function TopPanel({
  settingsOnClick,
  carModeOnClick,
  carModeEnabled,
}) {
  const styles = useDynamicStyleSheet(dynamicStyles);

  return (
    <View style={styles.container}>
      <View style={{ ...styles.row, ...styles.carMode }}>
        <Switch
          trackColor={{ false: colors.GREY, true: colors.LIGHT }}
          thumbColor={carModeEnabled ? colors.PRIMARY : colors.WHITE}
          onValueChange={carModeOnClick}
          value={carModeEnabled}
        />
        <Text style={styles.text}>Car mode</Text>
      </View>
      <IconButton
        icon="settings"
        size={24}
        onPress={settingsOnClick}
        color={colors.PRIMARY}
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
