import React from "react";
import { Text, View, Switch } from "react-native";
import { Button } from "react-native-material-ui";
import {
  DynamicStyleSheet,
  useDynamicStyleSheet,
  DynamicValue,
} from "react-native-dark-mode";
import * as colors from "../styles/colors";

export default function TopPanel({
  settingsOnClick,
  carModeOnClick,
  carModeEnabled,
}) {
  const styles = useDynamicStyleSheet(dynamicStyles);

  return (
    <View style={styles.container}>
      <Button
        primary
        text=""
        style={{ color: colors.PRIMARY }}
        icon="settings"
        onPress={settingsOnClick}
        style={{ text: { color: colors.PRIMARY } }}
      />
      <View style={styles.row}>
        <Text style={styles.text}>Car mode</Text>
        <Switch
          trackColor={{ false: colors.GREY, true: colors.LIGHT }}
          thumbColor={carModeEnabled ? colors.PRIMARY : colors.WHITE}
          onValueChange={carModeOnClick}
          value={carModeEnabled}
        />
      </View>
    </View>
  );
}

const dynamicStyles = new DynamicStyleSheet({
  container: {
    alignItems: "flex-end",
  },
  row: {
    flexDirection: "row",
    marginBottom: 4,
  },
  text: {
    marginRight: 8,
    marginTop: 2,
    color: new DynamicValue("black", "white"),
  },
});
