import * as FileSystem from "expo-file-system";
import * as SQLite from "expo-sqlite";
import { Asset } from "expo-asset";

export default class Database {
  constructor() {
    this.db = this.openDatabase();
  }

  openDatabase() {
    // if (
    //   !FileSystem.getInfoAsync(FileSystem.documentDirectory + "SQLite").exists
    // ) {
    //   FileSystem.makeDirectoryAsync(FileSystem.documentDirectory + "SQLite");
    // }
    FileSystem.downloadAsync(
      Asset.fromModule(require("./assets/cards.db")).uri,
      FileSystem.documentDirectory + "SQLite/cards2.db"
    );
    return SQLite.openDatabase("cards2.db");
  }

  getCardsCount = () =>
    new Promise((resolve, reject) =>
      this.db.transaction((tx) =>
        tx.executeSql(
          "SELECT COUNT(*) AS count FROM cards",
          null,
          (
            txObj,
            {
              rows: {
                _array: [{ count }],
              },
            }
          ) => {
            resolve(count);
          },
          reject
        )
      )
    );

  fetchData = (id = 0) =>
    new Promise((resolve, reject) =>
      this.db.transaction((tx) =>
        tx.executeSql(
          "SELECT * FROM cards LIMIT 1 OFFSET ?",
          [id],
          // success
          (
            txObj,
            {
              rows: {
                _array: [fetchedCard],
              },
            }
          ) => {
            if (fetchedCard) {
              fetchedCard.bullets = fetchedCard.bullets?.split("\n") || [];
              resolve(fetchedCard);
            }
          },
          reject
        )
      )
    );
}
