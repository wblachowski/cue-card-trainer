import * as FileSystem from "expo-file-system";
import { Asset } from "expo-asset";

export default class Database {
  constructor(db) {
    this.db = db;
  }

  static initialize = async () => {
    let dirInfo;
    try {
      dirInfo = await FileSystem.getInfoAsync(
        `${FileSystem.documentDirectory}SQLite`
      );
    } catch (err) {
      console.log(err);
    }

    if (!dirInfo.exists) {
      try {
        await FileSystem.makeDirectoryAsync(
          `${FileSystem.documentDirectory}SQLite`,
          { intermediates: true }
        );
      } catch (err) {
        console.log(err);
      }
    }

    return FileSystem.downloadAsync(
      Asset.fromModule(require("./assets/cards.db")).uri,
      FileSystem.documentDirectory + "SQLite/cards2.db"
    );
  };

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
