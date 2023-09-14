export const timeObjectToSeconds = (timeObj) => {
  let result = timeObj.hr * 3600 + timeObj.min * 60 + timeObj.sec;
  return result;
};
