import AsyncStorage from "@react-native-community/async-storage";

export const storeLastCardId = async (cardId) =>
  AsyncStorage.setItem("lastCardId", cardId.toString()).then(() =>
    console.log(`Saved: ${cardId}`)
  );

export const retrieveLastCardId = async () =>
  AsyncStorage.getItem("lastCardId");

export const readSettings = async () => {
  var items = await AsyncStorage.multiGet([
    "answerTime",
    "prepEnabled",
    "prepTime",
  ]);
  var settings = Object.fromEntries(items);
  settings.prepEnabled = settings.prepEnabled === "true";
  settings.answerTime = settings.answerTime ?? 120;
  settings.prepTime = settings.prepTime ?? 30;
  return settings;
};

export const saveSetting = async (setting, value) =>
  AsyncStorage.setItem(setting, value);
