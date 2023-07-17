export function getAddressFromCoordinates({ latitude, longitude }) {
  return new Promise((resolve, reject) => {
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=13&addressdetails=1`;
    fetch(url)
      .then((resp) => resp.json())
      .then((repos) => {
        resolve(repos);
      })
      .catch((ex) => {
        reject(ex);
      });
  });
}
