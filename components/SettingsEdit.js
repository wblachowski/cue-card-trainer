import React from "react";
import { TouchableOpacity, View, StyleSheet } from "react-native";
import { Text } from "react-native-paper";

export default function SettingsEdit({
  title,
  valuePlaceholder,
  value,
  onPress,
}) {
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

const styles = StyleSheet.create({
  containerStyle: {
    padding: 0,
    minHeight: 50,
    alignItems: "center",
    flexDirection: "row",
  },
  titleStyle: {
    flex: 1,
    paddingLeft: 16,
    paddingRight: 8,
    fontSize: 16,
  },
  valueStyle: {
    opacity: 0.6,
    fontSize: 14,
    flex: 1,
    paddingLeft: 8,
    paddingRight: 16,
    textAlign: "right",
  },
});
