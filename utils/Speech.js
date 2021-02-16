import * as Speech from "expo-speech";
import { TimerTypes } from "./Constants";

export const readCard = (card, timerType, onDone) => {
  Speech.stop();
  Speech.speak(card.title);
  Speech.speak(card.prompt);
  Speech.speak(card.bullets?.join(",\n"));
  Speech.speak(card.ending);
  var prompt = timerType === TimerTypes.prep ? "Prepare" : "Answer";
  Speech.speak(prompt, {
    onDone: onDone,
  });
};

export const speak = (text, onDone) => {
  Speech.speak(text, {
    onDone: onDone,
  });
};

export const stop = Speech.stop;
