import PropTypes from "prop-types";
import { MapContainer, TileLayer, Marker, Polyline, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css"; // Ensure Leaflet styles are loaded

// Import Leaflet marker icons
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

// Fix missing marker icons in Leaflet
const customIcon = new L.Icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41], // Default marker size
  iconAnchor: [12, 41], // Adjusts marker positioning
  popupAnchor: [1, -34], // Adjusts popup positioning
});

export default function MapDisplay({ startCoords, endCoords, route }) {
    console.log("Start Coordinates:", startCoords);
    console.log("End Coordinates:", endCoords);
    console.log("Route:", route);

    return (
        <MapContainer 
            center={startCoords || [37.7749, -122.4194]} 
            zoom={6} 
            className="mt-6 rounded-lg shadow-xl" 
            style={{ height: "500px", width: "100%" }}
        >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

            {/* Markers with Fixed Icons */}
            {startCoords?.length === 2 && (
                <Marker position={startCoords} icon={customIcon}>
                    <Popup>Start Point</Popup>
                </Marker>
            )}
            {endCoords?.length === 2 && (
                <Marker position={endCoords} icon={customIcon}>
                    <Popup>End Point</Popup>
                </Marker>
            )}

            {/* Route */}
            {route.length > 0 && (
                <Polyline positions={route.map(([lon, lat]) => [lat, lon])} color="blue" weight={5} />
            )}
        </MapContainer>
    );
}

MapDisplay.propTypes = {
    startCoords: PropTypes.arrayOf(PropTypes.number),
    endCoords: PropTypes.arrayOf(PropTypes.number),
    route: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.number)).isRequired,
};
