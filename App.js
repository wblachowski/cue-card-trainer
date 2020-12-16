// import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  SafeAreaView,
  Platform,
  Button,
  StatusBar,
} from "react-native";

export default function App() {
  const [cue, setCue] = useState("No cues");

  const displayNextCue = () => {
    console.log("Next cue");
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text>{cue}</Text>
      <Button title="Next" onPress={displayNextCue}></Button>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
});
