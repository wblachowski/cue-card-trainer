import * as FileSystem from "expo-file-system";
import { Asset } from "expo-asset";
import * as SQLite from "expo-sqlite";

export default class Database {
  constructor(dbPath) {
    this.db = SQLite.openDatabase(dbPath);
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

    let dbInfo = await FileSystem.getInfoAsync(
      `${FileSystem.documentDirectory}` + "SQLite/cards.db"
    );
    if (!dbInfo.exists) {
      console.log("db doesnt exist");
      return FileSystem.downloadAsync(
        Asset.fromModule(require("../assets/cards.db")).uri,
        FileSystem.documentDirectory + "SQLite/cards.db"
      );
    }
    console.log("db exists");
    return new Database("cards.db");
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

  fetchCards = () =>
    new Promise((resolve, reject) =>
      this.db.transaction((tx) =>
        tx.executeSql(
          "SELECT * FROM cards",
          [],
          (txObj, { rows: { _array: cards } }) => {
            cards.forEach((card, idx) => {
              card.bullets = card.bullets?.split("\n") || [];
              card.id = idx;
            });
            resolve(cards);
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
