export const timeStr = (secs) => {
  var t = secs >= 0 ? secs : 0;
  return `${Math.floor(t / 60)}:${String(t % 60).padStart(2, "0")}`;
};
