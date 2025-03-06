import PropTypes from "prop-types";

export default function RouteInfo({ distance, duration }) {
  if (!distance || !duration) return null;
  return (
    <div className="mt-4 p-4 bg-gray-100 rounded-lg text-center">
      <p className="text-lg font-semibold">Distance: {distance} km</p>
      <p className="text-lg font-semibold">Estimated Time: {duration} min</p>
    </div>
  );
}

RouteInfo.propTypes = {
  distance: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  duration: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};