import PropTypes from "prop-types";
import { MapContainer, TileLayer, Marker, Polyline, Popup } from "react-leaflet";

export default function MapDisplay({ startCoords, endCoords, route }) {
    return (
        <MapContainer center={startCoords || [37.7749, -122.4194]} zoom={6} className="mt-6 rounded-lg shadow-xl" style={{ height: "500px", width: "100%" }}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            {startCoords && <Marker position={startCoords}><Popup>Start Point</Popup></Marker>}
            {endCoords && <Marker position={endCoords}><Popup>End Point</Popup></Marker>}
            {route.length > 0 && <Polyline positions={route} color="blue" weight={5} />}
        </MapContainer>
    );
}

MapDisplay.propTypes = {
    startCoords: PropTypes.arrayOf(PropTypes.number),
    endCoords: PropTypes.arrayOf(PropTypes.number),
    route: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.number)).isRequired,
};
