import AsyncStorage from "@react-native-community/async-storage";

export const storeLastCardId = async (cardId) =>
  AsyncStorage.setItem("lastCardId", cardId.toString()).then(() =>
    console.log(`Saved: ${cardId}`)
  );

export const retrieveLastCardId = async () =>
  AsyncStorage.getItem("lastCardId");
