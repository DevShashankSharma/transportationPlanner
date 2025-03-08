import PropTypes from "prop-types";
import { MapContainer, TileLayer, Marker, Polyline, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, useState } from "react";
import axios from "axios";

// Fix missing marker icons in Leaflet
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

const customIcon = new L.Icon({
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
});

const API_KEY = "5bd4c6f7f2d544bebacf175696cbf884"; // Replace with your actual API key

// Component to auto-adjust map view to show both points
function MapAutoFit({ startCoords, endCoords }) {
    const map = useMap();

    useEffect(() => {
        if (startCoords && endCoords) {
            const bounds = L.latLngBounds([startCoords, endCoords]);
            map.fitBounds(bounds, { padding: [50, 50] }); // Fit both markers within view
        } else if (startCoords) {
            map.setView(startCoords, 12);
        } else if (endCoords) {
            map.setView(endCoords, 12);
        }
    }, [startCoords, endCoords, map]);

    return null;
}

export default function MapDisplay({ startCoords, endCoords }) {
    const [route, setRoute] = useState([]); // Stores route coordinates

    useEffect(() => {
        if (startCoords && endCoords) {
            getRoute();
        }
    }, [startCoords, endCoords]);

    const getRoute = async () => {
        try {
            if (!startCoords || !endCoords) return;

            const response = await axios.post(
                `https://api.openrouteservice.org/v2/directions/driving-car`,
                {
                    coordinates: [[startCoords[1], startCoords[0]], [endCoords[1], endCoords[0]]], // Swap lat/lon
                },
                {
                    headers: { Authorization: `Bearer ${API_KEY}` },
                }
            );

            // Extract coordinates and convert to Leaflet format [lat, lon]
            const routeCoords = response.data.routes[0].geometry.coordinates.map(([lon, lat]) => [lat, lon]);
            setRoute(routeCoords);
            console.log("Route coordinates:", routeCoords);
        } catch (error) {
            console.error("Error fetching route:", error);
        }
    };

    return (
        <MapContainer
            center={startCoords || [37.7749, -122.4194]}
            zoom={6}
            className="mt-6 rounded-lg shadow-xl"
            style={{ height: "500px", width: "100%" }}
        >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <MapAutoFit startCoords={startCoords} endCoords={endCoords} />

            {/* Start and End Markers */}
            {startCoords && (
                <Marker position={startCoords} icon={customIcon}>
                    <Popup>Start Point</Popup>
                </Marker>
            )}
            {endCoords && (
                <Marker position={endCoords} icon={customIcon}>
                    <Popup>End Point</Popup>
                </Marker>
            )}

            {/* Draw Route Line */}
            {route.length > 0 && (
                <Polyline positions={route} color="blue" weight={5} />
            )}
        </MapContainer>
    );
}

MapDisplay.propTypes = {
    startCoords: PropTypes.arrayOf(PropTypes.number),
    endCoords: PropTypes.arrayOf(PropTypes.number),
};
