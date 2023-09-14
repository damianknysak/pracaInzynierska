export function getAddressFromCoordinates({latitude, longitude}) {
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

export function distance(coords1, coords2) {
  const R = 6371e3; // metres
  const φ1 = (coords1.lat * Math.PI) / 180; // φ, λ in radians
  const φ2 = (coords2.lat * Math.PI) / 180;
  const Δφ = ((coords2.lat - coords1.lat) * Math.PI) / 180;
  const Δλ = ((coords2.lon - coords1.lon) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return (R * c) / 1000; // in metres
}
