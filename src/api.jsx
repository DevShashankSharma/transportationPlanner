import axios from "axios";
export async function fetchRoute(start, end) {
  try {
    const apiKey = "5b3ce3597851110001cf624870e7ba6c0ea64b49af744abb980f67da";
    const url = `https://api.openrouteservice.org/geocode/search?api_key=${apiKey}&text=${start}`;
    const url2 = `https://api.openrouteservice.org/geocode/search?api_key=${apiKey}&text=${end}`;
    const [startRes, endRes] = await Promise.all([axios.get(url), axios.get(url2)]);
    const startCoords = startRes.data.features[0].geometry.coordinates;
    const endCoords = endRes.data.features[0].geometry.coordinates;
    const routeUrl = `https://api.openrouteservice.org/v2/directions/driving-car?api_key=${apiKey}&start=${startCoords[0]},${startCoords[1]}&end=${endCoords[0]},${endCoords[1]}`;
    const response = await axios.get(routeUrl);
    return {
      route: response.data.routes[0].geometry.coordinates.map(([lon, lat]) => [lat, lon]),
      distance: (response.data.routes[0].summary.distance / 1000).toFixed(2),
      duration: (response.data.routes[0].summary.duration / 60).toFixed(2)
    };
  } catch (error) {
    console.error("Error fetching route:", error);
    return null;
  }
}
