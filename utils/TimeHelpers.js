export const secsToStr = (secs) => {
  var t = secs >= 0 ? secs : 0;
  return `${Math.floor(t / 60)}:${String(t % 60).padStart(2, "0")}`;
};

export const secsToMinSecStr = (secs) => {
  var minutes = String(Math.floor(secs / 60));
  var seconds = String(secs % 60).padStart(2, "0");
  return [minutes, seconds];
};
