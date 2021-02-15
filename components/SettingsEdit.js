import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import {
  DynamicStyleSheet,
  DynamicValue,
  useDynamicStyleSheet,
} from "react-native-dark-mode";
import * as colors from "../styles/colors";

export default function SettingsEdit({
  title,
  valuePlaceholder,
  value,
  onPress,
}) {
  const styles = useDynamicStyleSheet(dynamicStyles);

  return (
    <TouchableOpacity onPress={() => onPress()}>
      <View style={styles.containerStyle}>
        <Text numberOfLines={1} style={styles.titleStyle}>
          {title}
        </Text>
        <Text numberOfLines={1} style={styles.valueStyle}>
          {value || valuePlaceholder}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const dynamicStyles = new DynamicStyleSheet({
  containerStyle: {
    padding: 0,
    minHeight: 50,
    alignItems: "center",
    flexDirection: "row",
    backgroundColor: new DynamicValue(colors.WTHIE, colors.DARK_GREY),
  },
  titleStyle: {
    flex: 1,
    paddingLeft: 16,
    paddingRight: 8,
    fontSize: 16,
    color: new DynamicValue("black", "white"),
  },
  valueStyle: {
    color: colors.LIGHT_GREY,
    fontSize: 14,
    flex: 1,
    paddingLeft: 8,
    paddingRight: 16,
    textAlign: "right",
  },
});
