import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

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
    backgroundColor: "white",
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
    color: "rgb(160,160,160)",
    fontSize: 14,
    flex: 1,
    paddingLeft: 8,
    paddingRight: 16,
    textAlign: "right",
  },
  disabledOverlayStyle: {
    backgroundColor: "rgba(255,255,255,0.6)",
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  },
});
