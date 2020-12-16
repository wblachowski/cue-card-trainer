import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  SafeAreaView,
  Platform,
  Button,
  StatusBar,
} from "react-native";
import * as FileSystem from "expo-file-system";
import { Asset } from "expo-asset";
import * as SQLite from "expo-sqlite";

function openDatabase(pathToDatabaseFile) {
  // if (
  //   !FileSystem.getInfoAsync(FileSystem.documentDirectory + "SQLite").exists
  // ) {
  //   FileSystem.makeDirectoryAsync(FileSystem.documentDirectory + "SQLite");
  // }
  FileSystem.downloadAsync(
    Asset.fromModule(require("./assets/cards.db")).uri,
    FileSystem.documentDirectory + "SQLite/cards.db"
  );
  return SQLite.openDatabase("cards.db");
}

const db = openDatabase();

export default function App() {
  const [cue, setCue] = useState("No cues");
  const [headline, setHeadline] = useState("");
  const [bullets, setBullets] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    let parts = cue.split("\n");
    setHeadline(parts[0]);
    setBullets(parts.slice(1));
  }, [cue]);

  const fetchData = () => {
    db.transaction((tx) => {
      tx.executeSql(
        "SELECT text FROM cards ORDER BY RANDOM() LIMIT 1",
        null,
        // success callback which sends two things Transaction object and ResultSet Object
        (
          txObj,
          {
            rows: {
              _array: [{ text }],
            },
          }
        ) => {
          console.log(text);
          setCue(text);
        },
        // failure callback which sends two things Transaction object and Error
        (txObj, error) => console.log("Error ", error)
      );
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text>{headline}</Text>
      {bullets.map((bullet, i) => (
        <Text key={i}>- {bullet}</Text>
      ))}
      <Button title="Next" onPress={fetchData}></Button>
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
