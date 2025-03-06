import { useState } from "react";
import { MapContainer, TileLayer, Marker, Polyline, Popup } from "react-leaflet";
import axios from "axios";
import "leaflet/dist/leaflet.css";
import { FaRoute, FaMapMarkerAlt } from "react-icons/fa";

export default function SmartRouteFinder() {
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [startCoords, setStartCoords] = useState([37.7749, -122.4194]); // Default: San Francisco
  const [endCoords, setEndCoords] = useState([34.0522, -118.2437]); // Default: Los Angeles
  const [route, setRoute] = useState([]);
  const [loading, setLoading] = useState(false);
  const [distance, setDistance] = useState(null);
  const [duration, setDuration] = useState(null);

  const geocodeLocation = async (location) => {
    const apiKey = "5b3ce3597851110001cf624870e7ba6c0ea64b49af744abb980f67da"; // Replace with your OpenCage API key
    const url = `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(location)}&key=${apiKey}`;
    try {
      const response = await axios.get(url);
      const { lat, lng } = response.data.results[0].geometry;
      return [lat, lng];
    } catch (error) {
      console.error("Error geocoding location:", error);
      return null;
    }
  };

  const fetchRoute = async () => {
    setLoading(true);
    const startCoordinates = await geocodeLocation(start);
    const endCoordinates = await geocodeLocation(end);
    if (!startCoordinates || !endCoordinates) {
      setLoading(false);
      return;
    }
    setStartCoords(startCoordinates);
    setEndCoords(endCoordinates);
    
    const apiKey = "5b3ce3597851110001cf624870e7ba6c0ea64b49af744abb980f67da"; // Replace with your API key
    const url = `https://api.openrouteservice.org/v2/directions/driving-car?api_key=${apiKey}&start=${startCoordinates[1]},${startCoordinates[0]}&end=${endCoordinates[1]},${endCoordinates[0]}`;

    try {
      const response = await axios.get(url);
      const coordinates = response.data.routes[0].geometry.coordinates;
      setRoute(coordinates.map(([lon, lat]) => [lat, lon]));
      setDistance((response.data.routes[0].summary.distance / 1000).toFixed(2)); // Convert to km
      setDuration((response.data.routes[0].summary.duration / 60).toFixed(2)); // Convert to minutes
    } catch (error) {
      console.error("Error fetching route:", error);
    }
    setLoading(false);
  };

  return (
    <div className="p-8 max-w-4xl mx-auto bg-white shadow-lg rounded-lg border border-gray-200">      
      <h1 className="text-4xl font-extrabold mb-6 text-center text-blue-600 flex items-center justify-center">
        <FaRoute className="mr-2" /> Smart Route Finder
      </h1>

      {/* Input Fields */}
      <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
        <input
          type="text"
          placeholder="Enter Start Location"
          className="border p-3 w-full rounded-lg focus:ring focus:ring-blue-300"
          onChange={(e) => setStart(e.target.value)}
        />
        <input
          type="text"
          placeholder="Enter Destination"
          className="border p-3 w-full rounded-lg focus:ring focus:ring-blue-300"
          onChange={(e) => setEnd(e.target.value)}
        />
      </div>

      {/* Find Route Button */}
      <button
        onClick={fetchRoute}
        className="w-full p-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg hover:opacity-90 transition duration-200 flex items-center justify-center"
      >
        {loading ? "Finding Route..." : "Find Best Route"}
      </button>

      {/* Route Info */}
      {distance && duration && (
        <div className="mt-4 p-4 bg-gray-100 rounded-lg shadow text-center">
          <p className="text-lg font-semibold text-gray-700">Distance: <span className="text-blue-600">{distance} km</span></p>
          <p className="text-lg font-semibold text-gray-700">Estimated Time: <span className="text-green-600">{duration} min</span></p>
        </div>
      )}

      {/* Map Display */}
      <MapContainer center={startCoords} zoom={6} className="mt-6 rounded-lg shadow-xl" style={{ height: "500px", width: "100%" }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <Marker position={startCoords}>
          <Popup><FaMapMarkerAlt className="text-blue-600" /> Start Point</Popup>
        </Marker>
        <Marker position={endCoords}>
          <Popup><FaMapMarkerAlt className="text-red-600" /> Destination</Popup>
        </Marker>
        {route.length > 0 && <Polyline positions={route} color="blue" weight={5} />} 
      </MapContainer>
    </div>
  );
}