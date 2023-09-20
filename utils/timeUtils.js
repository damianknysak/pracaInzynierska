export const timeObjectToSeconds = (timeObj) => {
  let result = timeObj.hr * 3600 + timeObj.min * 60 + timeObj.sec;
  return result;
};

export const secondsToTimeObject = (seconds) => {
  const hr = Math.floor(seconds / 3600);
  const min = Math.floor((seconds % 3600) / 60);
  const sec = seconds % 60;

  return {hr, min, sec};
};
